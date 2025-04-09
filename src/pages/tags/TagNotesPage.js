// src/pages/tags/TagNotesPage.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";

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

  return (
    <div>
      <h2>Notes tagged with #{tag.name}</h2>
      {notes.length > 0 ? (
        notes.map((note) => (
          <div key={note.id}>
            <h4><Link to={`/notes/${note.id}`}>{note.title}</Link></h4>
            <p>{note.content}</p>
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
