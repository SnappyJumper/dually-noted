// src/pages/notes/NoteCreatePage.js
import React, { useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import NoteForm from "./NoteForm";
import TagSelector from "../../components/TagSelector";

const NoteCreatePage = () => {
  const [noteData, setNoteData] = useState({
    title: "",
    content: "",
  });
  const [selectedTags, setSelectedTags] = useState([]);
  const history = useHistory();

  const handleChange = (e) => {
    setNoteData({
      ...noteData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const tag_ids = selectedTags.map((tag) => tag.value);
    const payload = {
      ...noteData,
      tag_ids,
    };

    try {
      await axios.post("/notes/", payload);
      history.push("/notes");
    } catch (err) {
      console.log("Submission error:", err);
    }
  };

  return (
    <div>
      <h2>Create Note</h2>
      <NoteForm
        noteData={noteData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        selectedTags={selectedTags}
        setSelectedTags={setSelectedTags}
      />
    </div>
  );
};

export default NoteCreatePage;
