import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faScrewdriverWrench } from '@fortawesome/free-solid-svg-icons';

function MaintenancePage() {
  return (
    <div className="maintenance-container">
      <div className="maintenance-box">
        <div className="maintenance-icon">
          <FontAwesomeIcon icon={faScrewdriverWrench} />
        </div>
        <h1 className="maintenance-title">We'll be back soon</h1>
        <p className="maintenance-text">
          Our site is currently undergoing scheduled maintenance to improve your experience. 
          We expect to be back online shortly. Thank you for your patience.
        </p>
      </div>
    </div>
  );
}

export default MaintenancePage;