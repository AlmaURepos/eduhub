import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { downloadAndParseWord, parseSyllabus } from '../../utils/syllabusUtils';
import { saveRoadmapToFirebase } from '../../utils/saveRoadmap';
import { getRoadmapsFromFirebase } from '../../utils/getRoadmap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../styles/syllabus.css';

const Syllabus = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [syllabusData, setSyllabusData] = useState(null);
  const [syllabus, setSyllabus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [savedRoadmaps, setSavedRoadmaps] = useState([]);
  const [isLoadingRoadmaps, setIsLoadingRoadmaps] = useState(false);

  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && (
      selectedFile.type.includes('word') ||
      selectedFile.type.includes('document') ||
      selectedFile.name.endsWith('.docx') ||
      selectedFile.name.endsWith('.doc')
    )) {
      setFile(selectedFile);
      setStatus('Обработка файла...');
      setIsLoading(true);
      setProgress(0);
      try {
        const result = await downloadAndParseWord(selectedFile, setProgress);
        setStatus(result.message);
        setSyllabusData(result.data);
      } catch (error) {
        setStatus(`Ошибка: ${error.message}`);
      } finally {
        setIsLoading(false);
        setProgress(100);
      }
    } else {
      setStatus('Ошибка: выберите файл .docx или .doc');
    }
  };

  // Загрузка сохраненных roadmap'ов при монтировании компонента
  useEffect(() => {
    loadSavedRoadmaps();
  }, []);

  const loadSavedRoadmaps = async () => {
    setIsLoadingRoadmaps(true);
    try {
      const roadmaps = await getRoadmapsFromFirebase();
      setSavedRoadmaps(roadmaps);
    } catch (error) {
      console.error('Ошибка загрузки roadmap:', error);
    } finally {
      setIsLoadingRoadmaps(false);
    }
  };

  // Обработчик обновления roadmap
  const handleRoadmapUpdate = (updatedRoadmap) => {
    setSavedRoadmaps(prevRoadmaps => 
      prevRoadmaps.map(roadmap => 
        roadmap.id === updatedRoadmap.id ? updatedRoadmap : roadmap
      )
    );
  };

  const handleSaveSyllabus = async () => {
    if (!syllabusData) {
      setStatus('Ошибка: нет данных для сохранения');
      return;
    }

    setLoading(true);
    try {
      const result = await saveRoadmapToFirebase(syllabusData);
      
      if (result.success) {
        setStatus('Roadmap успешно сохранен в базу данных!');
        setSyllabus(syllabusData);
        
        // Обновляем список сохраненных roadmap'ов
        await loadSavedRoadmaps();
        
        // Очищаем данные загрузки
        setFile(null);
        setSyllabusData(null);
      } else {
        setStatus(`Ошибка сохранения: ${result.message || result.error}`);
      }
    } catch (error) {
      setStatus(`Ошибка: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="container-fluid px-3 py-4 syllabus-page">
      <div className="text-center mb-4">
        <i className="bi bi-file-earmark-text text-primary fs-1"></i>
        <h4 className="mt-3 mb-2 fw-bold">Силлабус курса</h4>
        <p className="text-muted small">Загрузите Word файл с описанием курса</p>
      </div>

      {/* Загрузка файла */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-info bg-opacity-10 border-0">
              <h6 className="mb-0">
                <i className="bi bi-upload me-2"></i>
                Загрузить силлабус
              </h6>
            </div>
            <div className="card-body">
              <p className="text-muted small mb-3">
                Загрузите файл Word (.docx, .doc) с описанием курса
              </p>
              {status && (
                <div className="alert alert-info mb-3">
                  <i className="bi bi-info-circle me-2"></i>
                  {status}
                </div>
              )}
              {isLoading && progress > 0 && progress < 100 && (
                <div className="mb-3">
                  <div className="progress">
                    <div 
                      className="progress-bar" 
                      role="progressbar" 
                      style={{ width: `${progress}%` }}
                      aria-valuenow={progress} 
                      aria-valuemin="0" 
                      aria-valuemax="100"
                    >
                      {progress}%
                    </div>
                  </div>
                </div>
              )}
              
              {/* Предварительный просмотр данных */}
              {syllabusData && (
                <div className="text-center mb-3">
                  <button 
                    className="btn btn-success"
                    onClick={handleSaveSyllabus}
                    disabled={isLoading}
                  >
                    <i className="bi bi-save me-1"></i>
                    {isLoading ? 'Сохранение...' : 'Сохранить силлабус'}
                  </button>
                </div>
              )}
              <div className="d-flex justify-content-center">
                <input
                  type="file"
                  id="fileInput"
                  accept=".docx,.doc"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
                <button 
                  className="btn btn-outline-primary"
                  onClick={() => document.getElementById('fileInput').click()}
                  disabled={isLoading}
                >
                  <i className="bi bi-file-earmark-word me-1"></i>
                  {isLoading ? 'Обработка...' : 'Выбрать файл'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Сохраненные roadmap'ы */}
      {savedRoadmaps.length > 0 && (
        <div className="row mb-4">
          <div className="col-12">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                {isLoadingRoadmaps ? (
                  <div className="text-center">
                    <div className="spinner-border spinner-border-sm" role="status">
                      <span className="visually-hidden">Загрузка...</span>
                    </div>
                    <span className="ms-2">Загрузка roadmap'ов...</span>
                  </div>
                ) : (
                  <div className="row">
                    {savedRoadmaps.map((roadmap, index) => (
                      <div key={roadmap.id} className="col-md-6 col-lg-4 mb-3">
                        <div 
                          className="card h-100 border-0 shadow-sm roadmap-card-preview"
                          style={{ cursor: 'pointer' }}
                          onClick={() => navigate(`/syllabus/roadmap/${roadmap.id}`)}
                        >
                          <div className="card-body d-flex flex-column">
                            <h6 className="card-title text-truncate">{roadmap.title}</h6>
                            
                            {/* Прогресс-бар */}
                            {(() => {
                              const totalTopics = Object.keys(roadmap.roadmap).length;
                              const completedTopics = Object.values(roadmap.roadmap).filter(topic => topic.status).length;
                              const progressPercentage = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;
                              
                              return (
                                <div className="mb-3">
                                  <div className="d-flex justify-content-between align-items-center mb-1">
                                    <small className="text-muted">Прогресс</small>
                                    <small className="text-muted">{progressPercentage}%</small>
                                  </div>
                                  <div className="progress" style={{ height: '6px' }}>
                                    <div 
                                      className="progress-bar bg-success" 
                                      role="progressbar" 
                                      style={{ width: `${progressPercentage}%` }}
                                      aria-valuenow={progressPercentage} 
                                      aria-valuemin="0" 
                                      aria-valuemax="100"
                                    ></div>
                                  </div>
                                </div>
                              );
                            })()}
                            
                            <p className="card-text small text-muted">
                              Недель: {Object.keys(roadmap.roadmap).length}
                            </p>
                            <p className="card-text small text-muted">
                              Создан: {roadmap.createdAt.toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}



      {!syllabusData && savedRoadmaps.length === 0 && (
        <div className="text-center text-muted py-5">
          <i className="bi bi-file-earmark-text fs-1 mb-3"></i>
          <div>Загрузите файл с описанием курса</div>
        </div>
      )}
    </div>
  );
};

export default Syllabus; 