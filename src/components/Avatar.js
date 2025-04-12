import React, { useRef } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

import styles from "../styles/Avatar.module.css";

/**
 * Avatar component for displaying a user's profile picture.
 * Optionally allows uploading a new image if `canUpload` is true.
 *
 * Props:
 * - src: string (image URL)
 * - text: string (alt text fallback)
 * - height: number (image height in px)
 * - canUpload: boolean (enables file input if true)
 * - onChange: function (called when a new file is selected)
 */
const Avatar = ({
  src,
  text = "User",
  height = 45,
  canUpload = false,
  onChange = null,
}) => {
  const fileInputRef = useRef(null);

  // Trigger file input click if upload is enabled
  const handleClick = () => {
    if (canUpload && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div
      className={styles.Wrapper}
      onClick={handleClick}
      style={{ cursor: canUpload ? "pointer" : "default" }}
    >
      <img
        className={styles.Avatar}
        src={src}
        alt={text}
        height={height}
        style={{ objectFit: "cover" }}
      />

      {/* Upload icon and hidden file input only shown when canUpload is true */}
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
