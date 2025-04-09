// src/pages/tags/TagNotesPage.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { Button } from "react-bootstrap";

const TagNotesPage = () => {
  const { id } = useParams();
  const [tag, setTag] = useState({});
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const fetchNotesByTag = async () => {
      try {
        const { data: tagData } = await axios.get(`/tags/${id}/`);
        setTag(tagData);

        const { data: notesData } = await axios.get("/notes/");
        const filtered = notesData.filter(note =>
          note.tags.some(tag => tag.id === parseInt(id))
        );
        setNotes(filtered);
      } catch (err) {
        console.log(err);
      }
    };

    fetchNotesByTag();
  }, [id]);

  const handleRemoveTag = async (noteId) => {
    const note = notes.find(n => n.id === noteId);
    const updatedTagIds = note.tags
      .filter(tag => tag.id !== parseInt(id))
      .map(tag => tag.id);

    try {
      await axios.put(`/notes/${noteId}/`, {
        title: note.title,
        content: note.content,
        tag_ids: updatedTagIds,
      });

      // Remove the note from the list locally
      setNotes(prevNotes => prevNotes.filter(n => n.id !== noteId));
    } catch (err) {
      console.error("Failed to remove tag from note:", err);
    }
  };

  return (
    <div>
      <h2>Notes tagged with #{tag.name}</h2>
      {notes.length > 0 ? (
        notes.map((note) => (
          <div key={note.id}>
            <h4><Link to={`/notes/${note.id}`}>{note.title}</Link></h4>
            <p>{note.content}</p>
            <Button
              variant="danger"
              size="sm"
              onClick={() => handleRemoveTag(note.id)}
            >
              Remove from Tag
            </Button>
            <hr />
          </div>
        ))
      ) : (
        <p>No notes found for this tag.</p>
      )}
    </div>
  );
};

export default TagNotesPage;
