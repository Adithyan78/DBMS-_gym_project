import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ProfileCom.css"; // We'll update this CSS file

const plans = [
  {
    id: 1,
    name: "Basic",
    price: "₹800",
    features: [
      { label: "Gym Access", included: true },
      { label: "Free Weights Area", included: true },
      { label: "Cardio", included: false },
      { label: "Personal Trainer", included: false },
      { label: "Locker & Shower", included: false },
    ],
  },
  {
    id: 2,
    name: "Premium",
    price: "₹1300",
    features: [
      { label: "Gym Access", included: true },
      { label: "Free Weights Area", included: true },
      { label: "Cardio", included: true },
      { label: "Personal Trainer", included: true },
      { label: "Locker & Shower", included: false },
    ],
  },
  {
    id: 3,
    name: "Elite",
    price: "₹1500",
    features: [
      { label: "Gym Access", included: true },
      { label: "Free Weights Area", included: true },
      { label: "Cardio", included: true },
      { label: "Personal Trainer", included: true },
      { label: "Locker & Shower", included: true },
    ],
  },
];

const ProfileCom = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    age: "",
    gender: "",
    phone: "",
  });

  const [selectedPlan, setSelectedPlan] = useState(null);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!selectedPlan) {
      setMessage("Please select a plan!");
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/complete-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          planId: selectedPlan,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.msg || "Error completing profile");
      }

      setMessage("✅ Profile completed successfully!");
      setTimeout(() => navigate("/main"), 1500);
    } catch (err) {
      console.error(err);
      setMessage(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="profile-container-black">
      {/* Header Section */}
      <div className="profile-header">
        <h2 className="profile-title">COMPLETE YOUR PROFILE</h2>
        <div className="red-divider"></div>
        <p className="profile-subtitle">Join our fitness community</p>
      </div>

      {/* User Details Form */}
      <div className="form-section">
        <h3 className="section-title">PERSONAL INFORMATION</h3>
        <div className="input-grid">
          <div className="input-group">
            <label className="input-label">AGE</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              required
              disabled={isSubmitting}
              className="custom-input"
              placeholder="Enter your age"
            />
          </div>

          <div className="input-group">
            <label className="input-label">GENDER</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
              disabled={isSubmitting}
              className="custom-select"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="input-group">
            <label className="input-label">PHONE NUMBER</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              disabled={isSubmitting}
              className="custom-input"
              placeholder="Enter your phone number"
            />
          </div>
        </div>
      </div>

      {/* Plan Selection Section */}
      <div className="plans-section">
        <h3 className="section-title">CHOOSE YOUR PLAN</h3>
        <p className="section-subtitle">Select the membership that fits your goals</p>
        
        <div className="plans-grid">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`plan-card-black ${selectedPlan === plan.id ? "selected-red" : ""} ${
                isSubmitting ? "disabled-card" : ""
              }`}
              onClick={() => !isSubmitting && setSelectedPlan(plan.id)}
            >
              <div className="plan-header">
                <h4 className="plan-name">{plan.name}</h4>
                <p className="plan-price">{plan.price}<span className="price-month">/month</span></p>
              </div>
              
              <ul className="features-list">
                {plan.features.map((f, idx) => (
                  <li key={idx} className={f.included ? "feature-included" : "feature-excluded"}>
                    {f.included ? "✓ " : "✗ "}{f.label}
                  </li>
                ))}
              </ul>
              
              <div className="plan-badge">
                {selectedPlan === plan.id && "SELECTED"}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Message and Submit Button */}
      <div className="action-section">
        {message && (
          <div className={`message-box ${message.includes("✅") ? "success-message" : "error-message"}`}>
            {message}
          </div>
        )}
        
        <button
          className="complete-btn-red"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="spinner"></span>
              PROCESSING...
            </>
          ) : (
            "COMPLETE PROFILE & GET STARTED"
          )}
        </button>
      </div>
    </div>
  );
};

export default ProfileCom;