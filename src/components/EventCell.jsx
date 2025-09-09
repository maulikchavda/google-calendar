import React, { useState } from "react";
import styles from "../styles/EventCell.module.css";
import { EVENT_COLORS } from "../utils/constants";

const EventCell = ({ event, style, onEdit, onRemove }) => {
  const [showRemove, setShowRemove] = useState(false);
  const isAllDayEvent =
    event.type === "ALL DAY EVENT" || event.type === "HOLIDAY";

  const handleClick = (e) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(event);
    }
  };

  const handleRemoveClick = (e) => {
    e.stopPropagation();
    if (onRemove) {
      onRemove(event.id);
    }
  };

  return (
    <div
      className={`${styles.cell} ${isAllDayEvent ? styles.allDayCell : ""}`}
      style={{ ...style, background: EVENT_COLORS[event.type] }}
      title={event.title}
      onClick={handleClick}
      onMouseEnter={() => setShowRemove(true)}
      onMouseLeave={() => setShowRemove(false)}
    >
      <span className={styles.eventTitle}>{event.title}</span>
      {showRemove && onRemove && (
        <button
          className={styles.removeButton}
          onClick={handleRemoveClick}
          title="Remove event"
        >
          ×
        </button>
      )}
    </div>
  );
};

export default EventCell;
