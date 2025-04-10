// src/pages/shared/SharedNotesPage.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

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
            <h4>
              <Link to={`/shared/${item.id}`}>{item.title}</Link>
            </h4>
            <p>{item.content}</p>
            <p>
              <strong>From:</strong> {item.user}
            </p>

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
