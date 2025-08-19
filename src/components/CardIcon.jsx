// src/components/CardIcon.jsx
import React from 'react';

function CardIcon({ cardType }) {
  let icon = null;

  switch (cardType) {
    case 'visa':
      icon = (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 75 24">
          <path d="M49.5,24h-4.8l-7-24h5l7,24Zm-16.4-.3L29.3,0h-5L18.4,23.7h5.9ZM16.2,24h5.2L16.9,0h-5l-4.5,24h5.2l.6-3.1h5.7l.6,3.1Zm-5.3-7.5l2.2-11.2,2.2,11.2h-4.4ZM75,10.6c0-3.3-2-5.9-5.7-5.9s-5.7,2.6-5.7,5.9v.7c0,4.2,2.7,6,6.3,6,1.9,0,3.5-.6,4.6-1.5l-2.5-2.7c-.8,.7-1.6,1-2.4,1-1.3,0-2.2-1-2.2-2.5V11h6.6v-.4Z" fill="#142688"/>
        </svg>
      );
      break;
    case 'mastercard':
      icon = (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 24">
          <circle cx="12" cy="12" r="12" fill="#EA001B"/>
          <circle cx="28" cy="12" r="12" fill="#F79E1B" opacity=".8"/>
        </svg>
      );
      break;
    case 'american-express':
      icon = (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 38 24">
          <path d="M34.8,24H3.2A3.2,3.2,0,0,1,0,20.8V3.2A3.2,3.2,0,0,1,3.2,0H34.8A3.2,3.2,0,0,1,38,3.2V20.8A3.2,3.2,0,0,1,34.8,24Zm-10-8.8h-4l1-3.2h4.7l-1.7,2Zm-5.6-5.5,2-6.5h4.3l-2.6,8.8h-4Zm-4.3,5.5-2.6-8.8h4.3l-2,6.5Zm16.2-1.3L28.8,12l-1-3.2,2-6.5h-4.3l-2.6,8.8h.2l.2-.5.5-1.8.3-.7Zm-2.8-5.3,1.3-4.3h-4l-1.3,4.3Z" fill="#006FCF"/>
        </svg>
      );
      break;
    case 'discover':
      icon = (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 24">
          <path d="M57.6,24H2.4A2.4,2.4,0,0,1,0,21.6V2.4A2.4,2.4,0,0,1,2.4,0H57.6A2.4,2.4,0,0,1,60,2.4V21.6A2.4,2.4,0,0,1,57.6,24ZM19.2,14.2a6,6,0,1,0-6-6A6,6,0,0,0,19.2,14.2Zm-8.4,0A2.4,2.4,0,1,1,13.2,12,2.4,2.4,0,0,1,10.8,14.2Zm16,0a6,6,0,0,0,5.2-3.1l-2-1a3.5,3.5,0,0,1-3.1,1.8,3.6,3.6,0,0,1,0-7.2A3.6,3.6,0,0,1,29.9,8l2-1a6,6,0,0,0-5.2-3,6,6,0,0,0,0,12.1Zm12.6,0a6,6,0,1,0-6-6A6,6,0,0,0,39.4,14.2Zm-8.4,0a2.4,2.4,0,1,1,2.4-2.4A2.4,2.4,0,0,1,31,14.2Z" fill="#F68221"/>
        </svg>
      );
      break;
    default:
      break;
  }

  return <div className="card-icon-wrapper">{icon}</div>;
}

export default CardIcon;