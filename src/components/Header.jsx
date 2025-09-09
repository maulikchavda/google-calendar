import React from "react";
import { UtilityDate } from "../utils/helper";
import styles from "../styles/Header.module.css";

const Header = ({ currentWeek, onPrevious, onNext, onToday }) => {
  const week = UtilityDate.getStartOfWeek(currentWeek);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{UtilityDate.formatMonth(week)}</h1>
      <div className={{ display: "flex", alignItems: "center" }}>
        <button className={styles.button} onClick={onPrevious}>
          ‹
        </button>
        <button className={styles.button} onClick={onToday}>
          Today
        </button>
        <button className={styles.button} onClick={onNext}>
          ›
        </button>
      </div>
    </div>
  );
};

export default Header;
