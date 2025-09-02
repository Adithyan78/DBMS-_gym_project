import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Trainers.css";

const api = axios.create({
  baseURL: "http://localhost:5000/api/auth",
});

const Trainers = () => {
  const [trainers, setTrainers] = useState([]);
  const [form, setForm] = useState({ name: "", salary: "", phone: "" });
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchTrainers();
  }, []);

  const fetchTrainers = async () => {
    try {
      setIsLoading(true);
      const res = await api.get("/trainers");
      setTrainers(res.data);
      setIsLoading(false);
    } catch (err) {
      setMessage("Error fetching trainers");
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addTrainer = async () => {
    if (!form.name || !form.salary || !form.phone) {
      setMessage("Please fill all fields");
      return;
    }
    
    try {
      setIsLoading(true);
      await api.post("/addtrainers", form);
      setForm({ name: "", salary: "", phone: "" });
      setMessage("Trainer added successfully ✅");
      fetchTrainers();
    } catch (err) {
      setMessage(err.response?.data?.error || "Error adding trainer");
      setIsLoading(false);
    }
  };

  const updateTrainer = async () => {
    if (!form.name || !form.salary || !form.phone) {
      setMessage("Please fill all fields");
      return;
    }
    
    try {
      setIsLoading(true);
      await api.put(`/updatetrainers/${editId}`, form);
      setForm({ name: "", salary: "", phone: "" });
      setEditId(null);
      setMessage("Trainer updated successfully ✅");
      fetchTrainers();
    } catch (err) {
      setMessage(err.response?.data?.error || "Error updating trainer");
      setIsLoading(false);
    }
  };

  const deleteTrainer = async (id) => {
    if (!window.confirm("Are you sure you want to delete this trainer?")) return;
    
    try {
      setIsLoading(true);
      await api.delete(`/deletetrainers/${id}`);
      setMessage("Trainer deleted successfully ❌");
      fetchTrainers();
    } catch (err) {
      setMessage("Error deleting trainer");
      setIsLoading(false);
    }
  };

  const editTrainer = (trainer) => {
    setForm({ name: trainer.name, salary: trainer.salary, phone: trainer.phone });
    setEditId(trainer.trainer_id);
    setMessage("");
  };

  const cancelEdit = () => {
    setEditId(null);
    setForm({ name: "", salary: "", phone: "" });
    setMessage("");
  };

  return (
    <div className="trainers-management-container">
      <div className="trainers-header">
        <h2>Trainer Management</h2>
        <p>Add, edit, and manage your gym trainers</p>
      </div>

      {message && (
        <div className={`trainers-message ${message.includes("✅") ? "success" : "error"}`}>
          {message}
        </div>
      )}

      <div className="trainers-form-card">
        <h3>{editId ? "Edit Trainer" : "Add New Trainer"}</h3>
        <div className="form-inputs">
          <div className="input-group">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              placeholder="Trainer name"
              onChange={handleChange}
            />
          </div>
          <div className="input-group">
            <label>Salary (₹)</label>
            <input
              type="number"
              step="0.01"
              name="salary"
              value={form.salary}
              placeholder="Salary amount"
              onChange={handleChange}
            />
          </div>
          <div className="input-group">
            <label>Phone</label>
            <input
              type="text"
              name="phone"
              value={form.phone}
              placeholder="Phone number"
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="form-actions">
          {editId ? (
            <>
              <button className="cancel-btn" onClick={cancelEdit}>
                Cancel
              </button>
              <button className="update-btn" onClick={updateTrainer} disabled={isLoading}>
                {isLoading ? "Updating..." : "Update Trainer"}
              </button>
            </>
          ) : (
            <button className="add-btn" onClick={addTrainer} disabled={isLoading}>
              {isLoading ? "Adding..." : "Add Trainer"}
            </button>
          )}
        </div>
      </div>

      <div className="trainers-table-container">
        <h3>Current Trainers</h3>
        {trainers.length === 0 ? (
          <div className="no-trainers">
            {isLoading ? "Loading trainers..." : "No trainers found. Add your first trainer above."}
          </div>
        ) : (
          <table className="trainers-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Salary (₹)</th>
                <th>Phone</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {trainers.map((t) => (
                <tr key={t.trainer_id}>
                  <td>{t.name}</td>
                  <td>{t.salary}</td>
                  <td>{t.phone}</td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="edit-btn" 
                        onClick={() => editTrainer(t)}
                        disabled={isLoading}
                      >
                        Edit
                      </button>
                      <button 
                        className="delete-btn" 
                        onClick={() => deleteTrainer(t.trainer_id)}
                        disabled={isLoading}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Trainers;