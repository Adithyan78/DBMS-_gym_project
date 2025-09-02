import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/Sidebar.css';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        <ul>
          <li className={isActive('/') ? 'active' : ''} onClick={() => navigate('/')}>
            <i className="fas fa-tachometer-alt"></i>
            <span>Dashboard</span>
          </li>
          <li className={isActive('/members') ? 'active' : ''} onClick={() => navigate('/members')}>
            <i className="fas fa-users"></i>
            <span>Members</span>
          </li>
          <li className={isActive('/plans') ? 'active' : ''} onClick={() => navigate('/plans')}>
            <i className="fas fa-dumbbell"></i>
            <span>Plans</span>
          </li>
          <li className={isActive('/trainers') ? 'active' : ''} onClick={() => navigate('/trainers')}>
            <i className="fas fa-calendar-alt"></i>
            <span>Trainers</span>
          </li>
          <li className={isActive('/reports') ? 'active' : ''} onClick={() => navigate('/reports')}>
            <i className="fas fa-chart-line"></i>
            <span></span>
          </li>
          <li className={isActive('/settings') ? 'active' : ''} onClick={() => navigate('/settings')}>
            <i className="fas fa-cog"></i>
            <span></span>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;