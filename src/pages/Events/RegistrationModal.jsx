import React, { useState, useEffect } from 'react';
import { loadProfile } from '../../utils/profileUtils';

const RegistrationModal = ({ event, show, onHide }) => {
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (show) {
      const userProfile = loadProfile();
      setFormData({
        firstName: userProfile.firstName,
        lastName: userProfile.lastName,
        email: userProfile.email,
        phone: userProfile.phone,
        studentId: userProfile.studentId,
        faculty: userProfile.faculty,
        course: userProfile.course,
        group: userProfile.group,
        dietaryRestrictions: '',
        specialNeeds: '',
        additionalInfo: ''
      });
    }
  }, [show]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Имитация отправки данных
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setIsSuccess(true);
    
    // Закрытие модального окна через 3 секунды
    setTimeout(() => {
      setIsSuccess(false);
      onHide();
    }, 3000);
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setIsSuccess(false);
      onHide();
    }
  };

  if (!show) return null;

  return (
    <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content border-0 shadow">
          <div className="modal-header bg-primary bg-opacity-10 border-0">
            <h5 className="modal-title">
              <i className="bi bi-person-plus me-2"></i>
              Регистрация на событие
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={handleClose}
              disabled={isSubmitting}
            ></button>
          </div>
          
          {!isSuccess ? (
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="alert alert-info">
                  <h6 className="mb-2">{event.title}</h6>
                  <div className="row small text-muted">
                    <div className="col-md-6">
                      <i className="bi bi-calendar me-1"></i>
                      {event.date} в {event.time}
                    </div>
                    <div className="col-md-6">
                      <i className="bi bi-geo-alt me-1"></i>
                      {event.location}
                    </div>
                  </div>
                </div>

                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Имя *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Фамилия *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Email *</label>
                    <input
                      type="email"
                      className="form-control"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Телефон *</label>
                    <input
                      type="tel"
                      className="form-control"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Студенческий ID</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.studentId}
                      onChange={(e) => handleInputChange('studentId', e.target.value)}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Факультет</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.faculty}
                      onChange={(e) => handleInputChange('faculty', e.target.value)}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Курс</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.course}
                      onChange={(e) => handleInputChange('course', e.target.value)}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Группа</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.group}
                      onChange={(e) => handleInputChange('group', e.target.value)}
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Диетические ограничения</label>
                    <textarea
                      className="form-control"
                      rows="2"
                      placeholder="Укажите, если у вас есть особые требования к питанию"
                      value={formData.dietaryRestrictions}
                      onChange={(e) => handleInputChange('dietaryRestrictions', e.target.value)}
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Особые потребности</label>
                    <textarea
                      className="form-control"
                      rows="2"
                      placeholder="Укажите, если вам нужна специальная помощь"
                      value={formData.specialNeeds}
                      onChange={(e) => handleInputChange('specialNeeds', e.target.value)}
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Дополнительная информация</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      placeholder="Любая дополнительная информация"
                      value={formData.additionalInfo}
                      onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
                    />
                  </div>
                </div>
              </div>
              
              <div className="modal-footer border-0">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={handleClose}
                  disabled={isSubmitting}
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Регистрация...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-check me-1"></i>
                      Зарегистрироваться
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="modal-body text-center py-5">
              <div className="text-success mb-3">
                <i className="bi bi-check-circle fs-1"></i>
              </div>
              <h5 className="text-success mb-3">Регистрация успешно завершена!</h5>
              <p className="text-muted">
                Вы успешно зарегистрированы на событие "{event.title}".
                <br />
                Подтверждение отправлено на ваш email.
              </p>
              <div className="alert alert-light">
                <small>
                  <strong>Дата:</strong> {event.date} в {event.time}<br />
                  <strong>Место:</strong> {event.location}
                </small>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegistrationModal; 