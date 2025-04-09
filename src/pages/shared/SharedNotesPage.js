// src/pages/shared/SharedNotesPage.js
import React, { useEffect, useState } from "react";
import axios from "axios";

const SharedNotesPage = () => {
  const [sharedNotes, setSharedNotes] = useState([]);

  useEffect(() => {
    const fetchSharedNotes = async () => {
      try {
        const { data } = await axios.get("/shared-notes/");
        setSharedNotes(data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchSharedNotes();
  }, []);

  return (
    <div>
      <h2>Shared With Me</h2>
      {sharedNotes.length ? (
        sharedNotes.map((item) => (
          <div key={item.id}>
            <h4>{item.note.title}</h4>
            <p>{item.note.content}</p>
            <p><strong>From:</strong> {item.note.user}</p>
            <hr />
          </div>
        ))
      ) : (
        <p>No shared notes yet.</p>
      )}
    </div>
  );
};

export default SharedNotesPage;
