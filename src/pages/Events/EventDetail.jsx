import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getEventById, formatDate, getCategoryName } from '../../utils/eventsUtils';
import RegistrationModal from './RegistrationModal';

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [showRegistration, setShowRegistration] = useState(false);

  useEffect(() => {
    const eventData = getEventById(id);
    if (eventData) {
      setEvent(eventData);
    }
  }, [id]);

  const getCategoryColor = (category) => {
    const colors = {
      academic: 'primary',
      research: 'info',
      sport: 'success',
      workshop: 'warning',
      culture: 'danger'
    };
    return colors[category] || 'secondary';
  };

  const getCategoryIcon = (category) => {
    const icons = {
      academic: 'bi-book',
      research: 'bi-lightbulb',
      sport: 'bi-trophy',
      workshop: 'bi-tools',
      culture: 'bi-music-note'
    };
    return icons[category] || 'bi-calendar-event';
  };

  if (!event) {
    return (
      <div className="container-fluid px-3 py-4">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Загрузка...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid px-3 py-4">
      <div className="mb-3">
        <button
          className="btn btn-outline-secondary"
          onClick={() => navigate('/events')}
        >
          <i className="bi bi-arrow-left me-1"></i>
          Назад к событиям
        </button>
      </div>

      <div className="row">
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm mb-4">
            <img
              src={event.image}
              className="card-img-top"
              alt={event.title}
              style={{ height: '400px', objectFit: 'cover' }}
            />
            <div className="card-body">
              <div className="d-flex align-items-center mb-3">
                <span className={`badge bg-${getCategoryColor(event.category)} me-2`}>
                  <i className={`${getCategoryIcon(event.category)} me-1`}></i>
                  {getCategoryName(event.category)}
                </span>
                {event.registrationRequired && (
                  <span className="badge bg-warning">
                    <i className="bi bi-person-plus me-1"></i>
                    Требуется регистрация
                  </span>
                )}
              </div>

              <h2 className="card-title mb-3">{event.title}</h2>
              <p className="card-text lead">{event.shortDescription}</p>
              
              <div className="row mb-4">
                <div className="col-md-6">
                  <div className="d-flex align-items-center mb-2">
                    <i className="bi bi-calendar text-primary me-2"></i>
                    <div>
                      <div className="small text-muted">Дата</div>
                      <div className="fw-bold">{formatDate(event.date)}</div>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="d-flex align-items-center mb-2">
                    <i className="bi bi-clock text-info me-2"></i>
                    <div>
                      <div className="small text-muted">Время</div>
                      <div className="fw-bold">{event.time}</div>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="d-flex align-items-center mb-2">
                    <i className="bi bi-geo-alt text-success me-2"></i>
                    <div>
                      <div className="small text-muted">Место</div>
                      <div className="fw-bold">{event.location}</div>
                    </div>
                  </div>
                </div>
                {event.registrationRequired && (
                  <div className="col-md-6">
                    <div className="d-flex align-items-center mb-2">
                      <i className="bi bi-people text-warning me-2"></i>
                      <div>
                        <div className="small text-muted">Участники</div>
                        <div className="fw-bold">
                          {event.currentParticipants}/{event.maxParticipants}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="mb-4">
                <h5>Описание</h5>
                <p className="text-muted">{event.fullDescription}</p>
              </div>

              <div className="mb-4">
                <h5>Теги</h5>
                <div className="d-flex flex-wrap gap-2">
                  {event.tags.map((tag, index) => (
                    <span key={index} className="badge bg-light text-dark">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {event.registrationRequired && (
                <div className="mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="text-muted">Прогресс регистрации</span>
                    <span className="fw-bold">
                      {Math.round((event.currentParticipants / event.maxParticipants) * 100)}%
                    </span>
                  </div>
                  <div className="progress mb-3" style={{ height: '8px' }}>
                    <div
                      className="progress-bar"
                      style={{ width: `${(event.currentParticipants / event.maxParticipants) * 100}%` }}
                    ></div>
                  </div>
                  <small className="text-muted">
                    Осталось мест: {event.maxParticipants - event.currentParticipants}
                  </small>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-primary bg-opacity-10 border-0">
              <h5 className="mb-0">Действия</h5>
            </div>
            <div className="card-body">
              {event.registrationRequired ? (
                <button
                  className="btn btn-primary w-100 mb-3"
                  onClick={() => setShowRegistration(true)}
                  disabled={event.currentParticipants >= event.maxParticipants}
                >
                  <i className="bi bi-person-plus me-1"></i>
                  {event.currentParticipants >= event.maxParticipants ? 'Мест нет' : 'Зарегистрироваться'}
                </button>
              ) : (
                <button className="btn btn-outline-primary w-100 mb-3">
                  <i className="bi bi-calendar-plus me-1"></i>
                  Добавить в календарь
                </button>
              )}

              <button className="btn btn-outline-secondary w-100 mb-3">
                <i className="bi bi-share me-1"></i>
                Поделиться
              </button>

              <button className="btn btn-outline-info w-100">
                <i className="bi bi-download me-1"></i>
                Скачать информацию
              </button>
            </div>
          </div>

          <div className="card border-0 shadow-sm mt-3">
            <div className="card-header bg-info bg-opacity-10 border-0">
              <h6 className="mb-0">Похожие события</h6>
            </div>
            <div className="card-body">
              <div className="list-group list-group-flush">
                <a href="#" className="list-group-item list-group-item-action border-0 px-0">
                  <div className="d-flex w-100 justify-content-between">
                    <h6 className="mb-1">День науки</h6>
                    <small className="text-muted">15 марта</small>
                  </div>
                  <p className="mb-1 small text-muted">Научная конференция</p>
                </a>
                <a href="#" className="list-group-item list-group-item-action border-0 px-0">
                  <div className="d-flex w-100 justify-content-between">
                    <h6 className="mb-1">Студенческая весна</h6>
                    <small className="text-muted">20 апреля</small>
                  </div>
                  <p className="mb-1 small text-muted">Культурное мероприятие</p>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showRegistration && (
        <RegistrationModal
          event={event}
          show={showRegistration}
          onHide={() => setShowRegistration(false)}
        />
      )}
    </div>
  );
};

export default EventDetail; 