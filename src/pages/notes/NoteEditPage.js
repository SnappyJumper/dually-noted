// src/pages/notes/NoteEditPage.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useHistory } from "react-router-dom";
import NoteForm from "./NoteForm";

const NoteEditPage = () => {
  const [noteData, setNoteData] = useState({
    title: "",
    content: "",
    tag_ids: [],
  });

  const { id } = useParams();
  const history = useHistory();

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const { data } = await axios.get(`/notes/${id}/`);
        setNoteData({
          title: data.title,
          content: data.content,
          tag_ids: data.tags.map((tag) => tag.id),
        });
      } catch (err) {
        console.log(err);
      }
    };
    fetchNote();
  }, [id]);

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
      await axios.put(`/notes/${id}/`, noteData);
      history.push("/notes");
    } catch (err) {
      console.log("Submission Error:", err.response?.data || err);
    }
  };

  return (
    <div>
      <h2>Edit Note</h2>
      <NoteForm
        noteData={noteData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        handleTagIdsChange={handleTagIdsChange}
      />
    </div>
  );
};

export default NoteEditPage;
