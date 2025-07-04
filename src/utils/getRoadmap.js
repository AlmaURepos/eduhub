import db from '../firebase';
import {
  collection,
  getDocs,
  query,
  where
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

export const getRoadmapsFromFirebase = async () => {
  const ip = await getUserIp();
  const roadsRef = collection(db, 'roads');

  try {
    const q = query(
      roadsRef, 
      where('ip', '==', ip)
    );
    
    const snapshot = await getDocs(q);
    const roadmaps = [];

    snapshot.forEach((doc) => {
      const data = doc.data();
      roadmaps.push({
        id: doc.id,
        title: data.title,
        roadmap: data.roadmap,
        createdAt: data.createdAt?.toDate() || new Date()
      });
    });

    // Сортируем на стороне клиента по дате создания (новые сначала)
    roadmaps.sort((a, b) => b.createdAt - a.createdAt);

    return roadmaps;
  } catch (err) {
    console.error('Ошибка при получении roadmap из Firestore:', err);
    return [];
  }
}; 