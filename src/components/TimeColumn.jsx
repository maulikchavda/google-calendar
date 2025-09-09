import React from "react";
import { UtilityDate } from "../utils/helper";
import styles from "../styles/TimeColumn.module.css";

const TimeColumn = () => {
  const hours = UtilityDate.getHours();
  return (
    <div className={styles.columnContainer}>
      <div className={styles.columnContainer} />
      <div className={styles.hourCell} />
      <div className={styles.hourCell} />
      {hours.map((hour) => (
        <div key={hour} className={styles.hourCell}>
          {UtilityDate.formatHour(hour)}
        </div>
      ))}
    </div>
  );
};

export default TimeColumn;
