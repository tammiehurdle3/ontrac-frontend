// src/components/ProgressBar.jsx
import React from 'react';

// The 8 visual labels. If a shipment has old/missing progressLabels,
// this is the fallback so the bar never breaks.
const DEFAULT_LABELS = [
  "Label Created",
  "Package Received",
  "Departed Origin Facility",
  "Arrived at Hub",
  "Departed Hub",
  "Arrived in Destination Country",
  "Out for Delivery",
  "Delivered",
];

// Maps any detailed backend status → the correct visual label.
// Handles old shipments saved before the visual-label fix.
const DETAIL_TO_VISUAL = {
  "Label Created":                          "Label Created",
  "Package Received":                       "Package Received",
  "Departed Origin Facility":               "Departed Origin Facility",
  "Arrived at US International Gateway":    "Arrived at Hub",
  "Export Clearance Completed":             "Arrived at Hub",
  "Departed US — In Flight":                "Arrived at Hub",
  "In Transit — International Flight":      "Arrived at Hub",
  "Arrived at Regional Sorting Hub":        "Arrived at Hub",
  "Departed Sorting Hub":                   "Departed Hub",
  "Arrived at Destination Country":         "Arrived in Destination Country",
  "Customs Processing":                     "Arrived in Destination Country",
  "Held at Customs — Payment Required":     "Arrived in Destination Country",
  "Payment Received — Customs Released":    "Arrived in Destination Country",
  "Departed Customs — En Route":            "Arrived in Destination Country",
  "Arrived at Local Delivery Facility":     "Out for Delivery",
  "Out for Delivery":                       "Out for Delivery",
  "Delivered":                              "Delivered",
  // Legacy labels from before the rebuild
  "Departed Hub":                           "Departed Hub",
  "Arrived at Hub":                         "Arrived at Hub",
  "Arrived in Destination Country":         "Arrived in Destination Country",
  "Payment Confirmed":                      "Arrived in Destination Country",
  "In Transit":                             "Arrived at Hub",
  // Manual admin entries — anything customs-related maps to destination country dot
  "Held at Customs":                        "Arrived in Destination Country",
  "Held by Customs":                        "Arrived in Destination Country",
  "Customs Hold":                           "Arrived in Destination Country",
  "Pending Customs":                        "Arrived in Destination Country",
  "Customs Clearance":                      "Arrived in Destination Country",
  "Cleared Customs":                        "Arrived in Destination Country",
  "Payment Required":                       "Arrived in Destination Country",
  "Inbound Clearance Finalized":            "Arrived in Destination Country",
  // Domestic US stages
  "Arrived at Sort Facility":               "Arrived at Sort Facility",
  "Arrived at Regional Sort Facility":      "Arrived at Sort Facility",
  "Delivery Exception — Redelivery Fee Required": "Out for Delivery",
  "Redelivery Fee Confirmed — Rescheduled": "Out for Delivery",
};

// Stages that should show a truck icon when active
const TRUCK_LABELS = new Set([
  "Departed Origin Facility",
  "Arrived at Hub",
  "Departed Hub",
  "Out for Delivery",
]);

// Stages that should show a clock/customs icon when active
const CUSTOMS_LABELS = new Set([
  "Arrived in Destination Country",
]);

function ProgressBar({ labels: rawLabels = [], status, allEvents = [], requiresPayment = false, paymentDescription = '' }) {

  // Detect domestic from status or events before choosing labels
  const isDomestic = (
    (status || '').includes('Sort Facility') ||
    (rawLabels || []).includes('Arrived at Sort Facility') ||
    (allEvents || []).some(e => (e.city || '').includes(', MD') || (e.city || '').includes(', TX') || (e.city || '').includes(', NY') || (e.city || '').includes(', CA') || (e.city || '').includes(', FL'))
  );

  const DOMESTIC_LABELS = [
    "Label Created", "Package Received", "Departed Origin Facility",
    "Arrived at Sort Facility", "Out for Delivery", "Delivered",
  ];

  // Always use exactly the right labels. Override stale international labels for domestic.
  const labels = isDomestic
    ? DOMESTIC_LABELS
    : ((rawLabels && rawLabels.length >= 4) ? rawLabels : DEFAULT_LABELS);

  const trimmedLabels = labels.map(l => l.trim());

  // Normalize status: translate any detailed stage name to its visual equivalent.
  // This handles both new shipments (already visual) and old saved ones (detailed).
  const rawStatus = status ? status.trim() : '';
  const trimmedStatus = DETAIL_TO_VISUAL[rawStatus] || rawStatus;

  // Check if current status matches one of the visual labels
  const activeIndex = trimmedLabels.indexOf(trimmedStatus);

  // Fallback: if status doesn't match (e.g. old shipment with detailed status),
  // scan allEvents to find the last label that appeared in the event history.
  const eventHistory = allEvents.map(e => {
    const raw = (e.event || '').trim();
    return DETAIL_TO_VISUAL[raw] || raw;
  });
  let lastCompletedIndex = -1;
  trimmedLabels.forEach((label, i) => {
    if (eventHistory.includes(label)) lastCompletedIndex = i;
  });

  const isStandardStatus = activeIndex > -1;

  return (
    <div className="progress-tracker-wrapper">
      <div className="progress-tracker">
        {labels.map((label, index) => {
          let statusClass = 'incomplete';
          let icon = <i className="fa-regular fa-circle"></i>;

          if (isStandardStatus) {
            // Status matches a known label — use it directly
            if (index < activeIndex) {
              statusClass = 'completed';
              icon = <i className="fa-solid fa-check"></i>;
            } else if (index === activeIndex) {
              statusClass = 'active';
              if (TRUCK_LABELS.has(label)) {
                icon = <i className="fa-solid fa-truck"></i>;
              } else if (CUSTOMS_LABELS.has(label)) {
                icon = <i className="fa-solid fa-building-columns"></i>;
              } else {
                icon = <i className="fa-solid fa-circle-dot"></i>;
              }
            }
          } else {
            // Fallback: use event history scan
            if (index <= lastCompletedIndex) {
              statusClass = 'completed';
              icon = <i className="fa-solid fa-check"></i>;
            } else if (index === lastCompletedIndex + 1) {
              // Next stage after last completed = estimated current
              statusClass = 'active';
              icon = <i className="fa-solid fa-circle-dot"></i>;
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

      {/* Attention bar — shown when payment is required (customs or redelivery) */}
      {requiresPayment && (
        <div className="special-status-indicator">
          {paymentDescription && paymentDescription !== 'Import Duties'
            ? <><strong>⚠ Action Required:</strong> {paymentDescription}</>
            : trimmedLabels.includes("Arrived at Sort Facility")
              ? <><strong>⚠ Action Required:</strong> A delivery attempt was made but was unsuccessful. A redelivery fee is required to reschedule your delivery. Please pay below.</>
              : <><strong>⚠ Action Required:</strong> Your shipment is held at customs pending payment of import duties. Please pay below to release your package.</>
          }
        </div>
      )}
    </div>
  );
}

export default ProgressBar;