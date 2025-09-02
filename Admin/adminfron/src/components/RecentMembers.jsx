import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const RecentMembers = () => {
  const [members, setMembers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecentMembers = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/auth/recent-members');
        // Transform backend data to match table structure
        const formattedMembers = res.data.map((member, index) => ({
          id: index + 1,
          name: member.name,
          joinDate: new Date(member.joined_at).toISOString().split('T')[0], // format YYYY-MM-DD
          membership: member.plan_name || 'Standard', // fallback if plan is null
          status: 'Active' // you can customize this based on your rules
        }));
        setMembers(formattedMembers);
      } catch (err) {
        console.error('Error fetching recent members:', err);
        setMembers([]);
      }
    };

    fetchRecentMembers();
  }, []);

  return (
    <div className="recent-members" style={{
      backgroundColor: '#0a0a0a',
      borderRadius: '8px',
      padding: '20px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
      border: '1px solid #333'
    }}>
      <div className="section-header" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '15px'
      }}>
        <h3 style={{ color: '#fff', fontWeight: '600', margin: 0 }}>Recent Members</h3>
        <button onClick={() => navigate('/members')} style={{
          backgroundColor: '#ff3838',
          color: 'white',
          border: 'none',
          padding: '8px 15px',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '0.9rem',
          transition: 'background-color 0.2s'
        }} onMouseOver={(e) => e.target.style.backgroundColor = '#e52e2e'} 
                onMouseOut={(e) => e.target.style.backgroundColor = '#ff3838'}>
          View All
        </button>
      </div>
      <table className="members-table" style={{
        width: '100%',
        borderCollapse: 'collapse',
        backgroundColor: '#0a0a0a'
      }}>
        <thead>
          <tr>
            <th style={{
              textAlign: 'left',
              padding: '12px 10px',
              borderBottom: '1px solid #333',
              color: '#bbb',
              fontWeight: '500',
              backgroundColor: '#0a0a0a'
            }}>Name</th>
            <th style={{
              textAlign: 'left',
              padding: '12px 10px',
              borderBottom: '1px solid #333',
              color: '#bbb',
              fontWeight: '500',
              backgroundColor: '#0a0a0a'
            }}>Join Date</th>
            <th style={{
              textAlign: 'left',
              padding: '12px 10px',
              borderBottom: '1px solid #333',
              color: '#bbb',
              fontWeight: '500',
              backgroundColor: '#0a0a0a'
            }}>Membership</th>
            <th style={{
              textAlign: 'left',
              padding: '12px 10px',
              borderBottom: '1px solid #333',
              color: '#bbb',
              fontWeight: '500',
              backgroundColor: '#0a0a0a'
            }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {members.map(member => (
            <tr key={member.id} style={{backgroundColor: '#0a0a0a'}}>
              <td style={{
                padding: '12px 10px',
                borderBottom: '1px solid #333',
                backgroundColor: '#0a0a0a'
              }}>
                <div className="member-info" style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=ff3838&color=fff`}
                    alt={member.name}
                    style={{
                      width: '35px',
                      height: '35px',
                      borderRadius: '50%'
                    }}
                  />
                  <span style={{ color: '#fff' }}>{member.name}</span>
                </div>
              </td>
              <td style={{
                padding: '12px 10px',
                borderBottom: '1px solid #333',
                color: '#fff',
                backgroundColor: '#0a0a0a'
              }}>{member.joinDate}</td>
              <td style={{
                padding: '12px 10px',
                borderBottom: '1px solid #333',
                color: '#fff',
                backgroundColor: '#0a0a0a'
              }}>{member.membership}</td>
              <td style={{
                padding: '12px 10px',
                borderBottom: '1px solid #333',
                backgroundColor: '#0a0a0a'
              }}>
                <span className={`status-badge ${member.status.toLowerCase()}`} style={{
                  padding: '5px 10px',
                  borderRadius: '20px',
                  fontSize: '0.8rem',
                  fontWeight: '500',
                  backgroundColor: 'rgba(255, 56, 56, 0.2)',
                  color: '#ff3838'
                }}>
                  {member.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecentMembers;