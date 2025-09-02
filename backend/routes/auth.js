const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

const router = express.Router();

// -------------------- AUTH MIDDLEWARE --------------------
const auth = (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ msg: "No token, authorization denied" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id: user.id, email: user.email }
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};

// ---------------- SIGNUP ----------------
router.post("/signup", (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ msg: "Please fill all fields" });
  }

  db.query("SELECT * FROM signup WHERE email = ?", [email], async (err, result) => {
    if (err) return res.status(500).json({ msg: "Database error" });

    if (result.length > 0) {
      return res.status(400).json({ msg: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    db.query(
      "INSERT INTO signup (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword],
      (err, result) => {
        if (err) return res.status(500).json({ msg: "Error creating user" });

        // After signup, route user to profile completion
        return res.status(201).json({
          msg: "Signup successful",
          signupId: result.insertId
        });
      }
    );
  });
});

// ---------------- LOGIN ----------------
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.query("SELECT * FROM signup WHERE email = ?", [email], async (err, result) => {
    if (err) return res.status(500).json({ msg: "Database error" });

    if (result.length === 0) return res.status(400).json({ msg: "User not found" });

    const user = result[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    // Generate token
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Return token + signupId
    return res.json({
      msg: "Login successful",
      token,
      signupId: user.id
    });
  });
});

// ---------------- CHECK PROFILE (PROTECTED) ----------------
// THIS IS THE CORRECTED ENDPOINT THAT MATCHES THE FRONTEND
router.get("/check-profile", auth, (req, res) => {
  const userId = req.user.id; // From the verified token

  db.query("SELECT * FROM users WHERE signup_id = ?", [userId], (err, result) => {
    if (err) return res.status(500).json({ msg: "Database error" });

    if (result.length > 0) {
      return res.json({ completed: true });
    } else {
      return res.json({ completed: false });
    }
  });
});

// ---------------- COMPLETE PROFILE (PROTECTED) ----------------
router.post("/complete-profile", auth, (req, res) => {
  const userId = req.user.id; // From the verified token
  const { age, gender, phone, planId } = req.body;

  if (!age || !gender || !phone || !planId) {
    return res.status(400).json({ msg: "All fields are required" });
  }

  db.query(
    "INSERT INTO users (signup_id, age, gender, phone, plan_id) VALUES (?, ?, ?, ?, ?)",
    [userId, age, gender, phone, planId],
    (err, result) => {
      if (err) return res.status(500).json({ msg: "Error saving profile" });
      return res.json({ msg: "Profile completed successfully" });
    }
  );
});

// ---------------- GET USER DETAILS WITH PLAN (PROTECTED) ----------------
router.get("/user-full-details", auth, (req, res) => {
  const signupId = req.user.id;  // from token payload (signup table id)

  const sql = `
    SELECT 
        u.user_id,
        s.id AS signup_id,
        s.name AS user_name,
        s.email,
        u.age,
        u.gender,
        u.phone,
        p.plan_name,
        p.price,
        u.joined_at
    FROM users u
    JOIN signup s ON u.signup_id = s.id
    LEFT JOIN plans p ON u.plan_id = p.plan_id
    WHERE u.signup_id = ?;
  `;

  db.query(sql, [signupId], (err, results) => {
    if (err) {
      console.error("Error fetching user details:", err);
      return res.status(500).json({ message: "Server error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(results[0]);  // send first (since one-to-one relation)
  });
});

// ---------------- UPDATE PLAN (PROTECTED) ----------------
router.put("/update-plan", auth, (req, res) => {
  const signupId = req.user.id; // comes from JWT token payload
  const { planId } = req.body;

  if (!planId) {
    return res.status(400).json({ msg: "Plan ID is required" });
  }

  // Update user's plan in the users table
  const sql = `UPDATE users SET plan_id = ? WHERE signup_id = ?`;

  db.query(sql, [planId, signupId], (err, result) => {
    if (err) {
      console.error("Error updating plan:", err);
      return res.status(500).json({ msg: "Database error" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ msg: "User profile not found. Complete profile first." });
    }

    res.json({ msg: "Plan updated successfully" });
  });
});
//get plans
// auth.js
router.get("/plans", auth, (req, res) => {
  db.query("SELECT * FROM plans", (err, result) => {
    if (err) return res.status(500).json({ msg: "Database error" });
    res.json(result);
  });
});

// Get all plans (public)
router.get("/public/plans", (req, res) => {
  db.query("SELECT * FROM plans", (err, result) => {
    if (err) return res.status(500).json({ msg: "Database error" });
    res.json(result);
  });
});


// ---------------- GET TOTAL USER COUNT (PROTECTED) ----------------
// ---------------- GET TOTAL USER COUNT (PROTECTED) ----------------
// Remove 'auth' middleware
// ---------------- GET TOTAL USER COUNT (PUBLIC) ----------------
// ---------------- GET TOTAL USER COUNT (PUBLIC) ----------------
router.get("/user-count", (req, res) => {
  const sql = "SELECT COUNT(*) AS totalUsers FROM users";

  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error fetching user count:", err);
      return res.status(500).json({ msg: "Database error" });
    }

    res.json({ totalUsers: result[0].totalUsers });
  });
});

