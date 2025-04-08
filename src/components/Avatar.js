import React from "react";
import styles from "../styles/Avatar.module.css";

const Avatar = ({ src, text = "User", height = 45 }) => {
  return (
    <span>
      <img
        className={styles.Avatar}
        src={src}
        alt={text}
        height={height}
        style={{ objectFit: "cover" }}
      />
    </span>
  );
};

export default Avatar;