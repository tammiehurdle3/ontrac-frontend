import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function TrackingForm() {
  const [trackingId, setTrackingId] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (trackingId.trim()) {
      navigate(`/tracking?id=${trackingId.trim()}`);
    } else {
      setError('Please enter a tracking number.');
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="tracking-form">
        <input
          type="text"
          value={trackingId}
          onChange={(e) => setTrackingId(e.target.value)}
          placeholder="Enter your tracking number here..."
        />
        <button className="button" type="submit">Track Your Package</button>
      </form>
      <p className="error-message">{error}</p>
    </>
  );
}

export default TrackingForm;