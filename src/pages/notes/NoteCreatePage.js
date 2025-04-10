// src/pages/notes/NoteCreatePage.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import NoteForm from "./NoteForm";

const NoteCreatePage = () => {
  const [noteData, setNoteData] = useState({ title: "", content: "" });
  const [selectedTags, setSelectedTags] = useState([]);
  const [users, setUsers] = useState([]);
  // New sharing state:
  const [selectedUser, setSelectedUser] = useState(null);
  const [permission, setPermission] = useState("read");

  const history = useHistory();

  // Fetch list of users to share with
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await axios.get("/profiles/");
        setUsers(data);
      } catch (err) {
        console.log("User fetch error", err);
      }
    };
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setNoteData({ ...noteData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const tag_ids = selectedTags.map((tag) => tag.value);
    const payload = { ...noteData, tag_ids };

    try {
      const { data: createdNote } = await axios.post("/notes/", payload);
      
      // If a user is selected for sharing, create the shared note record
      if (selectedUser) {
        await axios.post("/shared-notes/", {
          note: createdNote.id,
          shared_with: selectedUser,
          permission,
        });
      }
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

export default NoteCreatePage;
