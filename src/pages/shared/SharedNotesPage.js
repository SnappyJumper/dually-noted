// src/pages/shared/SharedNotesPage.js
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { CurrentUserContext } from "../../App";
import { Button } from "react-bootstrap";
import styles from "../../styles/StickyCard.module.css";

const SharedNotesPage = () => {
  const currentUser = useContext(CurrentUserContext);
  const [sharedNotes, setSharedNotes] = useState([]);

  useEffect(() => {
    const fetchSharedNotes = async () => {
      try {
        const { data } = await axios.get("/shared-notes/");
        // 🧠 Filter out shared notes where the user is the note owner
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
      <h2>Shared Notes</h2>
      {sharedNotes.length ? (
        sharedNotes.map((note) => (
          <div key={note.id} className={styles.StickyNote}>
            <h4>
              <Link to={`/shared/${note.id}`}>{note.title}</Link>
            </h4>
            <p>{note.content}</p>
            <p>
              <strong>Owner:</strong>{" "}
              <Link to={`/profiles/username/${note.user}`}>{note.user}</Link>
            </p>
            <Button
              variant="primary"
              size="sm"
              as={Link}
              to={`/shared/${note.id}`}
            >
              View
            </Button>
            <hr />
          </div>
        ))
      ) : (
        <p>No notes have been shared with you yet.</p>
      )}
    </div>
  );
};

export default SharedNotesPage;
