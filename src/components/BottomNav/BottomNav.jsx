import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="navbar navbar-light bg-white fixed-bottom border-top">
      <div className="container-fluid p-0">
        <div className="row g-0 w-100">
          <div className="col-4">
            <button 
              className={`btn w-100 d-flex flex-column align-items-center py-2 ${
                location.pathname === '/' ? 'text-primary' : 'text-secondary'
              }`}
              onClick={() => navigate('/')}
            >
              <i className="bi bi-house-door fs-4"></i>
              <small>Главная</small>
            </button>
          </div>
          <div className="col-4">
            <button className="btn w-100 d-flex flex-column align-items-center py-2 text-secondary">
              <i className="bi bi-book fs-4"></i>
              <small>EDU</small>
            </button>
          </div>
          <div className="col-4">
            <button className="btn w-100 d-flex flex-column align-items-center py-2 text-secondary">
              <i className="bi bi-person fs-4"></i>
              <small>Профиль</small>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default BottomNav; 