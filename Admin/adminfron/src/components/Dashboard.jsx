import React, { useEffect, useState } from 'react';
import StatsCard from './StatsCard';
import RecentMembers from './RecentMembers';
import '../styles/Dashboard.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const [totalMembers, setTotalMembers] = useState('...');
  const [newMembers, setNewMembers] = useState('...');
  const [eliteMembers, setEliteMembers] = useState('...');
  const [trainers, setTrainers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const fetchStats = async () => {
    try {
      // Fetch total members
      const totalRes = await axios.get('http://localhost:5000/api/auth/user-count');
      setTotalMembers(totalRes.data.totalUsers);

      // Fetch new members (last 2 days)
      const newRes = await axios.get('http://localhost:5000/api/auth/new-members');
      setNewMembers(newRes.data.newMembers);

      // Fetch total elite members
      const eliteRes = await axios.get('http://localhost:5000/api/auth/elite-members-count');
      setEliteMembers(eliteRes.data.eliteCount);
    } catch (err) {
      console.error('Error fetching stats:', err);
      setTotalMembers('N/A');
      setNewMembers('N/A');
      setEliteMembers('N/A');
    }
  };

  const fetchTrainers = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get('http://localhost:5000/api/auth/trainers');
      setTrainers(res.data);
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching trainers:', err);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchStats();
    fetchTrainers();

    // Set interval to fetch stats every 30 seconds
    const statsInterval = setInterval(fetchStats, 30000);

    // Clear interval on component unmount
    return () => clearInterval(statsInterval);
  }, []);

  const statsData = [
    { title: 'Total Members', value: totalMembers, icon: 'fas fa-users' },
    { title: 'New Members', value: newMembers, icon: 'fas fa-user-plus' },
    { title: 'Total Elite Members', value: eliteMembers, icon: 'fas fa-star' }
  ];

  return (
    <main className="dashboard">
      <div className="dashboard-header">
        <h2>Dashboard Overview</h2>
        <div className="date-filter">
          <select>
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>Last 90 Days</option>
          </select>
        </div>
      </div>

      <div className="stats-grid">
        {statsData.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      <div className="dashboard-content">
        
        <div className="trainers-container">
         
          
          <div className="section-header">
            <h3>Our Trainers</h3>
            <button onClick={() => navigate('/trainers')} onMouseOver={(e) => e.target.style.backgroundColor = '#e52e2e'} 
                onMouseOut={(e) => e.target.style.backgroundColor = '#ff3838'}>
          View All
        </button>
          </div>
          {isLoading ? (
            <div className="loading-placeholder">
              <p>Loading trainers...</p>
            </div>
          ) : trainers.length === 0 ? (
            <div className="no-trainers">
              <p>No trainers available</p>
            </div>
          ) : (
            <table className="trainers-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Salary</th>
                  <th>Phone</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {trainers.slice(0, 5).map((trainer) => (
                  <tr key={trainer.trainer_id}>
                    <td>{trainer.name}</td>
                    <td>₹{trainer.salary}</td>
                    <td>{trainer.phone}</td>
                    <td>
                      <span className="status-badge active">Active</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <RecentMembers />
      </div>
    </main>
  );
};

export default Dashboard;