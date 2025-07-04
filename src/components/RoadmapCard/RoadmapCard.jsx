import React, { useState } from 'react';
import { updateRoadmapTopicStatus } from '../../utils/updateRoadmapStatus';
import RoadmapFlow from '../RoadmapFlow/RoadmapFlow';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../styles/roadmap.css';
import '../../styles/roadmapFlow.css';

const RoadmapCard = ({ roadmap, onUpdate }) => {
  const [isUpdating, setIsUpdating] = useState(false);

  // Вычисляем прогресс
  const totalTopics = Object.keys(roadmap.roadmap).length;
  const completedTopics = Object.values(roadmap.roadmap).filter(topic => topic.status).length;
  const progressPercentage = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

  // Извлекаем номер недели из ключа (например, "week-1" -> "1")
  const getWeekNumber = (weekKey) => {
    return weekKey.replace('week-', '');
  };

  // Обработчик клика по теме
  const handleTopicClick = async (weekKey) => {
    if (isUpdating) return;
    
    setIsUpdating(true);
    try {
      const currentStatus = roadmap.roadmap[weekKey].status;
      const newStatus = !currentStatus;
      
      const result = await updateRoadmapTopicStatus(roadmap.id, weekKey, newStatus);
      
      if (result.success) {
        // Обновляем локальное состояние
        const updatedRoadmap = {
          ...roadmap,
          roadmap: {
            ...roadmap.roadmap,
            [weekKey]: {
              ...roadmap.roadmap[weekKey],
              status: newStatus
            }
          }
        };
        
        if (onUpdate) {
          onUpdate(updatedRoadmap);
        }
      }
    } catch (error) {
      console.error('Ошибка обновления статуса:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="roadmap-card">
      <div className="card border-0 shadow-sm h-100">
        <div className="card-header bg-primary bg-opacity-10 border-0">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">
              <i className="bi bi-map me-2"></i>
              {roadmap.title}
            </h5>
            <span className="badge bg-primary">{progressPercentage}%</span>
          </div>
        </div>
        
        <div className="card-body p-0">
          {/* Красивый roadmap с React Flow */}
          <RoadmapFlow roadmap={roadmap} onUpdate={onUpdate} />
        </div>
        
        <div className="card-footer bg-light border-0">
          <small className="text-muted">
            <i className="bi bi-calendar me-1"></i>
            Создан: {roadmap.createdAt.toLocaleDateString()}
          </small>
        </div>
      </div>
    </div>
  );
};

export default RoadmapCard; 