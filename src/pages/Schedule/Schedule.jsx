import React, { useState } from 'react';

const Schedule = () => {
  const [file, setFile] = useState(null);
  const [scheduleUrl, setScheduleUrl] = useState('');
  const [activeTab, setActiveTab] = useState('file'); // 'file' или 'url'

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && (selectedFile.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
                        selectedFile.type === 'application/vnd.ms-excel')) {
      setFile(selectedFile);
    } else {
      alert('Пожалуйста, выберите файл Excel (.xlsx или .xls)');
    }
  };

  const handleUrlSubmit = (e) => {
    e.preventDefault();
    // Здесь будет логика обработки URL
    console.log('URL расписания:', scheduleUrl);
  };

  const handleFileSubmit = (e) => {
    e.preventDefault();
    if (file) {
      // Здесь будет логика обработки файла
      console.log('Загруженный файл:', file);
    }
  };

  return (
    <div className="container-fluid px-3">
      <div className="row justify-content-center">
        <div className="col-12">
          <h2 className="h4 my-4">Загрузка расписания</h2>
          
          {/* Табы для переключения между способами загрузки */}
          <ul className="nav nav-pills mb-4 justify-content-center gap-2">
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'file' ? 'active' : ''}`}
                onClick={() => setActiveTab('file')}
              >
                <i className="bi bi-file-earmark-excel me-2"></i>
                Загрузить файл
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'url' ? 'active' : ''}`}
                onClick={() => setActiveTab('url')}
              >
                <i className="bi bi-link-45deg me-2"></i>
                Указать ссылку
              </button>
            </li>
          </ul>

          {/* Форма загрузки файла */}
          {activeTab === 'file' && (
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <form onSubmit={handleFileSubmit}>
                  <div className="mb-4">
                    <div className="d-flex justify-content-center mb-3">
                      <div className="upload-icon">
                        <i className="bi bi-cloud-upload text-primary" style={{ fontSize: '3rem' }}></i>
                      </div>
                    </div>
                    <div className="text-center mb-3">
                      <label className="btn btn-outline-primary">
                        <i className="bi bi-file-earmark-excel me-2"></i>
                        Выбрать файл Excel
                        <input
                          type="file"
                          className="d-none"
                          accept=".xlsx,.xls"
                          onChange={handleFileChange}
                        />
                      </label>
                    </div>
                    {file && (
                      <div className="alert alert-success d-flex align-items-center">
                        <i className="bi bi-check-circle me-2"></i>
                        <div>Выбран файл: {file.name}</div>
                      </div>
                    )}
                  </div>
                  <div className="d-grid">
                    <button 
                      type="submit" 
                      className="btn btn-primary"
                      disabled={!file}
                    >
                      <i className="bi bi-upload me-2"></i>
                      Загрузить расписание
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Форма для ввода ссылки */}
          {activeTab === 'url' && (
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <form onSubmit={handleUrlSubmit}>
                  <div className="mb-4">
                    <label className="form-label">Ссылка на расписание</label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="bi bi-link-45deg"></i>
                      </span>
                      <input
                        type="url"
                        className="form-control"
                        placeholder="Вставьте ссылку на расписание"
                        value={scheduleUrl}
                        onChange={(e) => setScheduleUrl(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="d-grid">
                    <button 
                      type="submit" 
                      className="btn btn-primary"
                      disabled={!scheduleUrl}
                    >
                      <i className="bi bi-cloud-download me-2"></i>
                      Загрузить по ссылке
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Schedule; 