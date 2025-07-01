import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Главная', icon: 'house-door' },
    { path: '/schedule', label: 'Расписание', icon: 'calendar-event' },
    { path: '/events', label: 'События', icon: 'calendar-event' },
    { path: '/profile', label: 'Профиль', icon: 'person' }
  ];

  return (
    <nav className="navbar navbar-light fixed-bottom border-top shadow-sm">
      <div className="container-fluid px-0">
        <div className="row g-0 w-100">
          {navItems.map(({ path, label, icon }) => (
            <div className="col text-center" key={path}>
              <button
                className={`btn w-100 d-flex flex-column align-items-center py-2 ${
                  location.pathname === path ? 'text-primary' : 'text-secondary'
                }`}
                onClick={() => navigate(path)}
              >
                <i className={`bi bi-${icon} fs-4`}></i>
                <small>{label}</small>
              </button>
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;