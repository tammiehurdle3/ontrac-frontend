// src/components/ProgressBar.jsx
import React from 'react';

function ProgressBar({ labels = [], status, allEvents = [] }) {
  
  let lastCompletedStandardIndex = -1;
  const eventHistory = allEvents.map(event => event.event.trim());

  labels.forEach((label, index) => {
    if (eventHistory.includes(label.trim())) {
      lastCompletedStandardIndex = index;
    }
  });

  const isStandardStatus = labels.map(l => l.trim()).includes(status ? status.trim() : '');
  const activeIndex = isStandardStatus ? labels.indexOf(status) : -1;

  return (
    <div className="progress-tracker-wrapper">
      <div className="progress-tracker">
        {labels.map((label, index) => {
          let statusClass = 'incomplete';
          let icon = <i className="fa-regular fa-circle"></i>;

          if (activeIndex > -1) {
            if (index < activeIndex) {
              statusClass = 'completed';
              icon = <i className="fa-solid fa-check"></i>;
            } else if (index === activeIndex) {
              statusClass = 'active';

              // --- THIS IS THE UPDATED LOGIC ---
              // A list of all statuses that should show the truck icon.
              const truckStatuses = [
                'In Transit', 
                'Out for Delivery',
                'Departed Origin Facility',
                'Arrived at Hub',
                'Departed Hub',
                'Arrived at Destination Facility'
              ];
              
              if (truckStatuses.includes(label)) {
                icon = <i className="fa-solid fa-truck"></i>;
              } else {
                icon = <i className="fa-solid fa-circle-dot"></i>;
              }
              // --- END OF UPDATE ---

            }
          } else {
            if (index <= lastCompletedStandardIndex) {
              statusClass = 'completed';
              icon = <i className="fa-solid fa-check"></i>;
            }
          }

          return (
            <div key={index} className={`milestone ${statusClass}`}>
              <div className="milestone-icon">{icon}</div>
              <div className="milestone-label">{label}</div>
              {index < labels.length - 1 && <div className="milestone-line"></div>}
            </div>
          );
        })}
      </div>
      
      {!isStandardStatus && status && (
        <div className="special-status-indicator">
          <strong>Current Status:</strong> {status}
        </div>
      )}
    </div>
  );
}

export default ProgressBar;