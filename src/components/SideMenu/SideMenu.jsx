import React from 'react';
import { useNavigate } from 'react-router-dom';

const SideMenu = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
    onClose();
  };

  return (
    <>
      <div className={`offcanvas offcanvas-start ${isOpen ? 'show' : ''}`} 
           tabIndex="-1" 
           style={{ visibility: isOpen ? 'visible' : 'hidden' }}>
        <div className="offcanvas-header">
          <h5 className="offcanvas-title">Меню</h5>
          <button 
            type="button" 
            className="btn-close" 
            onClick={onClose}
          ></button>
        </div>
        <div className="offcanvas-body p-0">
          <div className="list-group list-group-flush">
            <button 
              className="list-group-item list-group-item-action py-3"
              onClick={() => handleNavigation('/schedule')}
            >
              <i className="bi bi-calendar-event me-3"></i>
              Расписание
            </button>
            <button className="list-group-item list-group-item-action py-3">
              <i className="bi bi-journal-text me-3"></i>
              Силлабус
            </button>
            <button className="list-group-item list-group-item-action py-3">
              <i className="bi bi-chat-dots me-3"></i>
              Связь с преподавателями
            </button>
            <button className="list-group-item list-group-item-action py-3">
              <i className="bi bi-calculator me-3"></i>
              GPA калькулятор
            </button>
          </div>
        </div>
      </div>
      {isOpen && (
        <div 
          className="offcanvas-backdrop fade show"
          onClick={onClose}
        ></div>
      )}
    </>
  );
};

export default SideMenu; 