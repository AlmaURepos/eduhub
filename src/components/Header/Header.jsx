import React from 'react';

const Header = ({ onMenuClick }) => {
  return (
    <nav className="navbar navbar-light bg-white fixed-top border-bottom">
      <div className="container-fluid px-3">
        <div className="d-flex align-items-center gap-3">
          <button className="btn p-0" onClick={onMenuClick}>
            <i className="bi bi-list fs-4"></i>
          </button>
          <span className="navbar-brand mb-0 h1">EduHub</span>
        </div>
        <button className="btn p-0">
          <i className="bi bi-bell fs-4"></i>
        </button>
      </div>
    </nav>
  );
};

export default Header; 