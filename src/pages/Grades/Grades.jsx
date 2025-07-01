import React, { useState, useEffect } from 'react';
import { getAllGradesWithStructure, calculateGpa } from '../../utils/gradesUtils';
import GradeCard from '../../components/GradeCard/GradeCard';
import '../../styles/grades.css';

const Grades = () => {
  const [coursesData, setCoursesData] = useState({ courses: [], grades: {} });
  const [selectedCourse, setSelectedCourse] = useState(1);
  const [selectedSemester, setSelectedSemester] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGrades = async () => {
      try {
        const data = await getAllGradesWithStructure();
        setCoursesData(data);
      } catch (error) {
        console.error('Ошибка загрузки оценок:', error);
        setCoursesData({ courses: [], grades: {} });
      } finally {
        setLoading(false);
      }
    };

    loadGrades();
  }, []);

  // Получаем предметы для выбранного курса и семестра
  const getCurrentSubjects = () => {
    const course = coursesData.courses.find(c => c.year === selectedCourse);
    if (!course) return [];
    
    const semester = course.semesters.find(s => s.number === selectedSemester);
    if (!semester) return [];
    
    return semester.subjects;
  };

  // Получаем оценки для текущих предметов
  const getCurrentGrades = () => {
    const subjects = getCurrentSubjects();
    return subjects.map(subject => ({
      subject,
      ...coursesData.grades[subject]
    }));
  };

  const currentGrades = getCurrentGrades();
  const allGrades = Object.values(coursesData.grades);

  const overallGPA = allGrades.length > 0 
    ? allGrades.reduce((acc, grade) => {
        const avg1 = (grade.current1.reduce((a, b) => a + b, 0) / grade.current1.length);
        const avg2 = (grade.current2.reduce((a, b) => a + b, 0) / grade.current2.length);
        const rating = (grade.rk1 + grade.rk2 + avg1 + avg2) / 4;
        const final = 0.4 * grade.exam + 0.6 * rating;
        return acc + calculateGpa(final);
      }, 0) / allGrades.length 
    : 0;

  if (loading) {
    return (
      <div className="container-fluid px-3 py-4 grades-page">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Загрузка...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid px-3 py-4 grades-page">
      <div className="text-center mb-4">
        <i className="bi bi-graph-up text-primary fs-1"></i>
        <h4 className="mt-3 mb-2 fw-bold">Мои оценки</h4>
        <p className="text-muted small">Академическая успеваемость</p>
      </div>

      {/* Выбор курса и семестра */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              {/* Курсы */}
              <div className="d-flex justify-content-center mb-3">
                <div className="d-flex">
                  {[1, 2, 3].map(course => (
                    <button
                      key={course}
                      className={`btn ${selectedCourse === course ? 'btn-primary' : 'btn-outline-primary'} mx-1`}
                      onClick={() => setSelectedCourse(course)}
                    >
                      {course} курс
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Семестры */}
              <div className="d-flex justify-content-center">
                <div className="d-flex">
                  {[1, 2, 3].map(semester => (
                    <button
                      key={semester}
                      className={`btn ${selectedSemester === semester ? 'btn-success' : 'btn-outline-success'} mx-1`}
                      onClick={() => setSelectedSemester(semester)}
                    >
                      {semester} семестр
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Общая статистика */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm stats-card">
            <div className="card-header bg-success bg-opacity-10 border-0">
              <h5 className="mb-0">
                <i className="bi bi-calculator me-2"></i>
                Общая статистика
              </h5>
            </div>
            <div className="card-body">
              <div className="row text-center">
                <div className="col-md-3 col-6 mb-3">
                  <div className="bg-primary bg-opacity-10 rounded p-3">
                    <div className="fw-bold text-primary fs-4">{overallGPA.toFixed(2)}</div>
                    <small className="text-muted">Общий GPA</small>
                  </div>
                </div>
                <div className="col-md-3 col-6 mb-3">
                  <div className="bg-success bg-opacity-10 rounded p-3">
                    <div className="fw-bold text-success fs-4">{allGrades.length}</div>
                    <small className="text-muted">Всего предметов</small>
                  </div>
                </div>
                <div className="col-md-3 col-6 mb-3">
                  <div className="bg-warning bg-opacity-10 rounded p-3">
                    <div className="fw-bold text-warning fs-4">{currentGrades.length}</div>
                    <small className="text-muted">Предметов в семестре</small>
                  </div>
                </div>
                <div className="col-md-3 col-6 mb-3">
                  <div className="bg-info bg-opacity-10 rounded p-3">
                    <div className="fw-bold text-info fs-4">
                      {allGrades.filter(g => {
                        const avg1 = (g.current1.reduce((a, b) => a + b, 0) / g.current1.length);
                        const avg2 = (g.current2.reduce((a, b) => a + b, 0) / g.current2.length);
                        const rating = (g.rk1 + g.rk2 + avg1 + avg2) / 4;
                        const final = 0.4 * g.exam + 0.6 * rating;
                        return calculateGpa(final) >= 3.67;
                      }).length}
                    </div>
                    <small className="text-muted">Отличных оценок</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Список оценок */}
      <div className="row g-3">
        {currentGrades.map((grade, index) => (
          <div className="col-12 col-md-6 col-lg-4" key={index}>
            <div className="grade-card">
              <GradeCard grade={grade} />
            </div>
          </div>
        ))}
      </div>

      {currentGrades.length === 0 && (
        <div className="text-center text-muted py-5">
          <i className="bi bi-journal-x fs-1 mb-3"></i>
          <div>Предметы не найдены</div>
          <small>Попробуйте изменить фильтры или загрузите расписание</small>
        </div>
      )}
    </div>
  );
};

export default Grades; 