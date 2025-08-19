// src/components/CollapsibleSection.jsx
import React, { useState } from 'react';

// The 'icon' prop is no longer needed
function CollapsibleSection({ title, children }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="collapsible-item">
      <h3 className="collapsible-toggle" onClick={() => setIsOpen(!isOpen)}>
        {/* The title is now simpler */}
        {title}
        <i className={`fa-solid fa-chevron-down arrow ${isOpen ? 'open' : ''}`}></i>
      </h3>
      <div className={`collapsible-content ${isOpen ? 'open' : ''}`}>
        <div className="collapsible-content-inner">
          {children}
        </div>
      </div>
    </div>
  );
}

export default CollapsibleSection;