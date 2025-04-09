// src/pages/notes/NotesPage.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";

const NotesPage = () => {
  const [notes, setNotes] = useState([]);
  const history = useHistory();

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const { data } = await axios.get("/notes/");
        setNotes(data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchNotes();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;
    try {
      await axios.delete(`/notes/${id}/`);
      setNotes((prev) => prev.filter((note) => note.id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <h2>My Notes</h2>
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
