import db from '../firebase';
import {
  doc,
  updateDoc,
  getDoc
} from 'firebase/firestore';

export const updateRoadmapTopicStatus = async (roadmapId, weekKey, newStatus) => {
  try {
    const roadmapRef = doc(db, 'roads', roadmapId);
    const roadmapDoc = await getDoc(roadmapRef);
    
    if (!roadmapDoc.exists()) {
      throw new Error('Roadmap не найден');
    }
    
    const roadmapData = roadmapDoc.data();
    const updatedRoadmap = { ...roadmapData.roadmap };
    
    if (updatedRoadmap[weekKey]) {
      updatedRoadmap[weekKey].status = newStatus;
    }
    
    await updateDoc(roadmapRef, {
      roadmap: updatedRoadmap
    });
    
    return { success: true };
  } catch (error) {
    console.error('Ошибка обновления статуса темы:', error);
    return { success: false, error: error.message };
  }
}; 