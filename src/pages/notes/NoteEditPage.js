// src/pages/notes/NoteEditPage.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useHistory } from "react-router-dom";
import NoteForm from "./NoteForm";
import TagSelector from "../../components/TagSelector";

const NoteEditPage = () => {
  const [noteData, setNoteData] = useState({ title: "", content: "" });
  const [selectedTags, setSelectedTags] = useState([]);
  const { id } = useParams();
  const history = useHistory();

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const { data } = await axios.get(`/notes/${id}/`);
        setNoteData({ title: data.title, content: data.content });

        const formattedTags = data.tags.map((tag) => ({
          value: tag.id,
          label: tag.name,
        }));
        setSelectedTags(formattedTags);
      } catch (err) {
        console.log(err);
      }
    };

    fetchNote();
  }, [id]);

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

    console.log("Form is submitting!", payload);

    try {
      await axios.put(`/notes/${id}/`, payload);
      history.push("/notes");
    } catch (err) {
      console.log("Submission error:", err);
    }
  };

  return (
    <div>
      <h2>Edit Note</h2>
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

export default NoteEditPage;
