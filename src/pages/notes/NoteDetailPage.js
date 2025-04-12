// src/pages/notes/NoteDetailPage.js

/**
 * NoteDetailPage displays a single note's details including content and tags.
 * If the current user is the note's owner, Edit and Delete options are available.
 */

import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import axios from "axios";

import styles from "../../styles/StickyCard.module.css";
import btnStyles from "../../styles/Button.module.css";

const NoteDetailPage = () => {
  const { id } = useParams(); // Get the note ID from the URL
  const history = useHistory();
  const [note, setNote] = useState(null);

  // Fetch the note from the API on component mount
  useEffect(() => {
    const fetchNote = async () => {
      try {
        const { data } = await axios.get(`/notes/${id}/`);
        setNote(data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchNote();
  }, [id]);

  // Redirect to edit page
  const handleEdit = () => history.push(`/notes/${id}/edit`);

  // Handle note deletion with confirmation
  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      try {
        await axios.delete(`/notes/${id}/`);
        history.push("/notes");
      } catch (err) {
        console.log("Failed to delete note:", err);
      }
    }
  };

  if (!note) return <p>Loading note...</p>;

  return (
    <>
      {/* Section Heading */}
      <h2 className="mb-3">Note</h2>

      <div className={styles.StickyNoteStatic}>
        <h2 className={styles.title}>{note.title}</h2>
        <p className={styles.content}>{note.content}</p>

        {/* Display tags if available */}
        {note.tags?.length > 0 && (
          <div className="mb-3">
            <strong>Tags:</strong>{" "}
            {note.tags.map((tag) => (
              <span key={tag.id} className="badge bg-secondary me-2">
                {tag.name}
              </span>
            ))}
          </div>
        )}

        {/* Owner-only actions */}
        <div className="d-flex gap-2 mt-3">
          {note.is_owner && (
            <>
              <button
                className={`${btnStyles.Button} ${btnStyles.Blue}`}
                onClick={handleEdit}
                aria-label="Edit this note"
              >
                Edit
              </button>
              <button
                className={`${btnStyles.Button} ${btnStyles.Danger}`}
                onClick={handleDelete}
                aria-label="Delete this note"
              >
                Delete
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default NoteDetailPage;
