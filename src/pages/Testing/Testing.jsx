import React, { useState } from 'react';
import { getAllTests } from '../../utils/testingUtils';
import TestInterface from '../../components/TestInterface/TestInterface';

const Testing = () => {
  const [selectedTest, setSelectedTest] = useState(null);
  const [isTestStarted, setIsTestStarted] = useState(false);

  const tests = getAllTests();

  const handleTestSelect = (test) => {
    setSelectedTest(test);
  };

  const startTest = () => {
    setIsTestStarted(true);
  };

  const finishTest = () => {
    setIsTestStarted(false);
    setSelectedTest(null);
  };

  if (isTestStarted && selectedTest) {
    return (
      <TestInterface 
        test={selectedTest} 
        onFinish={finishTest}
      />
    );
  }

  return (
    <div className="container-fluid px-3 py-4">
      <div className="text-center mb-4">
        <i className="bi bi-patch-question text-primary fs-1"></i>
        <h4 className="mt-3 mb-2 fw-bold">Тестирование</h4>
        <p className="text-muted small">Проверьте свои знания программирования</p>
      </div>

      <div className="row g-3">
        {tests.map((test) => (
          <div className="col-12 col-md-6" key={test.id}>
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body d-flex flex-column">
                <div className="text-center mb-3">
                  <i className="bi bi-code-slash text-primary fs-1"></i>
                </div>
                <h5 className="card-title text-center mb-3">{test.title}</h5>
                <div className="mb-3">
                  <div className="row text-center">
                    <div className="col-6">
                      <div className="small text-muted">Вопросов</div>
                      <div className="fw-bold text-primary">{test.questions.length}</div>
                    </div>
                    <div className="col-6">
                      <div className="small text-muted">Время</div>
                      <div className="fw-bold text-info">{Math.floor(test.timeLimit / 60)} мин</div>
                    </div>
                  </div>
                </div>
                <div className="mt-auto">
                  <button
                    className="btn btn-primary w-100"
                    onClick={() => handleTestSelect(test)}
                  >
                    Начать тест
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedTest && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Подтверждение</h5>
                <button type="button" className="btn-close" onClick={() => setSelectedTest(null)}></button>
              </div>
              <div className="modal-body">
                <p>Вы собираетесь начать тест: <strong>{selectedTest.title}</strong></p>
                <ul className="list-unstyled">
                  <li>• Количество вопросов: {selectedTest.questions.length}</li>
                  <li>• Время на тест: {Math.floor(selectedTest.timeLimit / 60)} минут</li>
                  <li>• После начала теста таймер нельзя остановить</li>
                </ul>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setSelectedTest(null)}>
                  Отмена
                </button>
                <button type="button" className="btn btn-primary" onClick={startTest}>
                  Начать тест
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Testing; 