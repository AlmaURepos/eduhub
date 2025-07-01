import React, { useState, useEffect } from 'react';
import { downloadAndParseExcel, parseSheet } from '../../utils/excelUtils';
import { saveScheduleToFirebase } from '../../utils/saveSchedule';
import { getSchedule } from '../../utils/getSchedule';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../styles/schedule.css';

const Schedule = () => {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');
  const [sheets, setSheets] = useState([]);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSheet, setSelectedSheet] = useState('');
  const [scheduleData, setScheduleData] = useState([]);
  const [workbook, setWorkbook] = useState(null);
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState('Понедельник');

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const data = await getSchedule();
        setSchedule(data);
      } catch (error) {
        console.error('Ошибка загрузки расписания:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, []);

  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && (
      selectedFile.type.includes('sheet') ||
      selectedFile.type.includes('excel') ||
      selectedFile.type === 'text/csv'
    )) {
      setFile(selectedFile);
      setStatus('Обработка файла...');
      setIsLoading(true);
      setProgress(0);
      try {
        const result = await downloadAndParseExcel(selectedFile, false, setProgress);
        setStatus(result.message);
        setSheets(result.sheets || []);
        setWorkbook(result.workbook);
        setSelectedSheet('');
        setScheduleData([]);
      } catch (error) {
        setStatus(`Ошибка: ${error.message}`);
      } finally {
        setIsLoading(false);
        setProgress(100);
      }
    } else {
      setStatus('Ошибка: выберите файл .xlsx, .xls или .csv');
    }
  };

  const handleSheetSelect = (sheet) => {
    setSelectedSheet(sheet);
    const parsed = parseSheet(workbook, sheet);
    setScheduleData(parsed);
  };

  const handleSaveSchedule = async () => {
    if (scheduleData.length === 0) {
      setStatus('Ошибка: нет данных для сохранения');
      return;
    }

    setStatus('Сохранение расписания...');
    setIsLoading(true);
    
    try {
      await saveScheduleToFirebase(scheduleData);
      setStatus('Расписание успешно сохранено!');
      
      // Обновляем отображение расписания
      const data = await getSchedule();
      setSchedule(data);
      
      // Очищаем данные загрузки
      setFile(null);
      setSheets([]);
      setWorkbook(null);
      setSelectedSheet('');
      setScheduleData([]);
    } catch (error) {
      setStatus(`Ошибка сохранения: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const groupByDay = (data) => {
    const grouped = {};
    data.forEach((entry) => {
      const day = entry.A || 'Без дня';
      if (!grouped[day]) grouped[day] = [];
      grouped[day].push(entry);
    });
    return grouped;
  };

  const groupedData = groupByDay(scheduleData);

  const days = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];

  const getDaySchedule = (day) => {
    return schedule.filter(item => {
      // Приводим к нижнему регистру для сравнения
      const itemDay = item.day ? item.day.toLowerCase() : '';
      const selectedDay = day.toLowerCase();
      return itemDay === selectedDay;
    });
  };

  if (loading) {
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
    <div className="container-fluid px-3 py-4 schedule-page">
      <div className="text-center mb-4">
        <i className="bi bi-calendar-event text-primary fs-1"></i>
        <h4 className="mt-3 mb-2 fw-bold">Расписание занятий</h4>
        <p className="text-muted small">Ваше расписание на неделю</p>
      </div>

      {/* Навигация по дням */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-0">
              <div className="nav nav-pills nav-fill">
                {days.map((day) => (
                  <button
                    key={day}
                    className={`nav-link ${selectedDay === day ? 'active' : ''}`}
                    onClick={() => setSelectedDay(day)}
                  >
                    {day.slice(0, 3)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Расписание на выбранный день */}
      <div className="row">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-primary bg-opacity-10 border-0">
              <h5 className="mb-0">
                <i className="bi bi-calendar-day me-2"></i>
                {selectedDay}
              </h5>
            </div>
            <div className="card-body">
              {schedule.length === 0 ? (
                <div className="text-center text-muted py-5">
                  <i className="bi bi-calendar-x fs-1 mb-3"></i>
                  <div>Расписание не загружено</div>
                  <small>Загрузите файл с расписанием, чтобы увидеть занятия</small>
                </div>
              ) : getDaySchedule(selectedDay).length > 0 ? (
                <div className="row g-3">
                  {getDaySchedule(selectedDay).map((lesson, index) => (
                    <div className="col-12 col-md-6 col-lg-4" key={index}>
                      <div className="card border-0 shadow-sm h-100">
                        <div className="card-body">
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <h6 className="card-title mb-0">{lesson.title || lesson.subject}</h6>
                            <span className="badge bg-primary">{lesson.time}</span>
                          </div>
                          <p className="card-text text-muted small mb-2">
                            <i className="bi bi-person me-1"></i>
                            {lesson.teacher}
                          </p>
                          <p className="card-text text-muted small mb-2">
                            <i className="bi bi-geo-alt me-1"></i>
                            {lesson.room}
                          </p>
                          <p className="card-text text-muted small">
                            <i className="bi bi-clock me-1"></i>
                            {lesson.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted py-5">
                  <i className="bi bi-calendar-x fs-1 mb-3"></i>
                  <div>Занятий нет</div>
                  <small>В этот день у вас нет занятий</small>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Загрузка файла */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-info bg-opacity-10 border-0">
              <h6 className="mb-0">
                <i className="bi bi-upload me-2"></i>
                Загрузить расписание
              </h6>
            </div>
            <div className="card-body">
              <p className="text-muted small mb-3">
                Загрузите файл Excel или CSV с вашим расписанием
              </p>
              {status && (
                <div className="alert alert-info mb-3">
                  <i className="bi bi-info-circle me-2"></i>
                  {status}
                </div>
              )}
              {isLoading && progress > 0 && progress < 100 && (
                <div className="mb-3">
                  <div className="progress">
                    <div 
                      className="progress-bar" 
                      role="progressbar" 
                      style={{ width: `${progress}%` }}
                      aria-valuenow={progress} 
                      aria-valuemin="0" 
                      aria-valuemax="100"
                    >
                      {progress}%
                    </div>
                  </div>
                </div>
              )}
              
              {/* Выбор листа */}
              {sheets.length > 0 && (
                <div className="mb-3">
                  <label className="form-label small">Выберите лист:</label>
                  <select 
                    className="form-select form-select-sm"
                    value={selectedSheet}
                    onChange={(e) => handleSheetSelect(e.target.value)}
                  >
                    <option value="">Выберите лист...</option>
                    {sheets.map((sheet, index) => (
                      <option key={index} value={sheet}>
                        {sheet}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              
              {/* Предварительный просмотр данных */}
              {scheduleData.length > 0 && (
                <div className="mb-3">
                  <div className="alert alert-success">
                    <i className="bi bi-check-circle me-2"></i>
                    Найдено {scheduleData.length} записей в расписании
                  </div>
                  <button 
                    className="btn btn-success"
                    onClick={handleSaveSchedule}
                    disabled={isLoading}
                  >
                    <i className="bi bi-save me-1"></i>
                    {isLoading ? 'Сохранение...' : 'Сохранить расписание'}
                  </button>
                </div>
              )}
              <div className="d-flex justify-content-center">
                <input
                  type="file"
                  id="fileInput"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
                <button 
                  className="btn btn-outline-primary"
                  onClick={() => document.getElementById('fileInput').click()}
                  disabled={isLoading}
                >
                  <i className="bi bi-file-earmark-excel me-1"></i>
                  {isLoading ? 'Обработка...' : 'Выбрать файл'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Schedule;
