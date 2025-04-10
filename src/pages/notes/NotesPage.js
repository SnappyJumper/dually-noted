// src/pages/notes/NotesPage.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import { Alert } from "react-bootstrap"; // ✅ Import Alert

const NotesPage = () => {
  const [notes, setNotes] = useState([]);
  const [alertMsg, setAlertMsg] = useState(null);
  const [alertVariant, setAlertVariant] = useState("success");
  const history = useHistory();

  // ✅ Auto-dismiss alert
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

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this note?");
    if (!confirmed) return;

    try {
      await axios.delete(`/notes/${id}/`);
      setNotes((prev) => prev.filter((note) => note.id !== id));
      setAlertVariant("success");
      setAlertMsg("Note deleted successfully.");
    } catch (err) {
      console.log(err);
      setAlertVariant("danger");
      setAlertMsg("Failed to delete the note.");
    }
  };

  return (
    <div>
      <h2>My Notes</h2>

      {/* ✅ Feedback Alert */}
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
            className="mr-2"
          >
            Edit
          </Button>
          <Button variant="danger" onClick={() => handleDelete(note.id)}>
            Delete
          </Button>
          <hr />
        </div>
      ))}
    </div>
  );
};

export default NotesPage;
