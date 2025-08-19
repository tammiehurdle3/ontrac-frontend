// src/components/ProgressBar.jsx
import React from 'react';

function ProgressBar({ percent, labels }) {
  return (
    <div className="progress-section">
      <div className="progress-bar-container">
        <div className="progress-bar" style={{ width: `${percent}%` }}>
          <div className="progress-icon">
            <i className="fa-solid fa-van-shuttle"></i>
          </div>
        </div>
      </div>
      <div className="progress-labels">
        {labels.map((label, index) => (
          <span key={index}>{label}</span>
        ))}
      </div>
    </div>
  );
}

export default ProgressBar;