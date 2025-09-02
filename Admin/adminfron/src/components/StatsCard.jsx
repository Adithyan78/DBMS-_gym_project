// components/StatsCard.js
import React from 'react';

const StatsCard = ({ title, value, icon, change, trend }) => {
  return (
    <div className="stats-card">
      <div className="stats-info">
        <h3>{title}</h3>
        <p className="stats-value">{value}</p>
        <p className={`stats-change ${trend}`}>
          <i className={`fas fa-arrow-${trend === 'up' ? 'up' : 'down'}`}></i>
          {change}
        </p>
      </div>
      <div className="stats-icon">
        <i className={icon}></i>
      </div>
    </div>
  );
};

export default StatsCard;