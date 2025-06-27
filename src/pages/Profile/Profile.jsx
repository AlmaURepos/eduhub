import React, { useState, useEffect } from 'react';
import { loadProfile, updateProfile } from '../../utils/profileUtils';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const userProfile = loadProfile();
    setProfile(userProfile);
    setFormData(userProfile);
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    const updatedProfile = updateProfile(formData);
    setProfile(updatedProfile);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(profile);
    setIsEditing(false);
  };

  if (!profile) {
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
      {/* Header с аватаром */}
      <div className="text-center mb-4">
        <div className="position-relative d-inline-block">
          <div className="bg-primary bg-gradient rounded-circle d-flex align-items-center justify-content-center" 
               style={{ width: '100px', height: '100px' }}>
            <i className="bi bi-person-fill text-white fs-1"></i>
          </div>
          {isEditing && (
            <button className="btn btn-sm btn-light position-absolute bottom-0 end-0 rounded-circle shadow-sm"
                    style={{ width: '32px', height: '32px' }}>
              <i className="bi bi-camera"></i>
            </button>
          )}
        </div>
        <h4 className="mt-3 mb-1 fw-bold">{profile.firstName} {profile.lastName}</h4>
        <p className="text-muted mb-0">{profile.faculty} • {profile.course} курс</p>
        <div className="mt-3">
          {!isEditing ? (
            <button
              className="btn btn-primary btn-sm"
              onClick={() => setIsEditing(true)}
            >
              <i className="bi bi-pencil me-1"></i>
              Редактировать профиль
            </button>
          ) : (
            <div className="d-flex gap-2 justify-content-center">
              <button className="btn btn-success btn-sm" onClick={handleSave}>
                <i className="bi bi-check me-1"></i>
                Сохранить
              </button>
              <button className="btn btn-outline-secondary btn-sm" onClick={handleCancel}>
                <i className="bi bi-x me-1"></i>
                Отмена
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Основная информация */}
      <div className="row g-4">
        {/* Личные данные */}
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-primary bg-opacity-10 border-0">
              <h6 className="mb-0 fw-bold">
                <i className="bi bi-person me-2"></i>
                Личные данные
              </h6>
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label small fw-bold text-muted">Имя</label>
                  {isEditing ? (
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                    />
                  ) : (
                    <div className="form-control-plaintext fw-bold">{profile.firstName}</div>
                  )}
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-bold text-muted">Фамилия</label>
                  {isEditing ? (
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                    />
                  ) : (
                    <div className="form-control-plaintext fw-bold">{profile.lastName}</div>
                  )}
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-bold text-muted">Email</label>
                  {isEditing ? (
                    <input
                      type="email"
                      className="form-control form-control-sm"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                    />
                  ) : (
                    <div className="form-control-plaintext">
                      <i className="bi bi-envelope me-1 text-muted"></i>
                      {profile.email}
                    </div>
                  )}
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-bold text-muted">Телефон</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      className="form-control form-control-sm"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                    />
                  ) : (
                    <div className="form-control-plaintext">
                      <i className="bi bi-telephone me-1 text-muted"></i>
                      {profile.phone}
                    </div>
                  )}
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-bold text-muted">Дата рождения</label>
                  {isEditing ? (
                    <input
                      type="date"
                      className="form-control form-control-sm"
                      value={formData.birthDate}
                      onChange={(e) => handleInputChange('birthDate', e.target.value)}
                    />
                  ) : (
                    <div className="form-control-plaintext">
                      <i className="bi bi-calendar me-1 text-muted"></i>
                      {profile.birthDate}
                    </div>
                  )}
                </div>
                <div className="col-12">
                  <label className="form-label small fw-bold text-muted">Адрес</label>
                  {isEditing ? (
                    <textarea
                      className="form-control form-control-sm"
                      rows="2"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                    />
                  ) : (
                    <div className="form-control-plaintext">
                      <i className="bi bi-geo-alt me-1 text-muted"></i>
                      {profile.address}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Академическая информация */}
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-info bg-opacity-10 border-0">
              <h6 className="mb-0 fw-bold">
                <i className="bi bi-mortarboard me-2"></i>
                Академическая информация
              </h6>
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label small fw-bold text-muted">Студенческий ID</label>
                  <div className="form-control-plaintext fw-bold text-primary">
                    <i className="bi bi-card-text me-1"></i>
                    {profile.studentId}
                  </div>
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-bold text-muted">Факультет</label>
                  <div className="form-control-plaintext">
                    <i className="bi bi-building me-1 text-muted"></i>
                    {profile.faculty}
                  </div>
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-bold text-muted">Курс</label>
                  <div className="form-control-plaintext">
                    <i className="bi bi-1-circle me-1 text-muted"></i>
                    {profile.course} курс
                  </div>
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-bold text-muted">Группа</label>
                  <div className="form-control-plaintext">
                    <i className="bi bi-people me-1 text-muted"></i>
                    {profile.group}
                  </div>
                </div>
              </div>

              {/* Статистика */}
              <div className="mt-4 pt-3 border-top">
                <h6 className="fw-bold mb-3">Статистика</h6>
                <div className="row text-center">
                  <div className="col-4">
                    <div className="bg-primary bg-opacity-10 rounded p-2">
                      <div className="fw-bold text-primary">4.2</div>
                      <small className="text-muted">GPA</small>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="bg-success bg-opacity-10 rounded p-2">
                      <div className="fw-bold text-success">85%</div>
                      <small className="text-muted">Посещаемость</small>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="bg-warning bg-opacity-10 rounded p-2">
                      <div className="fw-bold text-warning">12</div>
                      <small className="text-muted">Кредиты</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Быстрые действия */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-light border-0">
              <h6 className="mb-0 fw-bold">
                <i className="bi bi-lightning me-2"></i>
                Быстрые действия
              </h6>
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-3 col-6">
                  <button className="btn btn-outline-primary w-100">
                    <i className="bi bi-calendar-event d-block fs-4 mb-1"></i>
                    <small>Расписание</small>
                  </button>
                </div>
                <div className="col-md-3 col-6">
                  <button className="btn btn-outline-success w-100">
                    <i className="bi bi-graph-up d-block fs-4 mb-1"></i>
                    <small>Оценки</small>
                  </button>
                </div>
                <div className="col-md-3 col-6">
                  <button className="btn btn-outline-info w-100">
                    <i className="bi bi-calendar-event d-block fs-4 mb-1"></i>
                    <small>События</small>
                  </button>
                </div>
                <div className="col-md-3 col-6">
                  <button className="btn btn-outline-warning w-100">
                    <i className="bi bi-calculator d-block fs-4 mb-1"></i>
                    <small>GPA</small>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 