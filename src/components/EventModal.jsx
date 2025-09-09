import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import { EVENT_TYPES } from "../utils/constants";
import styles from "../styles/EventModal.module.css";

const EventModal = ({
  isOpen,
  onClose,
  onSave,
  event = null,
  selectedDate = null,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    type: "TASK",
    start: "",
    end: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      if (event) {
        setFormData({
          title: event.title || "",
          type: event.type || "TASK",
          start: event.start
            ? dayjs(event.start).format("YYYY-MM-DDTHH:mm")
            : "",
          end: event.end ? dayjs(event.end).format("YYYY-MM-DDTHH:mm") : "",
        });
      } else if (selectedDate) {
        const startTime = dayjs(selectedDate).format("YYYY-MM-DDTHH:mm");
        const endTime = dayjs(selectedDate)
          .add(1, "hour")
          .format("YYYY-MM-DDTHH:mm");
        setFormData({
          title: "",
          type: "TASK",
          start: startTime,
          end: endTime,
        });
      }
      setErrors({});
    }
  }, [isOpen, event, selectedDate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const newData = {
        ...prev,
        [name]: value,
      };

      if (
        name === "type" &&
        (value === "ALL DAY EVENT" || value === "HOLIDAY")
      ) {
        if (prev.start) {
          const startDate = dayjs(prev.start).startOf("day");
          newData.start = startDate.format("YYYY-MM-DDTHH:mm");
          newData.end = startDate.endOf("day").format("YYYY-MM-DDTHH:mm");
        }
      }

      if (name === "start" && value && prev.end) {
        const startDate = dayjs(value);
        const endDate = dayjs(prev.end);

        if (endDate.isBefore(startDate) || endDate.isSame(startDate)) {
          if (prev.type === "ALL DAY EVENT" || prev.type === "HOLIDAY") {
            newData.end = startDate.endOf("day").format("YYYY-MM-DDTHH:mm");
          } else {
            newData.end = startDate.add(1, "hour").format("YYYY-MM-DDTHH:mm");
          }
        }
      }

      return newData;
    });

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Event name is required";
    }

    if (!formData.start) {
      newErrors.start = "Start date time is required";
    }

    if (!formData.end) {
      newErrors.end = "End date time is required";
    }

    if (formData.start && formData.end) {
      const startDate = dayjs(formData.start);
      const endDate = dayjs(formData.end);

      if (formData.type !== "ALL DAY EVENT" && formData.type !== "HOLIDAY") {
        if (endDate.isBefore(startDate)) {
          newErrors.end = "End date must be after start date";
        } else if (endDate.isSame(startDate)) {
          newErrors.end = "End time must be after start time";
        }
      }

      if (startDate.day() === 0) {
        newErrors.start = "Events cannot be created on Sunday";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const eventData = {
      title: formData.title.trim(),
      type: formData.type,
      start: dayjs(formData.start).valueOf(),
      end: dayjs(formData.end).valueOf(),
    };

    onSave(eventData);
    onClose();
  };

  const handleCancel = () => {
    setFormData({
      title: "",
      type: "TASK",
      start: "",
      end: "",
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            {event ? "Edit Event" : "Create New Event"}
          </h2>
          <button
            className={styles.closeButton}
            onClick={handleCancel}
            type="button"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.fieldGroup}>
            <label htmlFor="title" className={styles.label}>
              Event Name
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className={`${styles.input} ${errors.title ? styles.inputError : ""}`}
              placeholder="Enter event name"
            />
            {errors.title && (
              <span className={styles.errorText}>{errors.title}</span>
            )}
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="type" className={styles.label}>
              Event Type
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              className={styles.select}
            >
              {EVENT_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="start" className={styles.label}>
              Start Date Time
            </label>
            <input
              type="datetime-local"
              id="start"
              name="start"
              value={formData.start}
              onChange={handleInputChange}
              className={`${styles.input} ${errors.start ? styles.inputError : ""}`}
            />
            {errors.start && (
              <span className={styles.errorText}>{errors.start}</span>
            )}
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="end" className={styles.label}>
              End Date Time
            </label>
            <input
              type="datetime-local"
              id="end"
              name="end"
              value={formData.end}
              onChange={handleInputChange}
              min={formData.start || undefined}
              className={`${styles.input} ${errors.end ? styles.inputError : ""}`}
            />
            {errors.end && (
              <span className={styles.errorText}>{errors.end}</span>
            )}
          </div>

          <div className={styles.buttonGroup}>
            <button
              type="button"
              onClick={handleCancel}
              className={styles.cancelButton}
            >
              Cancel
            </button>
            <button type="submit" className={styles.saveButton}>
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventModal;
