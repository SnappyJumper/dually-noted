// src/components/Avatar.js
import React, { useRef } from "react";
import styles from "../styles/Avatar.module.css";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

const Avatar = ({
  src,
  text = "User",
  height = 45,
  canUpload = false,
  onChange = null,
}) => {
  const fileInputRef = useRef(null);

  const handleClick = () => {
    if (canUpload && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className={styles.Wrapper} onClick={handleClick} style={{ cursor: canUpload ? "pointer" : "default" }}>
      <img
        className={styles.Avatar}
        src={src}
        alt={text}
        height={height}
        style={{ objectFit: "cover" }}
      />
      {canUpload && (
        <>
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip>Click to change</Tooltip>}
          >
            <span className={styles.EditIcon}>
              <i className="fas fa-camera"></i>
            </span>
          </OverlayTrigger>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="d-none"
            onChange={onChange}
          />
        </>
      )}
    </div>
  );
};

export default Avatar;
