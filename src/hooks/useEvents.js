import { useCallback, useEffect, useState } from "react";
import { MOCK_EVENTS } from "../utils/mock";
import { EventsUtils, UtilsStorage } from "../utils/helper";

const useEvents = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const savedEvents = UtilsStorage.load();

    if (savedEvents && savedEvents.length > 0) {
      setEvents(savedEvents);
    } else {
      const initialEvents = MOCK_EVENTS.map(EventsUtils.getEventsFromData);
      setEvents(initialEvents);

      UtilsStorage.save(initialEvents);
    }
  }, []);

  const addEvent = useCallback((eventData) => {
    const newEvent = EventsUtils.getEventsFromData(eventData);

    if (!EventsUtils.validateEvent(newEvent)) {
      console.error("Invalid event data:", newEvent);
      return;
    }

    setEvents((prev) => {
      const updated = [...prev, newEvent];
      UtilsStorage.save(updated);
      return updated;
    });
  }, []);

  const updateEvent = useCallback((id, updates) => {
    setEvents((prev) => {
      const updated = prev.map((event) => {
        if (event.id === id) {
          const updatedEvent = { ...event, ...updates };

          if (!EventsUtils.validateEvent(updatedEvent)) {
            console.error("Invalid event data after update:", updatedEvent);
            return event;
          }

          return updatedEvent;
        }
        return event;
      });
      UtilsStorage.save(updated);
      return updated;
    });
  }, []);

  const removeEvent = useCallback((id) => {
    setEvents((prev) => {
      const updated = prev.filter((event) => event.id !== id);
      UtilsStorage.save(updated);
      return updated;
    });
  }, []);

  const clearAllEvents = useCallback(() => {
    setEvents([]);
    UtilsStorage.clear();
  }, []);

  const resetToMockEvents = useCallback(() => {
    const initialEvents = MOCK_EVENTS.map(EventsUtils.getEventsFromData);
    setEvents(initialEvents);
    UtilsStorage.save(initialEvents);
  }, []);

  return {
    events,
    addEvent,
    updateEvent,
    removeEvent,
    clearAllEvents,
    resetToMockEvents,
  };
};

export default useEvents;
