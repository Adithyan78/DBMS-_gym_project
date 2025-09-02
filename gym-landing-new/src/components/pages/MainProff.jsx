import React, { useEffect, useState } from "react";
import axios from "axios";
import "./MainProff.css";

const MainProff = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [plans, setPlans] = useState([]);
  const [selectedPlanId, setSelectedPlanId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchUserDetails = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/auth/user-full-details", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserDetails(res.data);
        setSelectedPlanId(res.data.plan_id);
      } catch (err) {
        console.error("Error fetching user details:", err);
      }
    };

    const fetchPlans = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/auth/plans", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPlans(res.data);
      } catch (err) {
        console.error("Error fetching plans:", err);
      }
    };

    fetchUserDetails();
    fetchPlans();
  }, []);

  const getPlanFeatures = (planName) => {
    const planFeatures = {
      basic: [
        { label: "Gym Access", included: true },
        { label: "Free Weights Area", included: true },
        { label: "Cardio", included: false },
        { label: "Personal Trainer", included: false },
        { label: "Locker & Shower", included: false }
      ],
      premium: [
        { label: "Gym Access", included: true },
        { label: "Free Weights Area", included: true },
        { label: "Cardio", included: true },
        { label: "Personal Trainer", included: true },
        { label: "Locker & Shower", included: false }
      ],
      elite: [
        { label: "Gym Access", included: true },
        { label: "Free Weights Area", included: true },
        { label: "Cardio", included: true },
        { label: "Personal Trainer", included: true },
        { label: "Locker & Shower", included: true }
      ]
    };
    
    const normalizedPlanName = planName?.toLowerCase().replace(/[^a-z]/g, '') || 'basic';
    if (normalizedPlanName.includes('elite')) return planFeatures.elite;
    if (normalizedPlanName.includes('premium')) return planFeatures.premium;
    return planFeatures.basic;
  };

  const handleUpdatePlan = async () => {
    try {
      const token = localStorage.getItem("token");
      const planIdNum = Number(selectedPlanId);

      if (!planIdNum) {
        alert("Please select a valid plan.");
        return;
      }

      await axios.put(
        "http://localhost:5000/api/auth/update-plan",
        { planId: planIdNum },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updatedPlan = plans.find(p => p.plan_id === planIdNum);
      setUserDetails(prev => ({
        ...prev,
        plan_id: updatedPlan.plan_id,
        plan_name: updatedPlan.plan_name,
        price: updatedPlan.price
      }));

      alert("Plan updated successfully!");
    } catch (err) {
      console.error("Error updating plan:", err);
      const message = err.response?.data?.msg || "Failed to update plan";
      alert(message);
    }
  };

  return (
    <div className="dashboard-container">
      {/* Background decorative elements */}
      <div className="bg-shapes">
        <div className="shape-1"></div>
        <div className="shape-2"></div>
        <div className="shape-3"></div>
      </div>
      
      <div className="dashboard-header">
        <h1>Fitness <span className="accent-text">Dashboard</span></h1>
        <p className="header-subtitle">Track your fitness journey</p>
        <div className="header-decoration">
          <div className="decoration-line"></div>
          <div className="decoration-dot"></div>
          <div className="decoration-line"></div>
        </div>
      </div>

      {userDetails && plans.length ? (
        <div className="dashboard-content">
          {/* Profile Card */}
          <div className="user-card card-hover">
            <div className="card-corner"></div>
            <div className="card-header">
              <h2>
                <span className="icon-wrapper">👤</span>
                Profile Information
              </h2>
              <div className="status-indicator active">
                <span className="pulse-dot"></span>
                Active Member
              </div>
            </div>
            <div className="card-content">
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Name:</span>
                  <span className="info-value">{userDetails.user_name}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Email:</span>
                  <span className="info-value">{userDetails.email}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Age:</span>
                  <span className="info-value">{userDetails.age}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Phone:</span>
                  <span className="info-value">{userDetails.phone}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Gender:</span>
                  <span className="info-value">{userDetails.gender}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Joined:</span>
                  <span className="info-value">{new Date(userDetails.joined_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Plan Card */}
          <div className="plan-card card-hover">
            <div className="card-corner"></div>
            <div className="card-header">
              <h2>
                <span className="icon-wrapper">🏆</span>
                Membership Plan
              </h2>
            </div>
            <div className="plan-details">
              <div className="plan-badge">{userDetails.plan_name}</div>
              <div className="plan-price">{userDetails.plan_name} : ₹{userDetails.price}</div>

              <div className="plan-features">
                {getPlanFeatures(userDetails.plan_name).map((feature, i) => (
                  <div key={i} className={`feature ${feature.included ? 'included' : 'not-included'}`}>
                    <span className="feature-icon">
                      {feature.included ? '✓' : '✗'}
                    </span>
                    {feature.label}
                  </div>
                ))}
              </div>

              {/* Plan Update Section */}
              <div className="plan-update-section">
                <h3>Upgrade Your Plan</h3>
                <div className="plan-update">
                  <select value={selectedPlanId} onChange={(e) => setSelectedPlanId(e.target.value)}>
                    {plans.map(plan => (
                      <option key={plan.plan_id} value={plan.plan_id}>
                        {plan.plan_name} - ₹{plan.price}
                      </option>
                    ))}
                  </select>
                  <button className="update-btn" onClick={handleUpdatePlan}>
                    <span className="btn-text">Update Plan</span>
                    <span className="btn-icon">→</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="stats-section">
            <h2 className="stats-title">Your Fitness Stats</h2>
            <div className="stats-cards">
              <div className="stat-card card-hover">
                <div className="stat-icon">🏋️</div>
                <div className="stat-value">12</div>
                <div className="stat-label">Workouts This Month</div>
                <div className="stat-progress">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{width: '80%'}}></div>
                  </div>
                  <span className="progress-text">80% of goal</span>
                </div>
              </div>
              
              <div className="stat-card card-hover">
                <div className="stat-icon">📅</div>
                <div className="stat-value">{Math.floor((new Date() - new Date(userDetails.joined_at)) / (1000*60*60*24))}</div>
                <div className="stat-label">Days as Member</div>
                <div className="member-badge">Loyal Member</div>
              </div>
              
              <div className="stat-card card-hover">
                <div className="stat-icon">🎯</div>
                <div className="stat-value">85%</div>
                <div className="stat-label">Attendance Rate</div>
                <div className="attendance-trend">↑ 5% from last month</div>
              </div>
            </div>
          </div>

        </div>
      ) : (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your fitness journey...</p>
        </div>
      )}
    </div>
  );
};

export default MainProff;