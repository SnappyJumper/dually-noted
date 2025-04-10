// src/pages/notes/NoteEditPage.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useHistory } from "react-router-dom";
import NoteForm from "./NoteForm";

const NoteEditPage = () => {
  const [noteData, setNoteData] = useState({ title: "", content: "" });
  const [selectedTags, setSelectedTags] = useState([]);
  const [users, setUsers] = useState([]);
  // New sharing state:
  const [selectedUser, setSelectedUser] = useState(null);
  const [permission, setPermission] = useState("read");

  const { id } = useParams();
  const history = useHistory();

  // Fetch the note and its tags
  useEffect(() => {
    const fetchNote = async () => {
      try {
        const { data } = await axios.get(`/notes/${id}/`);
        setNoteData({ title: data.title, content: data.content });
        const formattedTags = data.tags.map(tag => ({
          value: tag.id,
          label: tag.name,
        }));
        setSelectedTags(formattedTags);
      } catch (err) {
        console.log(err);
      }
    };

    const fetchUsers = async () => {
      try {
        const { data } = await axios.get("/profiles/");
        setUsers(data);
      } catch (err) {
        console.log("User fetch error", err);
      }
    };

    fetchNote();
    fetchUsers();
  }, [id]);

  const handleChange = (e) => {
    setNoteData({ ...noteData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const tag_ids = selectedTags.map(tag => tag.value);
    const payload = { ...noteData, tag_ids };

    try {
      await axios.put(`/notes/${id}/`, payload);
      if (selectedUser) {
        await axios.post("/shared-notes/", {
          note: id,
          shared_with: selectedUser,
          permission,
        });
      }
      history.push("/notes");
    } catch (err) {
      console.log("Edit submission error:", err);
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
        // Pass share-related props:
        users={users}
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
        permission={permission}
        setPermission={setPermission}
      />
    </div>
  );
};

export default NoteEditPage;
