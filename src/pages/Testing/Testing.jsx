import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { programmingTests } from '../../utils/testingUtils';

const Testing = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  // Преобразуем объект тестов в массив
  const testsArray = Object.entries(programmingTests).map(([id, test]) => ({
    id,
    ...test
  }));

  const filteredTests = testsArray.filter(test =>
    test.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (test.description?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="container-fluid px-3 py-4">
      <div className="text-center mb-4">
        <i className="bi bi-patch-question text-primary fs-1"></i>
        <h4 className="mt-3 mb-2 fw-bold">Тестирование</h4>
        <p className="text-muted small">Проверьте свои знания</p>
      </div>

      {/* Поиск */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Поиск тестов..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Список тестов */}
      <div className="row g-3">
        {filteredTests.map((test, index) => (
          <div className="col-12 col-md-6 col-lg-4" key={index}>
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body d-flex flex-column">
                <div className="d-flex align-items-center mb-3">
                  <div className="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3"
                       style={{ width: '50px', height: '50px' }}>
                    <i className="bi bi-code-slash text-primary fs-4"></i>
                  </div>
                  <div>
                    <h6 className="card-title mb-1">{test.title}</h6>
                    <small className="text-muted">{test.questions.length} вопросов</small>
                  </div>
                </div>
                
                <p className="card-text text-muted small mb-3 flex-grow-1">
                  {test.description || ''}
                </p>
                
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span className="badge bg-primary">{test.difficulty || 'Средний'}</span>
                  <span className="text-muted small">
                    <i className="bi bi-clock me-1"></i>
                    {test.timeLimit ? Math.round(test.timeLimit / 60) : 5} мин
                  </span>
                </div>
                
                <button
                  className="btn btn-outline-primary w-100"
                  onClick={() => navigate(`/testing/${test.id}`)}
                >
                  <i className="bi bi-play me-1"></i>
                  Начать тест
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredTests.length === 0 && (
        <div className="text-center text-muted py-5">
          <i className="bi bi-search fs-1 mb-3"></i>
          <div>Тесты не найдены</div>
          <small>Попробуйте изменить поисковый запрос</small>
        </div>
      )}
    </div>
  );
};

export default Testing; 