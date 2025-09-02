import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/Members.css';

const Members = () => {
  const [members, setMembers] = useState([]);
  const [plans, setPlans] = useState([]);
  const [editingMember, setEditingMember] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
    gender: '',
    phone: '',
    plan_id: ''
  });

  // Fetch all members
  const fetchMembers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/auth/all-users');
      setMembers(res.data || []);
    } catch (err) {
      console.error('Error fetching members:', err);
    }
  };

  // Fetch plans (public)
  const fetchPlans = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/auth/public/plans');
      setPlans(res.data || []);
    } catch (err) {
      console.error('Error fetching plans:', err);
    }
  };

  useEffect(() => {
    fetchMembers();
    fetchPlans();
  }, []);

  // Handle form changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Start editing a member
  const handleEdit = (member) => {
    setEditingMember(member.user_id);
    setFormData({
      name: member.user_name,
      email: member.email,
      age: member.age,
      gender: member.gender,
      phone: member.phone,
      plan_id: member.plan_id || ''
    });
  };

  // Cancel editing
  const handleCancel = () => {
    setEditingMember(null);
    setFormData({
      name: '',
      email: '',
      age: '',
      gender: '',
      phone: '',
      plan_id: ''
    });
  };

  // Update member (public endpoint)
  const handleUpdate = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/auth/public/update-user/${id}`, formData);
      fetchMembers();
      handleCancel();
    } catch (err) {
      console.error('Error updating member:', err.response?.data || err);
      alert(err.response?.data?.msg || 'Error updating member');
    }
  };

  // Delete member
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this member?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/auth/delete-user/${id}`);
      fetchMembers();
    } catch (err) {
      console.error('Error deleting member:', err.response?.data || err);
    }
  };

  return (
    <div className="members-page">
      <h2>Members Management</h2>
      <table className="members-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Age</th>
            <th>Gender</th>
            <th>Phone</th>
            <th>Plan</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {members.map((member) => (
            <tr key={member.user_id}>
              <td>
                {editingMember === member.user_id ? (
                  <input type="text" name="name" value={formData.name} onChange={handleChange} />
                ) : (
                  member.user_name
                )}
              </td>
              <td>
                {editingMember === member.user_id ? (
                  <input type="number" name="age" value={formData.age} onChange={handleChange} />
                ) : (
                  member.age
                )}
              </td>
              <td>
                {editingMember === member.user_id ? (
                  <select name="gender" value={formData.gender} onChange={handleChange}>
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                ) : (
                  member.gender
                )}
              </td>
              <td>
                {editingMember === member.user_id ? (
                  <input type="text" name="phone" value={formData.phone} onChange={handleChange} />
                ) : (
                  member.phone
                )}
              </td>
              <td>
                {editingMember === member.user_id ? (
                  <select name="plan_id" value={formData.plan_id} onChange={handleChange}>
                    <option value="">Select Plan</option>
                    {plans.map((plan) => (
                      <option key={plan.plan_id} value={plan.plan_id}>
                        {plan.plan_name}
                      </option>
                    ))}
                  </select>
                ) : (
                  member.plan_name
                )}
              </td>
              <td>
                {editingMember === member.user_id ? (
                  <>
                    <button className="update-btn" onClick={() => handleUpdate(member.user_id)}>
                      Save
                    </button>
                    <button className="cancel-btn" onClick={handleCancel}>
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button className="edit-btn" onClick={() => handleEdit(member)}>
                      Edit
                    </button>
                    <button className="delete-btn" onClick={() => handleDelete(member.user_id)}>
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Members;