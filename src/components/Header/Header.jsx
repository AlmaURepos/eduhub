import React, { useState, useRef } from 'react';
import { Overlay, Popover, Button } from 'react-bootstrap';

const Header = ({ onMenuClick }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    '📅 У вас пара в 10:00 в 2А-305',
    '📝 Новый силлабус добавлен в раздел EDU',
    '💬 Преподаватель добавил комментарий в чат'
  ]);
  const bellRef = useRef(null);

  const toggleNotifications = () => setShowNotifications(!showNotifications);

  const handleClearNotifications = () => setNotifications([]);

  return (
    <>
      <nav className="navbar navbar-light bg-white fixed-top border-bottom shadow-sm">
        <div className="container-fluid px-3 py-2 d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-3">
            <button className="btn p-0" onClick={onMenuClick} aria-label="Открыть меню">
              <i className="bi bi-list fs-3"></i>
            </button>
            <span className="navbar-brand mb-0 h1 fw-bold text-primary">EduHub</span>
          </div>
          <button
            className="btn p-0 position-relative"
            aria-label="Уведомления"
            onClick={toggleNotifications}
            ref={bellRef}
          >
            <i className="bi bi-bell fs-3"></i>
            {notifications.length > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {notifications.length}
                <span className="visually-hidden">новых уведомлений</span>
              </span>
            )}
          </button>
        </div>
      </nav>

      <Overlay
        target={bellRef.current}
        show={showNotifications}
        placement="bottom-end"
        rootClose
        onHide={() => setShowNotifications(false)}
      >
        <Popover id="notification-popover" className="shadow-sm" style={{ maxWidth: '320px', width: '100%' }}>
          <Popover.Header as="h5" className="d-flex justify-content-between align-items-center">
            <span>Уведомления</span>
            {notifications.length > 0 && (
              <Button variant="link" size="sm" onClick={handleClearNotifications} className="text-danger text-decoration-none">
                Очистить все
              </Button>
            )}
          </Popover.Header>
          <Popover.Body className="p-2">
            {notifications.length > 0 ? (
              notifications.map((note, idx) => (
                <div key={idx} className="small border-bottom pb-2 mb-2">
                  {note}
                </div>
              ))
            ) : (
              <div className="text-center text-muted small">Нет новых уведомлений</div>
            )}
          </Popover.Body>
        </Popover>
      </Overlay>
    </>
  );
};

export default Header;
