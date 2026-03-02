// src/components/RecentEvent.jsx
import React from 'react';

function RecentEvent({ event }) {
  if (!event) return null;

  const handleChatClick = () => {
    if (window.Tawk_API && window.Tawk_API.maximize) {
      window.Tawk_API.maximize();
    }
  };

  // Support both old format (event.status) and new format (event.event)
  const eventLabel = event.event || event.status || '';

  return (
    <div className="most-recent-event">
      <h3>Most Recent Tracking Event</h3>
      <div className="event-details">
        <div className="event-item">
          <label>Event</label>
          <p>{eventLabel}</p>
        </div>
        <div className="event-item">
          <label>City</label>
          <p>{event.location}</p>
        </div>
        <div className="event-item">
          <label>Date & Time</label>
          <p>{event.timestamp}</p>
        </div>
      </div>
      <div className="event-description">
        <label>ABOUT THIS TRACKING EVENT</label>
        <p>{event.description}</p>
      </div>
      <div className="event-actions">
        <button className="button button-white" onClick={handleChatClick}>
          <i className="fa-solid fa-user-headset"></i> Chat now
        </button>
      </div>
    </div>
  );
}

export default RecentEvent;