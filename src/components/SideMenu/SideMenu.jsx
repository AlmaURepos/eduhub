import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentTheme, toggleTheme, themes } from '../../utils/themeUtils';

const SideMenu = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [currentTheme, setCurrentTheme] = React.useState(getCurrentTheme());

  const handleNavigation = (path) => {
    navigate(path);
    onClose();
  };

  const handleThemeToggle = () => {
    const newTheme = toggleTheme();
    setCurrentTheme(newTheme);
  };

  return (
    <>
      <div
        className={`offcanvas offcanvas-start ${isOpen ? 'show' : ''}`}
        tabIndex="-1"
        style={{ visibility: isOpen ? 'visible' : 'hidden' }}
        aria-labelledby="offcanvasMenuLabel"
      >
        <div className="offcanvas-header border-bottom">
          <h5 className="offcanvas-title fw-bold text-primary" id="offcanvasMenuLabel">
            Меню
          </h5>
          <button
            type="button"
            className="btn-close"
            onClick={onClose}
            aria-label="Закрыть меню"
          ></button>
        </div>
        <div className="offcanvas-body p-0">
          <div className="list-group list-group-flush">
            <button
              className="list-group-item list-group-item-action py-3 d-flex align-items-center"
              onClick={() => handleNavigation('/schedule')}
            >
              <i className="bi bi-calendar-event me-3 fs-5 text-primary"></i>
              <span>Расписание</span>
            </button>
            <button
              className="list-group-item list-group-item-action py-3 d-flex align-items-center"
              onClick={() => handleNavigation('/grades')}
            >
              <i className="bi bi-graph-up me-3 fs-5 text-primary"></i>
              <span>Оценки</span>
            </button>
            <button
              className="list-group-item list-group-item-action py-3 d-flex align-items-center"
              onClick={() => handleNavigation('/testing')}
            >
              <i className="bi bi-patch-question me-3 fs-5 text-primary"></i>
              <span>Тестирование</span>
            </button>
            <button
              className="list-group-item list-group-item-action py-3 d-flex align-items-center"
              onClick={() => handleNavigation('/events')}
            >
              <i className="bi bi-calendar-event me-3 fs-5 text-primary"></i>
              <span>События</span>
            </button>
            <button className="list-group-item list-group-item-action py-3 d-flex align-items-center">
              <i className="bi bi-journal-text me-3 fs-5 text-primary"></i>
              <span>Силлабус</span>
            </button>
            <button className="list-group-item list-group-item-action py-3 d-flex align-items-center">
              <i className="bi bi-chat-dots me-3 fs-5 text-primary"></i>
              <span>Связь с преподавателями</span>
            </button>
            <button
              className="list-group-item list-group-item-action py-3 d-flex align-items-center"
              onClick={() => handleNavigation('/gpa')}
            >
              <i className="bi bi-calculator me-3 fs-5 text-primary"></i>
              <span>GPA калькулятор</span>
            </button>
            <button
              className="list-group-item list-group-item-action py-3 d-flex align-items-center"
              onClick={() => handleNavigation('/profile')}
            >
              <i className="bi bi-person-circle me-3 fs-5 text-primary"></i>
              <span>Мой профиль</span>
            </button>
            
            {/* Разделитель */}
            <div className="border-top my-2"></div>
            
            {/* Переключатель темы */}
            <button
              className="list-group-item list-group-item-action py-3 d-flex align-items-center justify-content-between"
              onClick={handleThemeToggle}
            >
              <div className="d-flex align-items-center">
                <i className={`bi ${currentTheme === 'light' ? 'bi-moon' : 'bi-sun'} me-3 fs-5 text-primary`}></i>
                <span>Тема</span>
              </div>
              <span className="badge bg-primary rounded-pill">
                {currentTheme === 'light' ? themes.dark.label : themes.light.label}
              </span>
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
