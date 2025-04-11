// src/pages/notes/NoteCreatePage.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import NoteForm from "./NoteForm";
import { Alert } from "react-bootstrap";

const NoteCreatePage = () => {
  const [noteData, setNoteData] = useState({ title: "", content: "" });
  const [selectedTags, setSelectedTags] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [permission, setPermission] = useState("read");

  const [alertMsg, setAlertMsg] = useState(null);
  const [alertVariant, setAlertVariant] = useState("success");
  const [errors, setErrors] = useState({});

  const history = useHistory();

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

  useEffect(() => {
    if (alertMsg) {
      const timer = setTimeout(() => setAlertMsg(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [alertMsg]);

  const handleChange = (e) => {
    setNoteData({ ...noteData, [e.target.name]: e.target.value });
    setErrors({}); // clear errors as user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const tag_ids = selectedTags.map((tag) => tag.value);
    const payload = { ...noteData, tag_ids };

    try {
      const { data: createdNote } = await axios.post("/notes/", payload);

      if (selectedUser) {
        await axios.post("/shared-notes/", {
          note: createdNote.id,
          shared_with: selectedUser,
          permission,
        });
      }

      setAlertVariant("success");
      setAlertMsg("Note created successfully!");
      setErrors({});

      setTimeout(() => {
        history.push("/notes");
      }, 1500);
    } catch (err) {
        const errorData = err.response?.data || {};
      
        // Set global alert
        setAlertVariant("danger");
      
        if (errorData.shared_with?.length > 0) {
          setAlertMsg(errorData.shared_with[0]);
        } else if (errorData.note?.length > 0) {
          setAlertMsg(errorData.note[0]);
        } else if (errorData.non_field_errors?.length > 0) {
          setAlertMsg(errorData.non_field_errors[0]);
        } else {
          setAlertMsg("Could not create note. Please check the fields.");
        }
      
        setErrors(errorData);
      }
  };

  return (
    <div>
      <h2>Create Note</h2>
      {alertMsg && (
        <Alert
          className="my-3"
          variant={alertVariant}
          dismissible
          onClose={() => setAlertMsg(null)}
        >
          {alertMsg}
        </Alert>
      )}
      {/* 🔽 Show validation messages */}
      {["title", "content", "non_field_errors"].map((field) =>
        errors[field]?.map((msg, idx) => (
          <Alert key={`${field}-${idx}`} variant="warning">
            {msg}
          </Alert>
        ))
      )}

      <NoteForm
        noteData={noteData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        selectedTags={selectedTags}
        setSelectedTags={setSelectedTags}
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
