import moment from 'moment';
import db from '../firebase';
import {
  collection,
  addDoc,
  Timestamp,
  updateDoc,
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

export const addNote = async (noteText, selectedDate) => {
  const ip = await getUserIp();
  const notesRef = collection(db, 'notes');
  try {
    const payload = {
      ip: ip,
      text: noteText,
      date: moment(selectedDate).format('YYYY-MM-DD'),
      createdAt: Timestamp.now(),
      completed: false
    };

    console.log(payload)
    
    await addDoc(notesRef, payload);
    alert('Заметка успешно добавлена!');
    return true;
  } catch (error) {
    console.error('Ошибка при добавлении заметки:', error);
    alert('Ошибка при добавлении заметки', error);
    return false;
  }
};

export const updateNote = async (noteId, completed) => {
  try {
    const noteRef = doc(db, 'notes', noteId);
    await updateDoc(noteRef, {
      completed: completed
    });
    return true;
  } catch (error) {
    console.error('Ошибка при обновлении заметки:', error);
    return false;
  }
}; 