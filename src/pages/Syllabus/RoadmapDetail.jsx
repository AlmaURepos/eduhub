import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ReactFlowProvider } from 'reactflow';
import RoadmapFlow from '../../components/RoadmapFlow/RoadmapFlow';
import { getRoadmapsFromFirebase } from '../../utils/getRoadmap';
import { updateRoadmapTopicStatus } from '../../utils/updateRoadmapStatus';
import { exportRoadmapToPDF } from '../../utils/exportRoadmap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../styles/roadmapFlow.css';

const RoadmapDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [roadmap, setRoadmap] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [isExporting, setIsExporting] = React.useState(false);

  React.useEffect(() => {
    const loadRoadmap = async () => {
      try {
        setLoading(true);
        const roadmaps = await getRoadmapsFromFirebase();
        const foundRoadmap = roadmaps.find(r => r.id === id);
        
        if (foundRoadmap) {
          setRoadmap(foundRoadmap);
        } else {
          setError('Roadmap не найден');
        }
      } catch (err) {
        setError('Ошибка загрузки roadmap');
        console.error('Ошибка загрузки roadmap:', err);
      } finally {
        setLoading(false);
      }
    };

    loadRoadmap();
  }, [id]);

  const handleRoadmapUpdate = async (updatedRoadmap) => {
    setRoadmap(updatedRoadmap);
  };

  const handleExportPDF = async () => {
    if (!roadmap) return;
    
    setIsExporting(true);
    try {
      const result = await exportRoadmapToPDF(roadmap);
      if (result.success) {
        // Можно добавить уведомление об успешном экспорте
        console.log('PDF успешно экспортирован');
      } else {
        console.error('Ошибка экспорта:', result.error);
      }
    } catch (error) {
      console.error('Ошибка экспорта:', error);
    } finally {
      setIsExporting(false);
    }
  };

  if (loading) {
    return (
      <div className="container-fluid px-3 py-4">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Загрузка...</span>
          </div>
          <p className="mt-3">Загрузка roadmap...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-fluid px-3 py-4">
        <div className="text-center">
          <div className="alert alert-danger">
            <i className="bi bi-exclamation-triangle me-2"></i>
            {error}
          </div>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/syllabus')}
          >
            <i className="bi bi-arrow-left me-2"></i>
            Вернуться к списку
          </button>
        </div>
      </div>
    );
  }

  if (!roadmap) {
    return null;
  }

  // Вычисляем прогресс
  const totalTopics = Object.keys(roadmap.roadmap).length;
  const completedTopics = Object.values(roadmap.roadmap).filter(topic => topic.status).length;
  const progressPercentage = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

  return (
    <div className="roadmap-detail-page">
      {/* Заголовок с улучшенным дизайном */}
      <div className="container-fluid px-3 py-4">
        <div className="row align-items-center mb-4">
          <div className="col-auto">
            <button 
              className="btn btn-outline-secondary"
              onClick={() => navigate('/syllabus')}
            >
              <i className="bi bi-arrow-left me-2"></i>
              Назад
            </button>
          </div>
          <div className="col text-center">
            <h4 className="mb-1">{roadmap.title}</h4>
            <div className="d-flex justify-content-center align-items-center gap-3">
              <span className="badge bg-primary fs-6">{progressPercentage}%</span>
              <small className="text-muted">
                {completedTopics} из {totalTopics} тем
              </small>
            </div>
          </div>
          <div className="col-auto">
            <button 
              className="btn btn-primary"
              onClick={handleExportPDF}
              disabled={isExporting}
            >
              <i className={`bi ${isExporting ? 'bi-hourglass-split' : 'bi-download'} me-2`}></i>
              {isExporting ? 'Экспорт...' : 'Скачать PDF'}
            </button>
          </div>
        </div>
      </div>

      {/* Контент roadmap */}
      <div className="container-fluid px-3">
        <div className="row">
          <div className="col-12">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-0">
                <ReactFlowProvider>
                  <RoadmapFlow 
                    roadmap={roadmap} 
                    onUpdate={handleRoadmapUpdate}
                  />
                </ReactFlowProvider>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoadmapDetail;