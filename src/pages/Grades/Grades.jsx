import React, { useState, useEffect } from 'react';
import { getAllSubjects, distributeSubjectsToCourses, generateMockGrades, calculateGpa } from '../../utils/gradesUtils';
import GradeCard from '../../components/GradeCard/GradeCard';

const Grades = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [grades, setGrades] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [overallGPA, setOverallGPA] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const allSubjects = await getAllSubjects();
      const coursesStructure = distributeSubjectsToCourses(allSubjects);
      setCourses(coursesStructure);
      
      const mockGrades = generateMockGrades(allSubjects);
      setGrades(mockGrades);
      
      if (coursesStructure.length > 0) {
        setSelectedCourse(coursesStructure[0]);
        if (coursesStructure[0].semesters.length > 0) {
          setSelectedSemester(coursesStructure[0].semesters[0]);
        }
      }
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCourseSelect = (course) => {
    setSelectedCourse(course);
    if (course.semesters.length > 0) {
      setSelectedSemester(course.semesters[0]);
    } else {
      setSelectedSemester(null);
    }
  };

  const handleSemesterSelect = (semester) => {
    setSelectedSemester(semester);
  };

  const calculateOverallGPA = (subjects) => {
    if (subjects.length === 0) {
      setOverallGPA(0);
      return;
    }

    let totalGPA = 0;
    let count = 0;
    
    subjects.forEach(subject => {
      if (grades[subject]) {
        const subjectGrades = grades[subject];
        const avgCurrent1 = calculateAverage(subjectGrades.current1);
        const avgCurrent2 = calculateAverage(subjectGrades.current2);
        const rating = calculateRating(subjectGrades.rk1, subjectGrades.rk2, avgCurrent1, avgCurrent2);
        const final = calculateFinal(subjectGrades.exam, rating);
        const gpa = calculateGpa(final);
        totalGPA += gpa;
        count++;
      }
    });

    const average = count > 0 ? totalGPA / count : 0;
    setOverallGPA(Math.round(average * 100) / 100);
  };

  const calculateAverage = (grades) => {
    if (!grades || grades.length === 0) return 0;
    const sum = grades.reduce((acc, grade) => acc + grade, 0);
    return Math.round((sum / grades.length) * 100) / 100;
  };

  const calculateRating = (rk1, rk2, avg1, avg2) => {
    return Math.round(((rk1 + rk2 + avg1 + avg2) / 4) * 100) / 100;
  };

  const calculateFinal = (exam, rating) => {
    return Math.round((0.4 * exam + 0.6 * rating) * 100) / 100;
  };

  useEffect(() => {
    if (selectedSemester) {
      calculateOverallGPA(selectedSemester.subjects);
    }
  }, [selectedSemester, grades]);

  if (isLoading) {
    return (
      <div className="container-fluid px-3 py-4">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Загрузка...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid px-3 py-4">


      {courses.length > 0 && (
        <>
          <div className="row mb-4">
            <div className="col-12">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  
                  <div className="row g-2 mb-3">
                    {courses.map((course, index) => (
                      <div className="col-4" key={index}>
                        <button
                          className={`btn w-100 ${selectedCourse?.year === course.year ? 'btn-primary' : 'btn-outline-primary'}`}
                          onClick={() => handleCourseSelect(course)}
                        >
                          {course.name}
                        </button>
                      </div>
                    ))}
                  </div>

                  {selectedCourse && (
                    <div className="row g-2">
                      {selectedCourse.semesters.map((semester, index) => (
                        <div className="col-4" key={index}>
                          <button
                            className={`btn w-100 ${selectedSemester?.number === semester.number ? 'btn-success' : 'btn-outline-success'}`}
                            onClick={() => handleSemesterSelect(semester)}
                          >
                            {semester.name}
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {selectedSemester && (
            <>
              <div className="card shadow-sm mb-4 border-0">
                <div className="card-body text-center">
                  <div className="row align-items-center">
                    <div className="col-6">
                      <div className="small text-muted">GPA семестра</div>
                      <div className="fs-3 fw-bold text-primary">{overallGPA.toFixed(2)}</div>
                    </div>
                    <div className="col-6">
                      <div className="small text-muted">Предметов</div>
                      <div className="fs-3 fw-bold text-info">{selectedSemester.subjects.length}</div>
                    </div>
                  </div>
                </div>
              </div>

              {selectedSemester.subjects.length > 0 ? (
                selectedSemester.subjects.map((subject, index) => (
                  grades[subject] ? (
                    <GradeCard key={index} subject={subject} grades={grades[subject]} />
                  ) : (
                    <div key={index} className="card shadow-sm mb-3 border-0">
                      <div className="card-body p-3 text-center text-muted">
                        <i className="bi bi-book fs-4 mb-2"></i>
                        <div className="fw-bold">{subject}</div>
                        <small>Нет данных об оценках</small>
                      </div>
                    </div>
                  )
                ))
              ) : (
                <div className="text-center text-muted">
                  <i className="bi bi-calendar-x fs-1 mb-3"></i>
                  <div>Нет предметов в этом семестре</div>
                </div>
              )}
            </>
          )}
        </>
      )}

      {courses.length === 0 && (
        <div className="text-center text-muted">
          <i className="bi bi-calendar-x fs-1 mb-3"></i>
          <div>Нет предметов в расписании</div>
          <small>Добавьте расписание для отображения оценок</small>
        </div>
      )}
    </div>
  );
};

export default Grades; 