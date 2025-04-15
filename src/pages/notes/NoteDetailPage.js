/**
 * NoteDetailPage displays a single note's details including content and tags.
 * If the current user is the note's owner, Edit and Delete options are available.
 */

import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import axios from "axios";
import { Modal, Alert } from "react-bootstrap";

import styles from "../../styles/StickyCard.module.css";
import btnStyles from "../../styles/Button.module.css";

const NoteDetailPage = () => {
  const { id } = useParams(); // Get the note ID from the URL
  const history = useHistory();
  const [note, setNote] = useState(null);

  // Modal and alert state
  const [showModal, setShowModal] = useState(false); // Controls delete confirmation modal
  const [alertMsg, setAlertMsg] = useState(null);    // Holds success or error messages
  const [alertVariant, setAlertVariant] = useState("success"); // Alert style (success/danger)

  // Fetch the note from the API on component mount
  useEffect(() => {
    const fetchNote = async () => {
      try {
        const { data } = await axios.get(`/notes/${id}/`);
        setNote(data);
      } catch (err) {
        // console.log(err);
      }
    };

    fetchNote();
  }, [id]);

  // Automatically dismiss alerts after 4 seconds
  useEffect(() => {
    if (alertMsg) {
      const timer = setTimeout(() => setAlertMsg(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [alertMsg]);

  // Redirect to edit page
  const handleEdit = () => history.push(`/notes/${id}/edit`);

  /**
   * Called when user confirms deletion in modal
   * Sends delete request, shows feedback, and redirects
   */
  const handleDeleteConfirmed = async () => {
    try {
      await axios.delete(`/notes/${id}/`);
      setAlertVariant("success");
      setAlertMsg("Note deleted successfully.");

      // Redirect to notes list after short delay
      setTimeout(() => {
        history.push("/notes");
      }, 1500);
    } catch (err) {
      console.error("Failed to delete note:", err);
      setAlertVariant("danger");
      setAlertMsg("Failed to delete the note.");
    } finally {
      setShowModal(false); // Close modal regardless of outcome
    }
  };

  if (!note) return <p>Loading note...</p>;

  return (
    <>
      {/* Section Heading */}
      <h2 className="mb-3">Note</h2>

      <div className={styles.StickyNoteStatic}>
        {/* Show success or error alert */}
        {alertMsg && (
          <Alert
            variant={alertVariant}
            dismissible
            onClose={() => setAlertMsg(null)}
            className="my-3"
          >
            {alertMsg}
          </Alert>
        )}

        {/* Note title and content */}
        <h2 className={styles.title}>{note.title}</h2>
        <p className={styles.content}>{note.content}</p>

        {/* Display tags if available */}
        {note.tags?.length > 0 && (
          <div className="mb-3">
            <strong>Tags:</strong>{" "}
            {note.tags.map((tag) => (
              <span key={tag.id} className="badge bg-secondary me-2">
                {tag.name}
              </span>
            ))}
          </div>
        )}

        {/* Owner-only actions */}
        {note.is_owner && (
          <div className="d-flex gap-2 mt-3">
            <button
              className={`${btnStyles.Button} ${btnStyles.Blue}`}
              onClick={handleEdit}
              aria-label="Edit this note"
            >
              Edit
            </button>
            <button
              className={`${btnStyles.Button} ${btnStyles.Danger}`}
              onClick={() => setShowModal(true)} // Open delete modal
              aria-label="Delete this note"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Delete Note</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this note? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <button
            className={`${btnStyles.Button} ${btnStyles.BlackOutline}`}
            onClick={() => setShowModal(false)}
            aria-label="Cancel deletion"
          >
            Cancel
          </button>
          <button
            className={`${btnStyles.Button} ${btnStyles.Danger}`}
            onClick={handleDeleteConfirmed}
            aria-label="Confirm note deletion"
          >
            Delete
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default NoteDetailPage;
