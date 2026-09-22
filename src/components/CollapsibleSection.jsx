// src/components/CollapsibleSection.jsx
import React, { useState } from 'react';

// The 'icon' prop is no longer needed
function CollapsibleSection({ title, children }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="collapsible-item">
      <button
        type="button"
        className="collapsible-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span>{title}</span>
        <i className={`fa-solid fa-chevron-down arrow ${isOpen ? 'open' : ''}`} aria-hidden="true"></i>
      </button>
      <div className={`collapsible-content ${isOpen ? 'open' : ''}`}>
        <div className="collapsible-content-inner">
          {children}
        </div>
      </div>
    </div>
  );
}

export default CollapsibleSection;