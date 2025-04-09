// src/pages/notes/NoteDetailPage.js
import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import axios from "axios";
import Button from "react-bootstrap/Button";

const NoteDetailPage = () => {
  const { id } = useParams();
  const [note, setNote] = useState(null);
  const history = useHistory();

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

  const handleEdit = () => {
    history.push(`/notes/${id}/edit`);
  };

  if (!note) return <p>Loading note...</p>;

  return (
    <div>
      <h2>{note.title}</h2>
      <p>{note.content}</p>

      {note.tags.length > 0 && (
        <p>
          <strong>Tags:</strong>{" "}
          {note.tags.map((tag) => tag.name).join(", ")}
        </p>
      )}

      <p>
        <strong>Created:</strong> {note.created_at}
      </p>
      <p>
        <strong>Last Updated:</strong> {note.updated_at}
      </p>

      {note.is_owner && (
        <Button variant="primary" onClick={handleEdit}>
          Edit Note
        </Button>
      )}
    </div>
  );
};

export default NoteDetailPage;
