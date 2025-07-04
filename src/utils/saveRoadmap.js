import db from '../firebase';
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  Timestamp,
  deleteDoc,
  doc
} from 'firebase/firestore';

const getUserIp = async () => {
  try {
    const res = await fetch('https://api.ipify.org?format=json');
    const data = await res.json();
    return data.ip || 'неизвестен';
  } catch (err) {
    console.error('Ошибка при получении IP:', err);
    return 'неизвестен';
  }
};

export const saveRoadmapToFirebase = async (roadmapData) => {
  const ip = await getUserIp();
  const roadsRef = collection(db, 'roads');

  try {
    // Проверяем, есть ли уже roadmap с таким же названием предмета у этого пользователя
    const q = query(roadsRef, where('ip', '==', ip), where('title', '==', roadmapData.subjectName));
    const existingSnapshot = await getDocs(q);

    if (!existingSnapshot.empty) {
      const existingDoc = existingSnapshot.docs[0];

      const confirmReplace = window.confirm(
        `У вас уже есть roadmap для предмета "${roadmapData.subjectName}". Хотите удалить его и сохранить новый?`
      );

      if (!confirmReplace) {
        return { success: false, message: 'Сохранение отменено пользователем.' };
      }

      await deleteDoc(doc(db, 'roads', existingDoc.id));
    }

    // Добавляем флаг status: false к каждой теме, если его нет
    const processedRoadmap = {};
    Object.keys(roadmapData.weeks).forEach(weekKey => {
      processedRoadmap[weekKey] = {
        ...roadmapData.weeks[weekKey],
        status: roadmapData.weeks[weekKey].status !== undefined ? roadmapData.weeks[weekKey].status : false
      };
    });

    const payload = {
      ip,
      title: roadmapData.subjectName,
      roadmap: processedRoadmap,
      createdAt: Timestamp.now()
    };

    const newDocRef = await addDoc(roadsRef, payload);

    return { success: true, id: newDocRef.id };
  } catch (err) {
    console.error('Ошибка при сохранении roadmap в Firestore:', err);
    return { success: false, error: err.message };
  }
}; 