// src/pages/notes/NoteCreatePage.js
import React, { useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import NoteForm from "./NoteForm";

const NoteCreatePage = () => {
  const [noteData, setNoteData] = useState({
    title: "",
    content: "",
    tag_ids: [], 
  });
  const history = useHistory();

  const handleChange = (e) => {
    setNoteData({ ...noteData, [e.target.name]: e.target.value });
  };

  const handleTagIdsChange = (newTagIds) => {
    setNoteData((prevData) => ({
      ...prevData,
      tag_ids: newTagIds,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/notes/", noteData);
      history.push("/notes");
    } catch (err) {
      console.error("Submission Error:", err.response?.data || err);
    }
  };

  return (
    <div>
      <h2>Create Note</h2>
      <NoteForm
        noteData={noteData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        handleTagIdsChange={handleTagIdsChange}
      />
    </div>
  );
};

export default NoteCreatePage;

