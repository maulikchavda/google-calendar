import React, { useCallback, useMemo, useState } from "react";
import { UtilityDate } from "../utils/helper";
import styles from "../styles/Calendar.module.css";
import Header from "../components/Header";
import useEvents from "../hooks/useEvents";
import TimeColumn from "./TimeColumn";
import DayColumn from "./DayColumn";
import EventModal from "./EventModal";

const Calendar = () => {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const { events, addEvent, updateEvent, removeEvent } = useEvents();
  const [modalState, setModalState] = useState({
    isOpen: false,
    mode: "create",
    event: null,
    selectedDate: null,
  });

  const weekDays = useMemo(() => {
    const startOfWeek = UtilityDate.getStartOfWeek(currentWeek);
    return UtilityDate.getWeekDays(startOfWeek);
  }, [currentWeek]);

  const handlePrevious = useCallback(() => {
    setCurrentWeek((prev) => UtilityDate.addWeeks(prev, -1));
  }, []);

  const handleNext = useCallback(() => {
    setCurrentWeek((prev) => UtilityDate.addWeeks(prev, 1));
  }, []);

  const handleToday = useCallback(() => {
    setCurrentWeek(new Date());
  }, []);

  const handleTimeSlotClick = useCallback((selectedDate) => {
    setModalState({
      isOpen: true,
      mode: "create",
      event: null,
      selectedDate: selectedDate,
    });
  }, []);

  const handleEventEdit = useCallback((event) => {
    setModalState({
      isOpen: true,
      mode: "edit",
      event: event,
      selectedDate: null,
    });
  }, []);

  const handleEventRemove = useCallback(
    (eventId) => {
      if (window.confirm("Are you sure you want to remove this event?")) {
        removeEvent(eventId);
      }
    },
    [removeEvent]
  );

  const handleModalClose = useCallback(() => {
    setModalState({
      isOpen: false,
      mode: "create",
      event: null,
      selectedDate: null,
    });
  }, []);

  const handleModalSave = useCallback(
    (eventData) => {
      if (modalState.mode === "create") {
        addEvent(eventData);
      } else {
        updateEvent(modalState.event.id, eventData);
      }
    },
    [modalState.mode, modalState.event, addEvent, updateEvent]
  );
  return (
    <div className={styles.container}>
      <Header
        currentWeek={currentWeek}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onToday={handleToday}
      />
      <div className={styles.columnStyle}>
        <TimeColumn />

        {weekDays.map((day, index) => (
          <DayColumn
            key={day + index}
            day={day}
            events={events}
            isToday={UtilityDate.isToday(day)}
            onTimeSlotClick={handleTimeSlotClick}
            onEventEdit={handleEventEdit}
            onEventRemove={handleEventRemove}
          />
        ))}
      </div>

      <EventModal
        isOpen={modalState.isOpen}
        onClose={handleModalClose}
        onSave={handleModalSave}
        event={modalState.event}
        selectedDate={modalState.selectedDate}
      />
    </div>
  );
};

export default Calendar;