// ---------------- GET NEW MEMBERS (LAST 2 DAYS) ----------------
// ---------------- GET NEW MEMBERS (LAST 2 DAYS) (PUBLIC) ----------------
// ---------------- GET NEW MEMBERS (LAST 2 DAYS) (PUBLIC) ----------------
router.get("/new-members", (req, res) => {
  const sql = `
    SELECT COUNT(*) AS newMembers 
    FROM users 
    WHERE joined_at >= DATE_SUB(NOW(), INTERVAL 2 DAY)
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error fetching new members:", err);
      return res.status(500).json({ msg: "Database error" });
    }

    res.json({ newMembers: result[0].newMembers });
  });
});


// ---------------- GET LAST 5 MEMBERS (PUBLIC) ----------------
// ---------------- GET LAST 5 MEMBERS (PUBLIC) ----------------
router.get("/recent-members", (req, res) => {
  const sql = `
    SELECT s.name, s.email, u.joined_at, p.plan_name
    FROM users u
    JOIN signup s ON u.signup_id = s.id
    LEFT JOIN plans p ON u.plan_id = p.plan_id
    ORDER BY u.joined_at DESC
    LIMIT 5
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching recent members:", err);
      return res.status(500).json({ msg: "Database error" });
    }

    res.json(results); // Array of last 5 members
  });
});

// routes/auth.js

// ---------------- GET TOTAL ELITE MEMBERS (PUBLIC) ----------------
// routes/auth.js
router.get("/elite-members-count", (req, res) => {
  const sql = `
    SELECT COUNT(*) AS eliteCount
    FROM users u
    JOIN plans p ON u.plan_id = p.plan_id
    WHERE p.plan_name = 'Elite Plan'
  `;
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching elite members count:", err);
      return res.status(500).json({ msg: "Database error" });
    }
    res.json({ eliteCount: results[0].eliteCount });
  });
});

