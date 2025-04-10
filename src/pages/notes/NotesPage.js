// src/pages/notes/NotesPage.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { Button, Alert, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";

const NotesPage = () => {
  const [notes, setNotes] = useState([]);
  const [alertMsg, setAlertMsg] = useState(null);
  const [alertVariant, setAlertVariant] = useState("success");
  const [noteToDelete, setNoteToDelete] = useState(null); // 👈 selected note for deletion
  const [showModal, setShowModal] = useState(false); // 👈 modal visibility

  const history = useHistory();

  // Auto-dismiss alert
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
      <h2>My Notes</h2>

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

      <Button variant="success" onClick={() => history.push("/notes/create")}>
        + Add Note
      </Button>

      <hr />
      {notes.map((note) => (
        <div key={note.id}>
          <h4>
            <Link to={`/notes/${note.id}`}>{note.title}</Link>
          </h4>
          <p>{note.content}</p>
          <Button
            variant="primary"
            onClick={() => history.push(`/notes/${note.id}/edit`)}
            className="me-2"
          >
            Edit
          </Button>
          <Button
            variant="danger"
            onClick={() => confirmDelete(note.id)}
          >
            Delete
          </Button>
          <hr />
        </div>
      ))}

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this note? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteConfirmed}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default NotesPage;
