import React, { useState, useEffect } from 'react';
import { calculateTestScore, formatTime } from '../../utils/testingUtils';

const TestInterface = ({ test, onFinish }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(test.timeLimit);
  const [isFinished, setIsFinished] = useState(false);
  const [results, setResults] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          finishTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleAnswerSelect = (answerIndex) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion]: answerIndex
    }));
  };

  const nextQuestion = () => {
    if (currentQuestion < test.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const finishTest = () => {
    const testResults = calculateTestScore(answers, test);
    setResults(testResults);
    setIsFinished(true);
  };

  const getQuestionStatus = (index) => {
    if (answers[index] !== undefined) return 'answered';
    return 'unanswered';
  };

  if (isFinished && results) {
    return (
      <div className="container-fluid px-3 py-4">
        <div className="text-center mb-4">
          <i className="bi bi-check-circle text-success fs-1"></i>
          <h4 className="mt-3 mb-2 fw-bold">Тест завершен!</h4>
        </div>

        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body text-center">
            <h5 className="card-title mb-3">Результаты теста: {test.title}</h5>
            <div className="row">
              <div className="col-4">
                <div className="small text-muted">Правильных ответов</div>
                <div className="fs-3 fw-bold text-success">{results.correct}</div>
              </div>
              <div className="col-4">
                <div className="small text-muted">Всего вопросов</div>
                <div className="fs-3 fw-bold text-primary">{results.total}</div>
              </div>
              <div className="col-4">
                <div className="small text-muted">Процент</div>
                <div className="fs-3 fw-bold text-info">{results.percentage}%</div>
              </div>
            </div>
          </div>
        </div>

        <div className="card border-0 shadow-sm mb-4">
          <div className="card-header">
            <h6 className="mb-0">Детальные результаты</h6>
          </div>
          <div className="card-body">
            {results.results.map((result, index) => (
              <div key={index} className={`mb-3 p-3 rounded ${result.isCorrect ? 'bg-success bg-opacity-10' : 'bg-danger bg-opacity-10'}`}>
                <div className="d-flex align-items-start">
                  <div className={`badge ${result.isCorrect ? 'bg-success' : 'bg-danger'} me-2 mt-1`}>
                    {result.isCorrect ? '✓' : '✗'}
                  </div>
                  <div className="flex-grow-1">
                    <div className="fw-bold mb-2">Вопрос {index + 1}: {result.question}</div>
                    <div className="small text-muted mb-2">
                      Ваш ответ: {result.userAnswer !== undefined ? 
                        test.questions[index].options[result.userAnswer] : 
                        'Не отвечен'
                      }
                    </div>
                    <div className="small text-success mb-1">
                      Правильный ответ: {test.questions[index].options[result.correctAnswer]}
                    </div>
                    <div className="small text-muted">
                      {result.explanation}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <button className="btn btn-primary" onClick={onFinish}>
            Вернуться к тестам
          </button>
        </div>
      </div>
    );
  }

  const question = test.questions[currentQuestion];
  const isAnswered = answers[currentQuestion] !== undefined;

  return (
    <div className="container-fluid px-3 py-4">
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-primary bg-opacity-10 border-0">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">{test.title}</h5>
            <div className="d-flex align-items-center">
              <i className="bi bi-clock text-primary me-2"></i>
              <span className="fw-bold text-primary">{formatTime(timeLeft)}</span>
            </div>
          </div>
        </div>
        <div className="card-body">
          <div className="mb-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <span className="text-muted">Вопрос {currentQuestion + 1} из {test.questions.length}</span>
              <div className="d-flex gap-1">
                {test.questions.map((_, index) => (
                  <div
                    key={index}
                    className={`badge ${getQuestionStatus(index) === 'answered' ? 'bg-success' : 'bg-secondary'}`}
                    style={{ cursor: 'pointer' }}
                    onClick={() => setCurrentQuestion(index)}
                  >
                    {index + 1}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="progress mb-3" style={{ height: '4px' }}>
              <div 
                className="progress-bar" 
                style={{ width: `${((currentQuestion + 1) / test.questions.length) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="mb-4">
            <h5 className="mb-3">{question.question}</h5>
            <div className="row g-2">
              {question.options.map((option, index) => (
                <div className="col-12" key={index}>
                  <button
                    className={`btn w-100 text-start p-3 ${
                      answers[currentQuestion] === index 
                        ? 'btn-primary' 
                        : 'btn-outline-primary'
                    }`}
                    onClick={() => handleAnswerSelect(index)}
                  >
                    <span className="fw-bold me-2">{String.fromCharCode(65 + index)}.</span>
                    {option}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="d-flex justify-content-between">
            <button
              className="btn btn-outline-secondary"
              onClick={prevQuestion}
              disabled={currentQuestion === 0}
            >
              <i className="bi bi-chevron-left me-1"></i>
              Назад
            </button>
            
            {currentQuestion === test.questions.length - 1 ? (
              <button
                className="btn btn-success"
                onClick={finishTest}
                disabled={!isAnswered}
              >
                Завершить тест
                <i className="bi bi-check ms-1"></i>
              </button>
            ) : (
              <button
                className="btn btn-primary"
                onClick={nextQuestion}
                disabled={!isAnswered}
              >
                Далее
                <i className="bi bi-chevron-right ms-1"></i>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestInterface; 