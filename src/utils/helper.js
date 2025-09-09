import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import { STORAGE_KEY } from "./constants";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

export const UtilityDate = {
  getStartOfWeek: (date) => dayjs(date).startOf("week"),

  getEndOfWeek: (date) => dayjs(date).endOf("week"),

  getWeekDays: (startDate) => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      days.push(dayjs(startDate).add(i, "day"));
    }
    return days;
  },

  getHours: () => {
    const hours = [];
    for (let i = 0; i < 24; i++) {
      hours.push(i);
    }
    return hours;
  },

  formatHour: (hour) => {
    if (hour === 0) return "12 AM";
    if (hour === 12) return "12 PM";
    if (hour < 12) return `${hour} AM`;
    return `${hour - 12} PM`;
  },

  formatDayHeader: (date) => {
    return dayjs(date).format("ddd D");
  },

  formatMonth: (date) => {
    return dayjs(date).format("MMMM YYYY");
  },

  isToday: (date) => dayjs(date).isSame(dayjs(), "day"),

  isSameWeek: (date1, date2) => {
    return UtilityDate.getStartOfWeek(date1).isSame(
      UtilityDate.getStartOfWeek(date2),
      "day"
    );
  },

  isSameDay: (date1, date2) => {
    return dayjs(date1).isSame(dayjs(date2), "day");
  },

  addWeeks: (date, weeks) => {
    return dayjs(date).add(weeks, "week");
  },
};

export const EventsUtils = {
  createEvent: (title, type, start, end) => ({
    id: Date.now() + Math.random(),
    title,
    type,
    start,
    end,
  }),

  getEventsFromData: (data) => ({
    id: data.id || Date.now() + Math.random(),
    title: data.title,
    type: data.type,
    start: data.start,
    end: data.end,
  }),

  validateEvent: (event) => {
    if (!event.title || !event.type || !event.start || !event.end) {
      return false;
    }

    const startDate = dayjs(event.start);
    const endDate = dayjs(event.end);

    if (event.type === "ALL DAY EVENT" || event.type === "HOLIDAY") {
      return startDate.isValid() && endDate.isValid();
    }

    return (
      startDate.isValid() && endDate.isValid() && endDate.isAfter(startDate)
    );
  },

  sortEventsByStartTime: (events) => {
    return [...events].sort((a, b) => new Date(a.start) - new Date(b.start));
  },

  getEventsForDate: (events, date) => {
    return events.filter((event) => {
      const eventStart = dayjs(event.start);
      return eventStart.isSame(dayjs(date), "day");
    });
  },
};

export const UtilsStorage = {
  save: (events) => {
    try {
      const serializedEvents = JSON.stringify(events);
      localStorage.setItem(STORAGE_KEY, serializedEvents);
    } catch (error) {
      console.error("Failed to save events to localStorage:", error);
    }
  },

  load: () => {
    try {
      const serializedEvents = localStorage.getItem(STORAGE_KEY);
      if (serializedEvents) {
        return JSON.parse(serializedEvents);
      }
      return null;
    } catch (error) {
      console.error("Failed to load events from localStorage:", error);
      return null;
    }
  },

  clear: () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error("Failed to clear events from localStorage:", error);
    }
  },

  getStorageInfo: () => {
    try {
      const serializedEvents = localStorage.getItem(STORAGE_KEY);
      if (serializedEvents) {
        const events = JSON.parse(serializedEvents);
        return {
          eventCount: events.length,
          storageSize: serializedEvents.length,
          lastModified: new Date().toISOString(),
        };
      }
      return {
        eventCount: 0,
        storageSize: 0,
        lastModified: null,
      };
    } catch (error) {
      console.error("Failed to get storage info:", error);
      return null;
    }
  },
};