// Get all users (public for admin dashboard)
router.get("/all-users", (req, res) => {
  const sql = `
    SELECT 
      u.user_id,
      s.name AS user_name,
      s.email,
      u.age,
      u.gender,
      u.phone,
      p.plan_name,
      u.joined_at
    FROM users u
    JOIN signup s ON u.signup_id = s.id
    LEFT JOIN plans p ON u.plan_id = p.plan_id
    ORDER BY u.joined_at DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching all users:", err);
      return res.status(500).json({ msg: "Database error" });
    }
    res.json(results);
  });
});

router.delete("/delete-user/:id", (req, res) => {
  const userId = req.params.id;

  db.query("DELETE FROM users WHERE user_id = ?", [userId], (err, result) => {
    if (err) {
      console.error("Error deleting user:", err);
      return res.status(500).json({ msg: "Database error" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ msg: "User not found" });
    }
    res.json({ msg: "User deleted successfully" });
  });
});

// Update user info (public)
router.put("/public/update-user/:id", (req, res) => {
  const userId = req.params.id;
  const { name, email, age, gender, phone, plan_id } = req.body;

  if (!name || !email || !age || !gender || !phone || !plan_id) {
    return res.status(400).json({ msg: "All fields are required" });
  }

  // 1️⃣ Get signup_id for this user
  const getSignupSql = `SELECT signup_id FROM users WHERE user_id = ?`;
  db.query(getSignupSql, [userId], (err, result) => {
    if (err || result.length === 0) return res.status(500).json({ msg: "User not found" });

    const signupId = result[0].signup_id;

    // 2️⃣ Update signup table (name & email)
    const updateSignupSql = `UPDATE signup SET name = ?, email = ? WHERE id = ?`;
    db.query(updateSignupSql, [name, email, signupId], (err2) => {
      if (err2) return res.status(500).json({ msg: "Error updating signup" });

      // 3️⃣ Update users table (age, gender, phone, plan_id)
      const updateUserSql = `
        UPDATE users
        SET age = ?, gender = ?, phone = ?, plan_id = ?
        WHERE user_id = ?
      `;
      db.query(updateUserSql, [age, gender, phone, plan_id, userId], (err3) => {
        if (err3) return res.status(500).json({ msg: "Error updating user" });

        res.json({ msg: "User updated successfully" });
      });
    });
  });
});

// ---------------- PLAN MANAGEMENT ----------------

// Add new plan
router.post("/plans", (req, res) => {
  const { plan_name, price } = req.body;

  if (!plan_name || !price) {
    return res.status(400).json({ msg: "Plan name and price are required" });
  }

  const sql = "INSERT INTO plans (plan_name, price) VALUES (?, ?)";
  db.query(sql, [plan_name, price], (err, result) => {
    if (err) {
      console.error("Error adding plan:", err);
      return res.status(500).json({ msg: "Database error" });
    }
    res.json({ msg: "Plan added successfully", planId: result.insertId });
  });
});

// Update plan (name or price)
router.put("/plans/:id", (req, res) => {
  const planId = req.params.id;
  const { plan_name, price } = req.body;

  if (!plan_name || !price) {
    return res.status(400).json({ msg: "Plan name and price are required" });
  }

  const sql = "UPDATE plans SET plan_name = ?, price = ? WHERE plan_id = ?";
  db.query(sql, [plan_name, price, planId], (err, result) => {
    if (err) {
      console.error("Error updating plan:", err);
      return res.status(500).json({ msg: "Database error" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ msg: "Plan not found" });
    }
    res.json({ msg: "Plan updated successfully" });
  });
});

// Delete plan
router.delete("/plans/:id", (req, res) => {
  const planId = req.params.id;

  db.query("DELETE FROM plans WHERE plan_id = ?", [planId], (err, result) => {
    if (err) {
      console.error("Error deleting plan:", err);
      return res.status(500).json({ msg: "Database error" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ msg: "Plan not found" });
    }
    res.json({ msg: "Plan deleted successfully" });
  });
});

// Get all plans (public)
router.get("/public/plans", (req, res) => {
  db.query("SELECT * FROM plans", (err, result) => {
    if (err) return res.status(500).json({ msg: "Database error" });
    res.json(result);
  });
});

// router.post("/add", (req, res) => {
//   const { name, salary, phone } = req.body;

//   const sql = `INSERT INTO trainers (name, salary, phone) VALUES (?, ?, ?)`;
//   db.query(sql, [name, salary, phone], (err, result) => {
//     if (err) {
//       console.error("Error adding trainer:", err);
//       return res.status(500).json({ error: "Database error" });
//     }
//     res.status(201).json({ message: "Trainer added successfully", trainer_id: result.insertId });
//   });
// });
// ✅ Get all trainers
router.get("/trainers", (req, res) => {
  const sql = "SELECT * FROM trainers";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json(results);
  });
});

// ✅ Get single trainer by ID
router.get("/trainers/:id", (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM trainers WHERE trainer_id = ?";
  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (results.length === 0) return res.status(404).json({ error: "Trainer not found" });
    res.json(results[0]);
  });
});

// ✅ Add a trainer
router.post("/addtrainers", (req, res) => {
  const { name, salary, phone } = req.body;
  const sql = "INSERT INTO trainers (name, salary, phone) VALUES (?, ?, ?)";
  db.query(sql, [name, salary, phone], (err, result) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json({ message: "Trainer added successfully", trainerId: result.insertId });
  });
});

// ✅ Update a trainer
router.put("/updatetrainers/:id", (req, res) => {
  const { id } = req.params;
  const { name, salary, phone } = req.body;
  const sql = "UPDATE trainers SET name = ?, salary = ?, phone = ? WHERE trainer_id = ?";
  db.query(sql, [name, salary, phone, id], (err, result) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json({ message: "Trainer updated successfully" });
  });
});

// ✅ Delete a trainer
router.delete("/deletetrainers/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM trainers WHERE trainer_id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json({ message: "Trainer deleted successfully" });
  });
});






module.exports = router;