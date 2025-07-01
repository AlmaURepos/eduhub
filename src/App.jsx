import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import './styles/home.css';
import Header from './components/Header/Header';
import BottomNav from './components/BottomNav/BottomNav';
import SideMenu from './components/SideMenu/SideMenu';
import MyCalendar from './components/Calendar/Calendar';
import Schedule from './pages/Schedule/Schedule';
import Gpa from './pages/Gpa/Gpa';
import Grades from './pages/Grades/Grades';
import Testing from './pages/Testing/Testing';
import Events from './pages/Events/Events';
import EventDetail from './pages/Events/EventDetail';
import Profile from './pages/Profile/Profile';
import TestInterface from './components/TestInterface/TestInterface';

// Компонент домашней страницы
const Home = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedEvents, setSelectedEvents] = useState([]);
  
  return (
    <div className="container-fluid px-3 py-4 home-page">
      {/* Скролл календарь */}
      <div className="row mb-4">
        <div className="col-12">
          <MyCalendar.ScrollDays 
            setSelectedDate={setSelectedDate}
            setShowModal={setShowModal}
            setSelectedEvents={setSelectedEvents}
          />
        </div>
      </div>

      {/* Карточки для выбора разделов */}
      <div className="row g-3 mb-4">
        <div className="col-6">
          <div className="card border-0 shadow-sm h-100 home-card" style={{ cursor: 'pointer' }} onClick={() => navigate('/schedule')}>
            <div className="card-body text-center p-3">
              <i className="bi bi-calendar-event text-primary fs-2 mb-2 d-block"></i>
              <span className="fw-medium">Расписание</span>
            </div>
          </div>
        </div>
        <div className="col-6">
          <div className="card border-0 shadow-sm h-100 home-card" style={{ cursor: 'pointer' }} onClick={() => navigate('/grades')}>
            <div className="card-body text-center p-3">
              <i className="bi bi-graph-up text-success fs-2 mb-2 d-block"></i>
              <span className="fw-medium">Оценки</span>
            </div>
          </div>
        </div>
        <div className="col-6">
          <div className="card border-0 shadow-sm h-100 home-card" style={{ cursor: 'pointer' }} onClick={() => navigate('/testing')}>
            <div className="card-body text-center p-3">
              <i className="bi bi-patch-question text-warning fs-2 mb-2 d-block"></i>
              <span className="fw-medium">Тестирование</span>
            </div>
          </div>
        </div>
        <div className="col-6">
          <div className="card border-0 shadow-sm h-100 home-card" style={{ cursor: 'pointer' }} onClick={() => navigate('/events')}>
            <div className="card-body text-center p-3">
              <i className="bi bi-calendar-event text-info fs-2 mb-2 d-block"></i>
              <span className="fw-medium">События</span>
            </div>
          </div>
        </div>
        <div className="col-6">
          <div className="card border-0 shadow-sm h-100 home-card" style={{ cursor: 'pointer' }}>
            <div className="card-body text-center p-3">
              <i className="bi bi-chat-dots text-secondary fs-2 mb-2 d-block"></i>
              <span className="fw-medium">Чат</span>
            </div>
          </div>
        </div>
        <div className="col-6">
          <div className="card border-0 shadow-sm h-100 home-card" style={{ cursor: 'pointer' }} onClick={() => navigate('/gpa')}>
            <div className="card-body text-center p-3">
              <i className="bi bi-calculator text-danger fs-2 mb-2 d-block"></i>
              <span className="fw-medium">GPA</span>
            </div>
          </div>
        </div>
      </div>

      {/* Полный календарь */}
      <div className="row">
        <div className="col-12">
          <div className="home-calendar">
            <MyCalendar.FullCalendar 
              setSelectedDate={setSelectedDate}
              setShowModal={setShowModal}
              setSelectedEvents={setSelectedEvents}
            />
          </div>
        </div>
      </div>
      
      {/* Модальное окно для отображения расписания */}
      <MyCalendar 
        selectedDate={selectedDate}
        showModal={showModal}
        setShowModal={setShowModal}
        selectedEvents={selectedEvents}
      />
    </div>
  );
};

// Основной компонент приложения
function App() {
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);

  const handleToggleSideMenu = () => {
    setIsSideMenuOpen(!isSideMenuOpen);
  };

  return (
    <Router>
      <div className="app">
        <Header onMenuClick={handleToggleSideMenu} />
        <SideMenu 
          isOpen={isSideMenuOpen} 
          onClose={() => setIsSideMenuOpen(false)}
        />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/gpa" element={<Gpa />} />
            <Route path="/grades" element={<Grades />} />
            <Route path="/testing" element={<Testing />} />
            <Route path="/testing/:id" element={<TestInterface />} />
            <Route path="/events" element={<Events />} />
            <Route path="/events/:id" element={<EventDetail />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>
        <BottomNav />
      </div>
    </Router>
  );
}

export default App;





