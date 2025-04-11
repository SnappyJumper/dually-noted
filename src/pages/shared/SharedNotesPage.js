// src/pages/shared/SharedNotesPage.js
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { CurrentUserContext } from "../../App";
import cardStyles from "../../styles/StickyCard.module.css"; // 🟡 Sticky note styling
import btnStyles from "../../styles/Button.module.css";     // ✅ Custom button styles

const SharedNotesPage = () => {
  const currentUser = useContext(CurrentUserContext);
  const [sharedNotes, setSharedNotes] = useState([]);

  useEffect(() => {
    const fetchSharedNotes = async () => {
      try {
        const { data } = await axios.get("/shared-notes/");
        const filtered = data.filter(
          (note) => note.user !== currentUser?.username
        );
        setSharedNotes(filtered);
      } catch (err) {
        console.log("Error fetching shared notes:", err);
      }
    };

    if (currentUser) {
      fetchSharedNotes();
    }
  }, [currentUser]);

  return (
    <div>
      <h2 className="mb-4">Shared Notes</h2>

      {sharedNotes.length ? (
        sharedNotes.map((note) => (
          <div key={note.id} className={cardStyles.StickyNote}>
            <h4 className={cardStyles.title}>
              <Link
                to={`/shared/${note.id}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                {note.title}
              </Link>
            </h4>

            <p className={cardStyles.content}>{note.content}</p>

            <p className={cardStyles.meta}>
              <strong>Owner:</strong>{" "}
              <Link to={`/profiles/username/${note.user}`}>
                {note.user}
              </Link>
            </p>

            <div className="mt-3">
              <Link
                to={`/shared/${note.id}`}
                className={`${btnStyles.Button} ${btnStyles.Blue}`}
              >
                View
              </Link>
            </div>
          </div>
        ))
      ) : (
        <p>No notes have been shared with you yet.</p>
      )}
    </div>
  );
};

export default SharedNotesPage;
