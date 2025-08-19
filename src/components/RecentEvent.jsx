// src/components/RecentEvent.jsx
import React from 'react';

// This component takes the event data as a prop
function RecentEvent({ event }) {
  if (!event) return null;

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
        <button className="button button-white"><i className="fa-solid fa-user-headset"></i> Chat now</button>
      </div>
    </div>
  );
}

export default RecentEvent;