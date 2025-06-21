import { collection, getDocs, query, where } from 'firebase/firestore';
import moment from 'moment';
import db from '../firebase';

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

const dayMap = {
  'понедельник': 0,
  'вторник': 1,
  'среда': 2,
  'четверг': 3,
  'пятница': 4,
  'суббота': 5,
  'воскресенье': 6,
};

export const getNotes = async () => {
  const ip = await getUserIp();
  
  const notesRef = collection(db, 'notes');
  const q = query(notesRef, where('ip', '==', ip));

  try {
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return [];
    }

    const notes = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return notes;
  } catch (err) {
    console.error('Ошибка при получении заметок:', err);
    return [];
  }
};

export const getSchedule = async () => {
  const ip = await getUserIp();
  
  const schedulesRef = collection(db, 'schedules');
  const q = query(schedulesRef, where('ip', '==', ip));

  try {
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return [];
    }

    const docData = querySnapshot.docs[0].data();
    const scheduleData = docData.schedule;
    
    const today = moment();
    const startOfWeek = today.clone().startOf('week').add(1, 'day');

    const formattedEvents = scheduleData.map((item, index) => {
      const dayIndex = dayMap[item.day.toLowerCase()];
      
      if (dayIndex === undefined) {
        return null; 
      }
      
      const eventDate = startOfWeek.clone().add(dayIndex, 'days');
      const [startTime, endTime] = item.time.split('-');
      const start = moment(`${eventDate.format('YYYY-MM-DD')} ${startTime.replace('.', ':')}`, 'YYYY-MM-DD HH:mm').toDate();
      const end = moment(`${eventDate.format('YYYY-MM-DD')} ${endTime.replace('.', ':')}`, 'YYYY-MM-DD HH:mm').toDate();

      return {
        id: index,
        title: item.subject,
        day: item.day,
        room: item.room,
        teacher: item.teacher,
        time: item.time,
        start,
        end,
      };
    }).filter(event => event !== null);

    return formattedEvents;
  } catch (err) {
    console.error('Ошибка при получении расписания:', err);
    return [];
  }
};

export const getScheduleForFullCalendar = async () => {
  const ip = await getUserIp();
  
  const schedulesRef = collection(db, 'schedules');
  const q = query(schedulesRef, where('ip', '==', ip));

  try {
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return [];
    }

    const docData = querySnapshot.docs[0].data();
    const scheduleData = docData.schedule;
    
    const today = moment();
    const startOfWeek = today.clone().startOf('week');

    const dayMapForFullCalendar = {
      'понедельник': 1,
      'вторник': 2,
      'среда': 3,
      'четверг': 4,
      'пятница': 5,
      'суббота': 6,
      'воскресенье': 0,
    };

    const formattedEvents = scheduleData.map((item, index) => {
      const dayIndex = dayMapForFullCalendar[item.day.toLowerCase()];
      
      if (dayIndex === undefined) {
        return null; 
      }
      
      const eventDate = startOfWeek.clone().add(dayIndex, 'days');
      const [startTime, endTime] = item.time.split('-');
      const start = moment(`${eventDate.format('YYYY-MM-DD')} ${startTime.replace('.', ':')}`, 'YYYY-MM-DD HH:mm').toDate();
      const end = moment(`${eventDate.format('YYYY-MM-DD')} ${endTime.replace('.', ':')}`, 'YYYY-MM-DD HH:mm').toDate();

      return {
        id: index,
        title: item.subject,
        day: item.day,
        room: item.room,
        teacher: item.teacher,
        time: item.time,
        start,
        end,
      };
    }).filter(event => event !== null);

    return formattedEvents;
  } catch (err) {
    console.error('Ошибка при получении расписания:', err);
    return [];
  }
};