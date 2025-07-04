import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { Modal, Button, Accordion, Form } from 'react-bootstrap';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { getSchedule, getScheduleForFullCalendar, getNotes } from '../../utils/getSchedule';
import { addNote, updateNote } from '../../utils/notesUtils';

const localizer = momentLocalizer(moment);

const ScrollDays = ({ events = [], setSelectedDate, setShowModal, setSelectedEvents }) => {
  const [weekOffset, setWeekOffset] = useState(0);
  const [scheduleEvents, setScheduleEvents] = useState([]);

  const getEventsForDate = (date) => {
    return events.filter(event => moment(event.start).isSame(date, 'day'));
  };

  const getScheduleEventsForDate = (date) => {
    return scheduleEvents.filter(event => moment(event.start).isSame(date, 'day'));
  };

  useEffect(() => {
    const loadSchedule = async () => {
      try {
        const weekEvents = await getScheduleForFullCalendar();
        
        const allEvents = [];
        for (let weekOffset = -2; weekOffset <= 4; weekOffset++) {
          weekEvents.forEach((event, index) => {
            const newStart = moment(event.start).add(weekOffset, 'weeks').toDate();
            const newEnd = moment(event.end).add(weekOffset, 'weeks').toDate();
            allEvents.push({
              ...event,
              id: `${weekOffset}-${index}`,
              start: newStart,
              end: newEnd,
            });
          });
        }
        setScheduleEvents(allEvents);
      } catch (error) {
        console.error('Ошибка загрузки расписания:', error);
      }
    };
    loadSchedule();
  }, []);

  const generateWeekDays = () => {
    const days = [];
    const today = new Date();
    
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + 1);
    
    const startDayIndex = weekOffset * 4;
    const startDate = new Date(startOfWeek);
    startDate.setDate(startOfWeek.getDate() + startDayIndex);

    for (let i = 0; i < 4; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      const hasEvents = getEventsForDate(date).length > 0 || getScheduleEventsForDate(date).length > 0;
      const isToday = moment(date).isSame(today, 'day');
      days.push({
        date,
        day: date.getDate(),
        weekday: moment(date).format('ddd'),
        isToday,
        hasEvents,
      });
    }
    return days;
  };

  const handleDayClick = (day) => {
    const dayEvents = getScheduleEventsForDate(day.date);
    setSelectedEvents(dayEvents);
    setSelectedDate(day.date);
    setShowModal(true);
  };

  return (
    <div className="container-fluid mb-3">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <button
          className="btn btn-outline-primary btn-sm rounded-circle"
          onClick={() => setWeekOffset(weekOffset - 1)}
        >
          <i className="bi bi-chevron-left"></i>
        </button>
        <span className="text-muted fw-bold">
          {moment().add(weekOffset * 7, 'days').format('MMMM YYYY')}
        </span>
        <button
          className="btn btn-outline-primary btn-sm rounded-circle"
          onClick={() => setWeekOffset(weekOffset + 1)}
        >
          <i className="bi bi-chevron-right"></i>
        </button>
      </div>
      <div className="d-flex">
        {generateWeekDays().map((day, index) => (
          <div
            key={index}
            className={`flex-fill text-center p-3 mx-1 rounded-3 shadow-sm calendar-day-card ${
              day.isToday ? 'bg-primary text-white' : day.hasEvents ? 'bg-info text-white' : 'bg-white'
            }`}
            style={{ minWidth: '70px', cursor: 'pointer' }}
            onClick={() => handleDayClick(day)}
          >
            <div className="fw-bold">{day.weekday}</div>
            <div className="fs-5">{day.day}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const FullCalendar = ({ events = [], setSelectedDate, setShowModal, setSelectedEvents }) => {
  const [monthOffset, setMonthOffset] = useState(0);
  const [scheduleEvents, setScheduleEvents] = useState([]);

  const getEventsForDate = (date) => {
    return events.filter((event) => moment(event.start).isSame(date, 'day'));
  };

  const getScheduleEventsForDate = (date) => {
    return scheduleEvents.filter((event) => moment(event.start).isSame(date, 'day'));
  };

  const currentMonth = moment().add(monthOffset, 'months');

  const cellBaseClass = 'rounded-3 shadow-sm text-center p-2 mx-1';

  const getBtnClass = (date) => {
    if (moment(date).isSame(moment(), 'day')) return `${cellBaseClass} bg-primary text-white`;
    if (getEventsForDate(date).length > 0 || getScheduleEventsForDate(date).length > 0) return `${cellBaseClass} bg-info text-white`;
    return `${cellBaseClass} bg-white`;
  };

  useEffect(() => {
    const loadSchedule = async () => {
      try {
        const weekEvents = await getScheduleForFullCalendar();
        
        const allEvents = [];
        for (let weekOffset = -2; weekOffset <= 4; weekOffset++) {
          weekEvents.forEach((event, index) => {
            const newStart = moment(event.start).add(weekOffset, 'weeks').toDate();
            const newEnd = moment(event.end).add(weekOffset, 'weeks').toDate();
            allEvents.push({
              ...event,
              id: `${weekOffset}-${index}`,
              start: newStart,
              end: newEnd,
            });
          });
        }
        setScheduleEvents(allEvents);
      } catch (error) {
        console.error('Ошибка загрузки расписания:', error);
      }
    };
    loadSchedule();
  }, []);

  useEffect(() => {
    const handleCellClick = (e) => {
      const cell = e.target.closest('.rbc-date-cell');
      if (cell) {
        const dateStr = cell.getAttribute('aria-label');
        if (dateStr) {
          const date = moment(dateStr, 'MMMM D, YYYY').toDate();
          const dayEvents = getScheduleEventsForDate(date);
          setSelectedEvents(dayEvents);
          setSelectedDate(date);
          setShowModal(true);
        }
      }
    };

    const calendar = document.querySelector('.rbc-calendar');
    if (calendar) {
      calendar.addEventListener('click', handleCellClick);
    }

    return () => {
      if (calendar) {
        calendar.removeEventListener('click', handleCellClick);
      }
    };
  }, [scheduleEvents]);

  const handleDateClick = (date) => {
    const dayEvents = getScheduleEventsForDate(date);
    setSelectedEvents(dayEvents);
    setSelectedDate(date);
    setShowModal(true);
  };

  return (
    <div className="w-100 mb-3">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <button
          className="btn btn-outline-primary btn-sm rounded-circle"
          onClick={() => setMonthOffset(monthOffset - 1)}
          aria-label="Previous month"
        >
          <i className="bi bi-chevron-left"></i>
        </button>
        <span className="text-muted fw-bold">{currentMonth.format('MMMM YYYY')}</span>
        <button
          className="btn btn-outline-primary btn-sm rounded-circle"
          onClick={() => setMonthOffset(monthOffset + 1)}
          aria-label="Next month"
        >
          <i className="bi bi-chevron-right"></i>
        </button>
      </div>

      <div className="mb-3" style={{ height: '500px' }}>
        <style>
          {`
            .rbc-date-cell {
              cursor: pointer !important;
              padding: 8px !important;
            }
            .rbc-date-cell:hover {
              background-color: rgba(0, 123, 255, 0.1) !important;
            }
          `}
        </style>
        <Calendar
          localizer={localizer}
          events={scheduleEvents}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%' }}
          selectable
          onSelectSlot={({ start, end, slots }) => {
            if (start) {
              const dayEvents = getScheduleEventsForDate(start);
              setSelectedEvents(dayEvents);
              setSelectedDate(start);
              setShowModal(true);
            }
          }}
          onSelectEvent={(event) => {
            const dayEvents = getScheduleEventsForDate(event.start);
            setSelectedEvents(dayEvents);
            setSelectedDate(event.start);
            setShowModal(true);
          }}
          eventPropGetter={() => ({
            className: 'bg-info text-white',
          })}
          components={{
            toolbar: () => null,
          }}
          date={currentMonth.toDate()}
          onNavigate={() => {}}
        />
      </div>
    </div>
  );
};

const MyCalendar = ({ selectedDate, showModal, setShowModal, selectedEvents }) => {
  const [events] = useState([]);
  const [noteText, setNoteText] = useState('');
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [notes, setNotes] = useState([]);

  const getEventsForDate = (date) => {
    return events.filter(event => moment(event.start).isSame(date, 'day'));
  };

  const getNotesForDate = (date) => {
    return notes.filter(note => note.date === moment(date).format('YYYY-MM-DD'));
  };

  const handleAddNote = async () => {
    if (noteText.trim()) {
      const success = await addNote(noteText, selectedDate);
      if (success) {
        setNoteText('');
        setShowNoteForm(false);
        loadNotes();
      }
    } else {
      alert('Введите текст заметки');
    }
  };

  const handleToggleNote = async (noteId, completed) => {
    const success = await updateNote(noteId, !completed);
    if (success) {
      loadNotes();
    }
  };

  const loadNotes = async () => {
    try {
      const userNotes = await getNotes();

      setNotes(userNotes);
    } catch (error) {
      console.error('Ошибка загрузки заметок:', error);
    }
  };

  useEffect(() => {
    if (showModal) {
      loadNotes();
    }
  }, [showModal]);

  const handleCloseModal = () => {
    setShowModal(false);
    setNoteText('');
    setShowNoteForm(false);
  };

  const selectedDateNotes = selectedDate ? getNotesForDate(selectedDate) : [];

  return (
    <div className="container-fluid">
      <Modal show={showModal} onHide={handleCloseModal} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            Расписание на {selectedDate && moment(selectedDate).format('DD MMMM YYYY')}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: '70vh', overflowY: 'auto' }}>
          {selectedEvents && selectedEvents.length > 0 ? (
            <Accordion>
              {selectedEvents.map((event, index) => (
                <Accordion.Item key={index} eventKey={index.toString()}>
                  <Accordion.Header>
                    <div className="d-flex justify-content-between align-items-center w-100 me-3">
                      <span className="fw-bold">{event.title}</span>
                      <span className="text-muted small">
                        {moment(event.start).format('HH:mm')} - {moment(event.end).format('HH:mm')}
                      </span>
                    </div>
                  </Accordion.Header>
                  <Accordion.Body>
                    <div className="row">
                      <div className="col-12">
                        <strong>Время и аудитория:</strong><br />
                        {event.time} - {event.room}
                      </div>
                      <div className="col-12 mt-2">
                        <strong>Преподаватель:</strong><br />
                        {event.teacher}
                      </div>
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
              ))}
            </Accordion>
          ) : (
            <p className="text-center text-muted">На этот день расписания нет</p>
          )}
          
          {selectedDateNotes.length > 0 && (
            <div className="mt-3">
              <h6>Заметки:</h6>
              {selectedDateNotes.map((note) => (
                <div 
                  key={note.id} 
                  className={`d-flex align-items-center p-2 mb-2 rounded ${
                    note.completed ? 'bg-success text-white' : 'bg-light'
                  }`}
                >
                  <input
                    type="checkbox"
                    className="form-check-input me-2"
                    checked={note.completed}
                    onChange={() => handleToggleNote(note.id, note.completed)}
                  />
                  <span className={note.completed ? 'text-decoration-line-through' : ''}>
                    {note.text}
                  </span>
                </div>
              ))}
            </div>
          )}
          
          {showNoteForm && (
            <div className="mt-3">
              <Form.Group>
                <Form.Label>Добавить заметку:</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Введите текст заметки..."
                />
              </Form.Group>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="success" 
            onClick={() => setShowNoteForm(!showNoteForm)}
            className="me-2"
          >
            <i className="bi bi-plus"></i> Добавить заметку
          </Button>
          {showNoteForm && (
            <Button 
              variant="primary" 
              onClick={handleAddNote}
              className="me-2"
            >
              Сохранить
            </Button>
          )}
          <Button variant="secondary" onClick={handleCloseModal}>
            Закрыть
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

MyCalendar.ScrollDays = ScrollDays;
MyCalendar.FullCalendar = FullCalendar;

export default MyCalendar;




