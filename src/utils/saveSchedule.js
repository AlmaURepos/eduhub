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

export const saveScheduleToFirebase = async (scheduleArray) => {
  const ip = await getUserIp();
  const schedulesRef = collection(db, 'schedules');

  try {
    const q = query(schedulesRef, where('ip', '==', ip));
    const existingSnapshot = await getDocs(q);

    if (!existingSnapshot.empty) {
      const existingDoc = existingSnapshot.docs[0];

      const confirmReplace = window.confirm(
        'У вас уже есть сохранённое расписание. Хотите удалить его и сохранить новое?'
      );

      if (!confirmReplace) {
        return { success: false, message: 'Сохранение отменено пользователем.' };
      }


      await deleteDoc(doc(db, 'schedules', existingDoc.id));
    }

    const payload = {
      ip,
      schedule: scheduleArray,
      createdAt: Timestamp.now()
    };

    const newDocRef = await addDoc(schedulesRef, payload);

    return { success: true, id: newDocRef.id };
  } catch (err) {
    console.error('Ошибка при сохранении в Firestore:', err);
    return { success: false, error: err.message };
  }
};
