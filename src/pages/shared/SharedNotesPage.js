/**
 * SharedNotesPage
 *
 * Displays a list of notes that have been shared *with* the current user.
 * Notes that the user owns themselves are excluded to avoid duplication
 * with the main Notes section.
 */

import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { CurrentUserContext } from "../../App";
import cardStyles from "../../styles/StickyCard.module.css";
import btnStyles from "../../styles/Button.module.css";

const SharedNotesPage = () => {
  const currentUser = useContext(CurrentUserContext);
  const [sharedNotes, setSharedNotes] = useState([]);

  useEffect(() => {
    const fetchSharedNotes = async () => {
      try {
        const { data } = await axios.get("/shared-notes/");

        // Filter out notes created by the current user themselves
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
            {/* Note title as link to detail page */}
            <h4 className={cardStyles.title}>
              <Link
                to={`/shared/${note.id}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                {note.title}
              </Link>
            </h4>

            {/* Note preview content */}
            <p className={cardStyles.content}>{note.content}</p>

            {/* Owner reference with link to profile */}
            <p className={cardStyles.meta}>
              <strong>Owner:</strong>{" "}
              <Link to={`/profiles/username/${note.user}`}>
                {note.user}
              </Link>
            </p>

            {/* Call-to-action button */}
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
