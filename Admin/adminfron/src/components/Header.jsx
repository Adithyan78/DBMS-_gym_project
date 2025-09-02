import React from 'react';
import '../styles/Header.css';

const Header = () => {
  return (
    <header className="admin-header">
      <div className="header-left">
        <h1>
          <span className="athenix-red">Athenix</span> Admin Panel
        </h1>
      </div>
      <div className="header-right">
        <div className="admin-profile">
          <img src="https://ui-avatars.com/api/?name=Admin+User&background=ff3838&color=fff" alt="Admin" />
          <span>Admin User</span>
        </div>
      </div>
    </header>
  );
};

export default Header;