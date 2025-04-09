// src/pages/notes/NotesPage.js
import React, { useEffect, useState } from "react";
import axios from "axios";

const NotesPage = () => {
  const [notes, setNotes] = useState([]);

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

  return (
    <div>
      <h2>My Notes</h2>
      {notes.length ? (
        notes.map((note) => (
          <div key={note.id}>
            <h4>{note.title}</h4>
            <p>{note.content}</p>
            <small>Tags: {note.tags.map(tag => tag.name).join(", ")}</small>
            <hr />
          </div>
        ))
      ) : (
        <p>You have no notes yet.</p>
      )}
    </div>
  );
};

export default NotesPage;
