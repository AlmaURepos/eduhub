import React from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDate, getCategoryName } from '../../utils/eventsUtils';

const EventCard = ({ event }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/events/${event.id}`);
  };

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

  return (
    <div className="card border-0 shadow-sm h-100" style={{ cursor: 'pointer' }} onClick={handleCardClick}>
      <div className="position-relative">
        <img
          src={event.image}
          className="card-img-top"
          alt={event.title}
          style={{ height: '200px', objectFit: 'cover' }}
        />
        <div className="position-absolute top-0 start-0 m-2">
          <span className={`badge bg-${getCategoryColor(event.category)}`}>
            <i className={`${getCategoryIcon(event.category)} me-1`}></i>
            {getCategoryName(event.category)}
          </span>
        </div>
        {event.registrationRequired && (
          <div className="position-absolute top-0 end-0 m-2">
            <span className="badge bg-warning">
              <i className="bi bi-person-plus me-1"></i>
              Регистрация
            </span>
          </div>
        )}
      </div>
      
      <div className="card-body d-flex flex-column">
        <h5 className="card-title mb-2">{event.title}</h5>
        <p className="card-text text-muted small mb-3">{event.shortDescription}</p>
        
        <div className="mb-3">
          <div className="row text-center">
            <div className="col-6">
              <div className="small text-muted">Дата</div>
              <div className="fw-bold text-primary">{formatDate(event.date)}</div>
            </div>
            <div className="col-6">
              <div className="small text-muted">Время</div>
              <div className="fw-bold text-info">{event.time}</div>
            </div>
          </div>
        </div>

        <div className="mb-3">
          <div className="d-flex align-items-center text-muted small">
            <i className="bi bi-geo-alt me-1"></i>
            <span>{event.location}</span>
          </div>
        </div>

        {event.registrationRequired && (
          <div className="mb-3">
            <div className="d-flex justify-content-between align-items-center">
              <span className="small text-muted">Участники</span>
              <span className="small fw-bold">
                {event.currentParticipants}/{event.maxParticipants}
              </span>
            </div>
            <div className="progress" style={{ height: '4px' }}>
              <div
                className="progress-bar"
                style={{ width: `${(event.currentParticipants / event.maxParticipants) * 100}%` }}
              ></div>
            </div>
          </div>
        )}

        <div className="mt-auto">
          <div className="d-flex flex-wrap gap-1 mb-2">
            {event.tags.slice(0, 3).map((tag, index) => (
              <span key={index} className="badge bg-light text-dark small">
                #{tag}
              </span>
            ))}
          </div>
          
          <button className="btn btn-outline-primary w-100">
            Подробнее
            <i className="bi bi-arrow-right ms-1"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventCard; 