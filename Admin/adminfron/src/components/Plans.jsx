import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Plans.css';

const Plans = () => {
  const [plans, setPlans] = useState([]);
  const [editingPlan, setEditingPlan] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    plan_name: '',
    price: ''
  });

  // Load plans from backend
  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/auth/public/plans");
      setPlans(res.data);
    } catch (err) {
      console.error("Error fetching plans:", err);
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Start adding a new plan
  const handleAddNew = () => {
    setIsAdding(true);
    setEditingPlan(null);
    setFormData({
      plan_name: '',
      price: ''
    });
  };

  // Start editing a plan
  const handleEdit = (plan) => {
    setEditingPlan(plan.plan_id);
    setIsAdding(false);
    setFormData({
      plan_name: plan.plan_name,
      price: plan.price
    });
  };

  // Cancel editing/adding
  const handleCancel = () => {
    setEditingPlan(null);
    setIsAdding(false);
    setFormData({ plan_name: '', price: '' });
  };

  // Save plan (add or update via API)
  const handleSave = async () => {
    try {
      if (isAdding) {
        await axios.post("http://localhost:5000/api/auth/plans", formData);
      } else if (editingPlan) {
        await axios.put(`http://localhost:5000/api/auth/plans/${editingPlan}`, formData);
      }
      fetchPlans();
      handleCancel();
    } catch (err) {
      console.error("Error saving plan:", err);
    }
  };

  // Delete a plan
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this plan?")) {
      try {
        await axios.delete(`http://localhost:5000/api/auth/plans/${id}`);
        fetchPlans();
      } catch (err) {
        console.error("Error deleting plan:", err);
      }
    }
  };

  return (
    <div className="plans-management-container">
      <div className="plans-management-header">
        <div className="plans-header-content">
          <h2>Membership Plans</h2>
          <p>Create and manage subscription plans for your members</p>
        </div>
        <button className="plans-add-btn" onClick={handleAddNew}>
          <span className="plans-btn-icon">+</span> Add New Plan
        </button>
      </div>

      {isAdding && (
        <div className="plans-form-card">
          <h3>Add New Plan</h3>
          <div className="plans-form-content">
            <div className="plans-form-group">
              <label>Plan Name</label>
              <input
                type="text"
                name="plan_name"
                value={formData.plan_name}
                onChange={handleChange}
                placeholder="e.g., Premium Membership"
              />
            </div>
            <div className="plans-form-group">
              <label>Price (₹)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="29.99"
                step="0.01"
              />
            </div>
          </div>
          <div className="plans-form-actions">
            <button className="plans-cancel-btn" onClick={handleCancel}>Cancel</button>
            <button className="plans-save-btn" onClick={handleSave}>Save Plan</button>
          </div>
        </div>
      )}

      <div className="plans-grid-container">
        {plans.map(plan => (
          <div key={plan.plan_id} className="plans-card-item">
            {editingPlan === plan.plan_id ? (
              <div className="plans-edit-form">
                <h3>Edit Plan</h3>
                <div className="plans-form-content">
                  <div className="plans-form-group">
                    <label>Plan Name</label>
                    <input
                      type="text"
                      name="plan_name"
                      value={formData.plan_name}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="plans-form-group">
                    <label>Price (₹)</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      step="0.01"
                    />
                  </div>
                </div>
                <div className="plans-form-actions">
                  <button className="plans-cancel-btn" onClick={handleCancel}>Cancel</button>
                  <button className="plans-save-btn" onClick={handleSave}>Save Changes</button>
                </div>
              </div>
            ) : (
              <>
                <div className="plans-card-content">
                  <div className="plans-card-header">
                    <h3>{plan.plan_name}</h3>
                    <span className="plans-price">₹{plan.price}</span>
                  </div>
                  <div className="plans-card-details">
                    <div className="plans-detail-item">
                      <span className="plans-detail-label">Plan ID:</span>
                      <span className="plans-detail-value">{plan.plan_id}</span>
                    </div>
                  </div>
                </div>
                <div className="plans-card-actions">
                  <button className="plans-edit-btn" onClick={() => handleEdit(plan)}>
                    <span className="plans-btn-icon">✏️</span> Edit
                  </button>
                  <button className="plans-delete-btn" onClick={() => handleDelete(plan.plan_id)}>
                    <span className="plans-btn-icon">🗑️</span> Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Plans;