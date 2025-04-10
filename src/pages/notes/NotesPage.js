// src/pages/notes/NotesPage.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { Alert, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import cardStyles from "../../styles/StickyCard.module.css"; // 🟡 Sticky note styles
import btnStyles from "../../styles/Button.module.css";     // ✅ New button styles

const NotesPage = () => {
  const [notes, setNotes] = useState([]);
  const [alertMsg, setAlertMsg] = useState(null);
  const [alertVariant, setAlertVariant] = useState("success");
  const [noteToDelete, setNoteToDelete] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const history = useHistory();

  useEffect(() => {
    if (alertMsg) {
      const timer = setTimeout(() => setAlertMsg(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [alertMsg]);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const { data } = await axios.get("/notes/");
        setNotes(data);
      } catch (err) {
        console.log(err);
        setAlertVariant("danger");
        setAlertMsg("Failed to load notes.");
      }
    };
    fetchNotes();
  }, []);

  const confirmDelete = (noteId) => {
    setNoteToDelete(noteId);
    setShowModal(true);
  };

  const handleDeleteConfirmed = async () => {
    try {
      await axios.delete(`/notes/${noteToDelete}/`);
      setNotes((prev) => prev.filter((note) => note.id !== noteToDelete));
      setAlertVariant("success");
      setAlertMsg("Note deleted successfully.");
    } catch (err) {
      console.log(err);
      setAlertVariant("danger");
      setAlertMsg("Failed to delete the note.");
    } finally {
      setShowModal(false);
      setNoteToDelete(null);
    }
  };

  return (
    <div>
      <h2 className="mb-3">My Notes</h2>

      {alertMsg && (
        <Alert
          className="my-3"
          variant={alertVariant}
          dismissible
          onClose={() => setAlertMsg(null)}
        >
          {alertMsg}
        </Alert>
      )}

      <button
        className={`${btnStyles.Button} ${btnStyles.Blue}`}
        onClick={() => history.push("/notes/create")}
      >
        + Add Note
      </button>

      <div className="d-flex flex-column gap-4 mt-4">
        {notes.map((note) => (
          <div key={note.id} className={cardStyles.StickyNote}>
            <div className={cardStyles.title}>
              <Link to={`/notes/${note.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                {note.title}
              </Link>
            </div>
            <div className={cardStyles.content}>{note.content}</div>
            <div className={cardStyles.meta}>
              Created: {new Date(note.created_at).toLocaleDateString()}
            </div>

            <div className="mt-4 d-flex flex-wrap gap-3">
              <button
                className={`${btnStyles.Button} ${btnStyles.BlueOutline}`}
                onClick={() => history.push(`/notes/${note.id}/edit`)}
              >
                Edit
              </button>
              <button
                className={`${btnStyles.Button} ${btnStyles.Danger}`}
                onClick={() => confirmDelete(note.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this note? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <button
            className={`${btnStyles.Button} ${btnStyles.BlackOutline}`}
            onClick={() => setShowModal(false)}
          >
            Cancel
          </button>
          <button
            className={`${btnStyles.Button} ${btnStyles.Danger}`}
            onClick={handleDeleteConfirmed}
          >
            Delete
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default NotesPage;
