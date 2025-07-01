import { collection, getDocs, query, where } from 'firebase/firestore';
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

// Получаем предметы только из расписания
export const getAllSubjects = async () => {
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
    
    const subjects = [];
    scheduleData.forEach(item => {
      if (item.C && !subjects.includes(item.C)) { // item.C - предмет из Excel
        subjects.push(item.C);
      }
    });
    
    return subjects;
  } catch (err) {
    console.error('Ошибка при получении предметов:', err);
    return [];
  }
};

// Структура: 3 года × 3 семестра = 9 семестров
export const getCoursesStructure = () => {
  const courses = [];
  
  for (let year = 1; year <= 3; year++) {
    const course = {
      year: year,
      name: `${year} курс`,
      semesters: []
    };
    
    for (let semester = 1; semester <= 3; semester++) {
      course.semesters.push({
        number: semester,
        name: `${semester} семестр`,
        subjects: []
      });
    }
    
    courses.push(course);
  }
  
  return courses;
};

// Распределяем предметы по 9 семестрам
export const distributeSubjectsToCourses = (subjects) => {
  const courses = getCoursesStructure();
  const shuffledSubjects = [...subjects].sort(() => Math.random() - 0.5);
  
  let subjectIndex = 0;
  
  courses.forEach(course => {
    course.semesters.forEach(semester => {
      // 2-4 предмета на семестр
      const subjectsPerSemester = Math.floor(Math.random() * 3) + 2;
      
      for (let i = 0; i < subjectsPerSemester && subjectIndex < shuffledSubjects.length; i++) {
        semester.subjects.push(shuffledSubjects[subjectIndex]);
        subjectIndex++;
      }
    });
  });
  
  return courses;
};

// Случайные оценки для предмета
export const generateGradesForSubject = (subject) => {
  return {
    subject: subject,
    current1: [
      Math.floor(Math.random() * 20) + 70,
      Math.floor(Math.random() * 20) + 70,
      Math.floor(Math.random() * 20) + 70,
      Math.floor(Math.random() * 20) + 70,
      Math.floor(Math.random() * 20) + 70
    ],
    current2: [
      Math.floor(Math.random() * 20) + 70,
      Math.floor(Math.random() * 20) + 70,
      Math.floor(Math.random() * 20) + 70,
      Math.floor(Math.random() * 20) + 70,
      Math.floor(Math.random() * 20) + 70
    ],
    rk1: Math.floor(Math.random() * 30) + 70,
    rk2: Math.floor(Math.random() * 30) + 70,
    exam: Math.floor(Math.random() * 30) + 70
  };
};

// Получаем все данные
export const getAllGradesWithStructure = async () => {
  const subjects = await getAllSubjects();
  const coursesStructure = distributeSubjectsToCourses(subjects);
  
  const allGrades = {};
  subjects.forEach(subject => {
    allGrades[subject] = generateGradesForSubject(subject);
  });
  
  return {
    courses: coursesStructure,
    grades: allGrades
  };
};

export const percentToGpa = (percent) => {
  if (percent >= 95) return 4.00;
  if (percent >= 90) return 3.67;
  if (percent >= 85) return 3.33;
  if (percent >= 80) return 3.00;
  if (percent >= 75) return 2.67;
  if (percent >= 70) return 2.33;
  if (percent >= 65) return 2.00;
  if (percent >= 60) return 1.67;
  if (percent >= 55) return 1.33;
  if (percent >= 50) return 1.00;
  return 0.00;
};

export const calculateAverage = (grades) => {
  if (!grades || grades.length === 0) return 0;
  const sum = grades.reduce((acc, grade) => acc + grade, 0);
  return Math.round((sum / grades.length) * 100) / 100;
};

export const calculateRating = (rk1, rk2, avg1, avg2) => {
  return Math.round(((rk1 + rk2 + avg1 + avg2) / 4) * 100) / 100;
};

export const calculateFinal = (exam, rating) => {
  return Math.round((0.4 * exam + 0.6 * rating) * 100) / 100;
};

export const calculateGpa = (percent) => {
  return percentToGpa(percent);
};

export const generateMockGrades = (subjects) => {
  const mockGrades = {};
  subjects.forEach(subject => {
    mockGrades[subject] = generateGradesForSubject(subject);
  });
  return mockGrades;
}; 