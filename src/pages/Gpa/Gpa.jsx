import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const Gpa = () => {
  const [subjects, setSubjects] = useState([
    { name: '', credits: 3, grade: '' }
  ]);
  const [gpa, setGpa] = useState(0);

  const gradePoints = {
    'A': 4.0, 'A-': 3.7, 'B+': 3.3, 'B': 3.0, 'B-': 2.7,
    'C+': 2.3, 'C': 2.0, 'C-': 1.7, 'D+': 1.3, 'D': 1.0, 'F': 0.0
  };

  const addSubject = () => {
    setSubjects([...subjects, { name: '', credits: 3, grade: '' }]);
  };

  const removeSubject = (index) => {
    if (subjects.length > 1) {
      const newSubjects = subjects.filter((_, i) => i !== index);
      setSubjects(newSubjects);
    }
  };

  const updateSubject = (index, field, value) => {
    const newSubjects = [...subjects];
    newSubjects[index][field] = value;
    setSubjects(newSubjects);
  };

  const calculateGPA = () => {
    let totalPoints = 0;
    let totalCredits = 0;

    subjects.forEach(subject => {
      if (subject.grade && subject.credits) {
        const points = gradePoints[subject.grade] || 0;
        totalPoints += points * parseFloat(subject.credits);
        totalCredits += parseFloat(subject.credits);
      }
    });

    const calculatedGPA = totalCredits > 0 ? totalPoints / totalCredits : 0;
    setGpa(calculatedGPA);
  };

  const clearAll = () => {
    setSubjects([{ name: '', credits: 3, grade: '' }]);
    setGpa(0);
  };

  return (
    <div className="container-fluid px-3 py-4">
      <div className="text-center mb-4">
        <i className="bi bi-calculator text-primary fs-1"></i>
        <h4 className="mt-3 mb-2 fw-bold">GPA Калькулятор</h4>
        <p className="text-muted small">Рассчитайте ваш средний балл</p>
      </div>

      {/* Результат */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-success bg-opacity-10 border-0">
              <h5 className="mb-0">
                <i className="bi bi-graph-up me-2"></i>
                Результат
              </h5>
            </div>
            <div className="card-body text-center">
              <div className="row">
                <div className="col-md-6">
                  <div className="bg-primary bg-opacity-10 rounded p-4">
                    <div className="fw-bold text-primary fs-1">{gpa.toFixed(2)}</div>
                    <small className="text-muted">Ваш GPA</small>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="bg-info bg-opacity-10 rounded p-4">
                    <div className="fw-bold text-info fs-1">
                      {gpa >= 3.5 ? 'Отлично' : gpa >= 3.0 ? 'Хорошо' : gpa >= 2.0 ? 'Удовлетворительно' : 'Неудовлетворительно'}
                    </div>
                    <small className="text-muted">Статус</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Форма ввода */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-primary bg-opacity-10 border-0">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">
                  <i className="bi bi-list-check me-2"></i>
                  Предметы
                </h5>
                <div className="d-flex gap-2">
                  <button className="btn btn-outline-primary btn-sm" onClick={addSubject}>
                    <i className="bi bi-plus me-1"></i>
                    Добавить
                  </button>
                  <button className="btn btn-outline-secondary btn-sm" onClick={clearAll}>
                    <i className="bi bi-trash me-1"></i>
                    Очистить
                  </button>
                </div>
              </div>
            </div>
            <div className="card-body">
              {subjects.map((subject, index) => (
                <div key={index} className="row g-3 mb-3 align-items-end">
                  <div className="col-md-5">
                    <label className="form-label small fw-bold">Предмет</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Название предмета"
                      value={subject.name}
                      onChange={(e) => updateSubject(index, 'name', e.target.value)}
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label small fw-bold">Кредиты</label>
                    <select
                      className="form-select"
                      value={subject.credits}
                      onChange={(e) => updateSubject(index, 'credits', e.target.value)}
                    >
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                      <option value="6">6</option>
                    </select>
                  </div>
                  <div className="col-md-3">
                    <label className="form-label small fw-bold">Оценка</label>
                    <select
                      className="form-select"
                      value={subject.grade}
                      onChange={(e) => updateSubject(index, 'grade', e.target.value)}
                    >
                      <option value="">Выберите</option>
                      <option value="A">A (4.0)</option>
                      <option value="A-">A- (3.7)</option>
                      <option value="B+">B+ (3.3)</option>
                      <option value="B">B (3.0)</option>
                      <option value="B-">B- (2.7)</option>
                      <option value="C+">C+ (2.3)</option>
                      <option value="C">C (2.0)</option>
                      <option value="C-">C- (1.7)</option>
                      <option value="D+">D+ (1.3)</option>
                      <option value="D">D (1.0)</option>
                      <option value="F">F (0.0)</option>
                    </select>
                  </div>
                  <div className="col-md-1">
                    {subjects.length > 1 && (
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => removeSubject(index)}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    )}
                  </div>
                </div>
              ))}
              
              <div className="d-grid mt-4">
                <button className="btn btn-primary" onClick={calculateGPA}>
                  <i className="bi bi-calculator me-1"></i>
                  Рассчитать GPA
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Информация о GPA */}
      <div className="row">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-info bg-opacity-10 border-0">
              <h6 className="mb-0">
                <i className="bi bi-info-circle me-2"></i>
                О системе GPA
              </h6>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <h6>Шкала оценок:</h6>
                  <ul className="list-unstyled small">
                    <li><strong>A:</strong> 4.0 - Отлично</li>
                    <li><strong>B:</strong> 3.0 - Хорошо</li>
                    <li><strong>C:</strong> 2.0 - Удовлетворительно</li>
                    <li><strong>D:</strong> 1.0 - Неудовлетворительно</li>
                    <li><strong>F:</strong> 0.0 - Неудачно</li>
                  </ul>
                </div>
                <div className="col-md-6">
                  <h6>Статус по GPA:</h6>
                  <ul className="list-unstyled small">
                    <li><strong>3.5-4.0:</strong> Отличная успеваемость</li>
                    <li><strong>3.0-3.49:</strong> Хорошая успеваемость</li>
                    <li><strong>2.0-2.99:</strong> Удовлетворительная</li>
                    <li><strong>0-1.99:</strong> Требует улучшения</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Gpa;
