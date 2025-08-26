// src/components/RecentEvent.jsx
import React from 'react';

// This component takes the event data as a prop
function RecentEvent({ event }) {
  if (!event) return null;

  // --- NEW: Function to open the Tawk.to chat widget ---
  const handleChatClick = () => {
    // This checks if the Tawk.to API is available on the page
    if (window.Tawk_API && window.Tawk_API.maximize) {
      window.Tawk_API.maximize();
    }
  };

  return (
    <div className="most-recent-event">
      <h3>Most Recent Tracking Event</h3>
      <div className="event-details">
        <div className="event-item">
          <label>Event</label>
          <p>{event.status}</p>
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
        {/* --- UPDATED: The button is now clickable --- */}
        <button className="button button-white" onClick={handleChatClick}>
          <i className="fa-solid fa-user-headset"></i> Chat now
        </button>
      </div>
    </div>
  );
}

export default RecentEvent;
