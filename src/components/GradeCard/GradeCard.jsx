import React from 'react';
import { calculateAverage, calculateRating, calculateFinal, calculateGpa } from '../../utils/gradesUtils';

const GradeCard = ({ subject, grades }) => {
  const avgCurrent1 = calculateAverage(grades.current1);
  const avgCurrent2 = calculateAverage(grades.current2);
  const rating = calculateRating(grades.rk1, grades.rk2, avgCurrent1, avgCurrent2);
  const final = calculateFinal(grades.exam, rating);

  const gpaCurrent1 = calculateGpa(avgCurrent1);
  const gpaCurrent2 = calculateGpa(avgCurrent2);
  const gpaRk1 = calculateGpa(grades.rk1);
  const gpaRk2 = calculateGpa(grades.rk2);
  const gpaRating = calculateGpa(rating);
  const gpaExam = calculateGpa(grades.exam);
  const gpaFinal = calculateGpa(final);

  const getScoreColor = (gpa) => {
    if (gpa >= 3.67) return 'text-success';
    if (gpa >= 3.00) return 'text-warning';
    if (gpa >= 2.00) return 'text-info';
    return 'text-danger';
  };

  const getScoreBg = (gpa) => {
    if (gpa >= 3.67) return 'bg-success bg-opacity-10';
    if (gpa >= 3.00) return 'bg-warning bg-opacity-10';
    if (gpa >= 2.00) return 'bg-info bg-opacity-10';
    return 'bg-danger bg-opacity-10';
  };

  return (
    <div className="card border-0 shadow-sm mb-3">
      <div className="card-header bg-primary bg-opacity-10 border-0">
        <div className="d-flex align-items-center">
          <i className="bi bi-book text-primary me-2"></i>
          <h6 className="card-title mb-0 fw-bold text-dark">{subject}</h6>
        </div>
      </div>
      <div className="card-body p-0">
        <div className="row g-0">
          <div className="col-6 border-end">
            <div className="p-3">
              <div className="small text-muted mb-1">Среднее текущее 1</div>
              <div className="h5 mb-0 fw-bold text-muted">{avgCurrent1}%</div>
              <div className={`h6 mb-0 fw-bold ${getScoreColor(gpaCurrent1)}`}>
                GPA: {gpaCurrent1.toFixed(2)}
              </div>
            </div>
          </div>
          <div className="col-6">
            <div className="p-3">
              <div className="small text-muted mb-1">Среднее текущее 2</div>
              <div className="h5 mb-0 fw-bold text-muted">{avgCurrent2}%</div>
              <div className={`h6 mb-0 fw-bold ${getScoreColor(gpaCurrent2)}`}>
                GPA: {gpaCurrent2.toFixed(2)}
              </div>
            </div>
          </div>
        </div>
        
        <div className="row g-0 border-top">
          <div className="col-6 border-end">
            <div className="p-3">
              <div className="small text-muted mb-1">РК1</div>
              <div className="h5 mb-0 fw-bold text-muted">{grades.rk1}%</div>
              <div className={`h6 mb-0 fw-bold ${getScoreColor(gpaRk1)}`}>
                GPA: {gpaRk1.toFixed(2)}
              </div>
            </div>
          </div>
          <div className="col-6">
            <div className="p-3">
              <div className="small text-muted mb-1">РК2</div>
              <div className="h5 mb-0 fw-bold text-muted">{grades.rk2}%</div>
              <div className={`h6 mb-0 fw-bold ${getScoreColor(gpaRk2)}`}>
                GPA: {gpaRk2.toFixed(2)}
              </div>
            </div>
          </div>
        </div>
        
        <div className="row g-0 border-top">
          <div className="col-6 border-end">
            <div className="p-3">
              <div className="small text-muted mb-1">Рейтинг</div>
              <div className="h5 mb-0 fw-bold text-muted">{rating}%</div>
              <div className={`h6 mb-0 fw-bold ${getScoreColor(gpaRating)}`}>
                GPA: {gpaRating.toFixed(2)}
              </div>
            </div>
          </div>
          <div className="col-6">
            <div className="p-3">
              <div className="small text-muted mb-1">Экзамен</div>
              <div className="h5 mb-0 fw-bold text-muted">{grades.exam}%</div>
              <div className={`h6 mb-0 fw-bold ${getScoreColor(gpaExam)}`}>
                GPA: {gpaExam.toFixed(2)}
              </div>
            </div>
          </div>
        </div>
        
        <div className={`border-top ${getScoreBg(gpaFinal)}`}>
          <div className="p-3 text-center">
            <div className="small text-muted mb-1">ИТОГОВАЯ ОЦЕНКА</div>
            <div className="h4 mb-0 fw-bold text-muted">{final}%</div>
            <div className={`h3 mb-0 fw-bold ${getScoreColor(gpaFinal)}`}>
              GPA: {gpaFinal.toFixed(2)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GradeCard; 