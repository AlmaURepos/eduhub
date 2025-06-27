import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
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

// Компонент домашней страницы
const Home = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedEvents, setSelectedEvents] = useState([]);
  
  return (
    <div className="container-fluid">
      <h2 className="welcome-text"></h2>
      <div className="quick-actions">
        <div className="row g-3">
          <div className="col-12">
            <MyCalendar.ScrollDays 
              setSelectedDate={setSelectedDate}
              setShowModal={setShowModal}
              setSelectedEvents={setSelectedEvents}
            />
          </div>
          <div className="col-6">
            <div className="quick-action-card" onClick={() => navigate('/schedule')}>
              <i className="bi bi-calendar-event"></i>
              <span>Расписание</span>
            </div>
          </div>
          <div className="col-6">
            <div className="quick-action-card" onClick={() => navigate('/grades')}>
              <i className="bi bi-graph-up"></i>
              <span>Оценки</span>
            </div>
          </div>
          <div className="col-6">
            <div className="quick-action-card" onClick={() => navigate('/testing')}>
              <i className="bi bi-patch-question"></i>
              <span>Тестирование</span>
            </div>
          </div>
          <div className="col-6">
            <div className="quick-action-card" onClick={() => navigate('/events')}>
              <i className="bi bi-calendar-event"></i>
              <span>События</span>
            </div>
          </div>
          <div className="col-6">
            <div className="quick-action-card">
              <i className="bi bi-chat-dots"></i>
              <span>Чат</span>
            </div>
          </div>
          <div className="col-6">
            <div className="quick-action-card " onClick={() => navigate('/gpa')}>
              <i className="bi bi-calculator"></i>
              <span>GPA</span>
            </div>
          </div>
          <div className="col-12">
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





