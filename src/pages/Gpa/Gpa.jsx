import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const percentToGpa = (percent) => {
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

const Gpa = () => {
  const [courses, setCourses] = useState([{ credits: '', percent: '' }]);
  const [gpa, setGpa] = useState(null);

  const handleChange = (index, field, value) => {
    const updated = [...courses];
    updated[index][field] = value;
    setCourses(updated);
  };

  const addCourse = () => {
    setCourses([...courses, { credits: '', percent: '' }]);
  };

  const calculateGpa = () => {
    let totalWeighted = 0;
    let totalCredits = 0;

    courses.forEach(({ credits, percent }) => {
      const c = parseFloat(credits);
      const p = parseFloat(percent);
      if (!isNaN(c) && !isNaN(p)) {
        const gpaEquivalent = percentToGpa(p);
        totalCredits += c;
        totalWeighted += c * gpaEquivalent;
      }
    });

    const finalGpa = totalCredits > 0 ? totalWeighted / totalCredits : 0;
    setGpa(finalGpa.toFixed(2));
  };

  return (
    <div className="container-fluid px-3 py-4" >
      <h4 className="text-center mb-4 fw-semibold">GPA калькулятор</h4>

      {courses.map((course, index) => (
        <div key={index} className="mb-3 d-flex gap-2">
          <input
            type="number"
            inputMode="decimal"
            className="form-control rounded-3 text-center"
            placeholder="Кредиты"
            value={course.credits}
            onChange={(e) => handleChange(index, 'credits', e.target.value)}
          />
          <input
            type="number"
            inputMode="decimal"
            className="form-control rounded-3 text-center"
            placeholder="%"
            value={course.percent}
            onChange={(e) => handleChange(index, 'percent', e.target.value)}
          />
        </div>
      ))}

      <div className="d-grid gap-2 mt-2 mb-3">
        <button
          className="btn btn-outline-secondary rounded-3"
          onClick={addCourse}
        >
          + Добавить дисциплину
        </button>
        <button
          className="btn btn-primary rounded-3"
          onClick={calculateGpa}
        >
          Рассчитать GPA
        </button>
      </div>

      {gpa !== null && (
        <div className="alert alert-success text-center mt-4 rounded-3 fs-5">
          GPA: <strong>{gpa}</strong>
        </div>
      )}
    </div>
  );
};

export default Gpa;
