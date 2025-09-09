import React, { useMemo } from "react";
import dayjs from "dayjs";
import { UtilityDate } from "../utils/helper";
import styles from "../styles/DayColumn.module.css";
import EventCell from "./EventCell";

const DayColumn = ({
  day,
  events,
  isToday,
  onTimeSlotClick,
  onEventEdit,
  onEventRemove,
}) => {
  const hours = UtilityDate.getHours();
  const isSunday = dayjs(day).day() === 0;

  const handleTimeSlotClick = (hour) => {
    if (isSunday) return;
    if (onTimeSlotClick) {
      const clickedTime = dayjs(day).hour(hour).minute(0).second(0);
      onTimeSlotClick(clickedTime);
    }
  };

  const { timeEvents, allDayEvents } = useMemo(() => {
    const filtered = events.filter((event) => {
      const eventStart = dayjs(event.start);
      const isSame = UtilityDate.isSameDay(eventStart, day);
      return isSame;
    });

    const allDay = [];
    const timed = [];

    filtered.forEach((event) => {
      const eventStart = dayjs(event.start);
      const eventEnd = dayjs(event.end);
      const duration = eventEnd.diff(eventStart, "hour", true);

      const isAllDayEvent =
        event.type === "ALL DAY EVENT" ||
        event.type === "HOLIDAY" ||
        (duration >= 2 && eventStart.hour() === 0 && eventStart.minute() === 0);

      if (isAllDayEvent) {
        allDay.push({
          ...event,
          style: {
            position: "relative",
            margin: "2px 4px",
            height: "20px",
            width: "auto",
            borderRadius: "3px",
            padding: "0px 6px",
            fontSize: "11px",
            fontWeight: "500",
            display: "flex",
            alignItems: "center",
          },
        });
      } else {
        const startHour = eventStart.hour();
        const startMinute = eventStart.minute();
        const endHour = eventEnd.hour();
        const endMinute = eventEnd.minute();

        const startPosition = startHour * 60 + startMinute;
        const eventDuration =
          endHour * 60 + endMinute - (startHour * 60 + startMinute);

        timed.push({
          ...event,
          style: {
            position: "absolute",
            top: `${startPosition + 120 + endHour}px`,
            left: "4px",
            right: "4px",
            height: `${Math.max(eventDuration, 20)}px`,
            zIndex: 1,
          },
        });
      }
    });

    return { timeEvents: timed, allDayEvents: allDay };
  }, [day, events]);

  return (
    <div
      className={`${styles.container} ${isSunday ? styles.sundayColumn : ""}`}
      style={{ background: isToday ? "#dbeafe" : "#ffffff" }}
    >
      <div
        className={styles.header}
        style={{ backgroundColor: isToday ? "#bfdbfe" : "#ffffff" }}
      >
        <div className={styles.title}>{UtilityDate.formatDayHeader(day)}</div>
      </div>
      <div
        className={styles.row}
        style={{ backgroundColor: isToday ? "#dbeafe" : "#ffffff" }}
      >
        {allDayEvents.map((event) => (
          <EventCell
            key={event.id}
            event={event}
            style={event.style}
            onEdit={onEventEdit}
            onRemove={onEventRemove}
          />
        ))}
      </div>
      {hours.map((hour) => (
        <div
          key={hour}
          className={`${styles.hourCell} ${isSunday ? styles.sundayCell : ""}`}
          onClick={() => handleTimeSlotClick(hour)}
        ></div>
      ))}
      {timeEvents.map((event) => (
        <EventCell
          key={event.id}
          event={event}
          style={event.style}
          onEdit={onEventEdit}
          onRemove={onEventRemove}
        />
      ))}
    </div>
  );
};

export default DayColumn;
