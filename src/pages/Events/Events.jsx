import React, { useState } from 'react';
import { universityEvents, categories, getEventsByCategory, searchEvents } from '../../utils/eventsUtils';
import EventCard from './EventCard';

const Events = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredEvents, setFilteredEvents] = useState(universityEvents);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    const events = getEventsByCategory(category);
    if (searchQuery) {
      const searchResults = searchEvents(searchQuery);
      setFilteredEvents(events.filter(event => searchResults.includes(event)));
    } else {
      setFilteredEvents(events);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query) {
      const searchResults = searchEvents(query);
      const categoryEvents = getEventsByCategory(selectedCategory);
      setFilteredEvents(categoryEvents.filter(event => searchResults.includes(event)));
    } else {
      setFilteredEvents(getEventsByCategory(selectedCategory));
    }
  };

  return (
    <div className="container-fluid px-3 py-4">
      <div className="text-center mb-4">
        <i className="bi bi-calendar-event text-primary fs-1"></i>
        <h4 className="mt-3 mb-2 fw-bold">События университета</h4>
        <p className="text-muted small">Новости и мероприятия</p>
      </div>

      <div className="row mb-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-8">
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="bi bi-search"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Поиск событий..."
                      value={searchQuery}
                      onChange={(e) => handleSearch(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <select
                    className="form-select"
                    value={selectedCategory}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                  >
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-3">
        {filteredEvents.map((event) => (
          <div className="col-12 col-md-6 col-lg-4" key={event.id}>
            <EventCard event={event} />
          </div>
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <div className="text-center text-muted py-5">
          <i className="bi bi-calendar-x fs-1 mb-3"></i>
          <div>События не найдены</div>
          <small>Попробуйте изменить параметры поиска</small>
        </div>
      )}
    </div>
  );
};

export default Events; 