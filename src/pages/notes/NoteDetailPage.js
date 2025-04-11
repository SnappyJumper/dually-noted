import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import axios from "axios";
import styles from "../../styles/StickyCard.module.css";
import btnStyles from "../../styles/Button.module.css";

const NoteDetailPage = () => {
  const { id } = useParams();
  const history = useHistory();
  const [note, setNote] = useState(null);

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

  const handleEdit = () => history.push(`/notes/${id}/edit`);
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
    <div className={styles.StickyNoteStatic}>
      <h2 className={styles.title}>{note.title}</h2>
      <p className={styles.content}>{note.content}</p>

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

      <div className="d-flex gap-2 mt-3">
        {note.is_owner && (
          <>
            <button className={`${btnStyles.Button} ${btnStyles.Blue}`} onClick={handleEdit}>
              Edit
            </button>
            <button className={`${btnStyles.Button} ${btnStyles.Danger}`} onClick={handleDelete}>
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default NoteDetailPage;
