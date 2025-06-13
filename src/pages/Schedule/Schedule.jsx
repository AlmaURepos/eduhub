import React, { useState } from 'react';
import { downloadAndParseExcel, parseSheet } from '../../utils/excelUtils';
import { saveScheduleToFirebase } from '../../utils/saveSchedule';
import { Accordion } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';


const Schedule = () => {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');
  const [sheets, setSheets] = useState([]);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSheet, setSelectedSheet] = useState('');
  const [scheduleData, setScheduleData] = useState([]);
  const [workbook, setWorkbook] = useState(null);

  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && (
      selectedFile.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      selectedFile.type === 'application/vnd.ms-excel' ||
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

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-8">
        <div className="card shadow-sm border-0 mb-4">
            <div className="card-body p-4">
              <div className="upload-area p-4 border-2 border-dashed rounded-3 bg-light text-center">
                <i className="bi bi-cloud-upload text-primary" style={{ fontSize: '2.5rem' }}></i>
                <h5 className="mt-3 mb-2">Загрузите расписание</h5>
                <p className="text-muted small mb-3">Поддерживаемые форматы: .xlsx, .xls, .csv</p>
                <label className="btn btn-primary px-4">
                  <i className="bi bi-file-earmark-excel me-2"></i>
                  Выбрать файл
                  <input
                    type="file"
                    className="d-none"
                    accept=".xlsx,.xls,.csv"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
            </div>
          </div>

          {isLoading && (
            <div className="progress mb-3">
              <div
                className="progress-bar"
                role="progressbar"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}

          {status && (
            <div className="alert alert-info mb-3">
              {status}
            </div>
          )}

          {sheets.length > 0 && (
            <div className="mb-3">
              <select 
                className="form-select"
                value={selectedSheet}
                onChange={(e) => handleSheetSelect(e.target.value)}
              >
                <option value="">Выберите группу</option>
                {sheets.map((sheet, index) => (
                  <option key={index} value={sheet}>{sheet}</option>
                ))}
              </select>
            </div>
          )}

          {Object.keys(groupedData).length > 0 && (
            <>
              <div className="accordion mb-4" id="scheduleAccordion">
                {Object.entries(groupedData).map(([day, entries], i) => (
                  <div className="accordion-item" key={i}>
                    <h2 className="accordion-header" id={`heading-${i}`}>
                      <button
                        className="accordion-button collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target={`#collapse-${i}`}
                        aria-expanded="false"
                        aria-controls={`collapse-${i}`}
                      >
                        {day}
                      </button>
                    </h2>
                    <div
                      id={`collapse-${i}`}
                      className="accordion-collapse collapse"
                      aria-labelledby={`heading-${i}`}
                      data-bs-parent="#scheduleAccordion"
                    >
                      <div className="accordion-body">
                        {entries.map((entry, j) => (
                          <div key={j} className="mb-3">
                            <div className="fw-semibold">
                              {entry.B || 'Время не указано'} — {entry.C || 'Предмет не указан'}
                            </div>
                            {(entry.D || entry.E) && (
                              <div className="ms-3">
                                {entry.D && <div><strong>Преподаватель:</strong> {entry.D}</div>}
                                {entry.E && <div><strong>Аудитория:</strong> {entry.E}</div>}
                              </div>
                            )}
                            <hr />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="d-grid">
                <button
                  className="btn btn-success"
                  onClick={async () => {
                    const calendarData = scheduleData.map((entry) => ({
                      day: entry.A || 'Неизвестный день',
                      time: entry.B || 'Не указано',
                      subject: entry.C || 'Не указано',
                      teacher: entry.D || 'Не указан',
                      room: entry.E || 'Не указана'
                    }));
                
                    const result = await saveScheduleToFirebase(calendarData);
                    if (result.success) {
                      alert(`Успешно сохранено в календарь! ID: ${result.id}`);
                    } else {
                      alert(`Ошибка при сохранении: ${result.error}`);
                    }
                  }}
                  
                >
                  <i className="bi bi-calendar-plus me-2"></i>
                  Добавить в календарь
                </button>
              </div>
            </>
          )}

        </div>
        
      </div>
    </div>
  );
};

export default Schedule;