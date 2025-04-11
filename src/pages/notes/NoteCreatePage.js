// src/pages/notes/NoteCreatePage.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import NoteForm from "./NoteForm";
import { Alert } from "react-bootstrap";
import cardStyles from "../../styles/StickyCard.module.css";

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
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const tag_ids = selectedTags.map((tag) => tag.value);
    const payload = { ...noteData, tag_ids };

    try {
      const { data: createdNote } = await axios.post("/notes/", payload);

      if (selectedUser) {
        try {
          await axios.post("/shared-notes/", {
            note: createdNote.id,
            shared_with: selectedUser,
            permission,
          });
        } catch (shareErr) {
          console.warn("Sharing failed:", shareErr);
          setAlertVariant("warning");
          setAlertMsg("Note created, but sharing failed.");
        }
      }

      setAlertVariant("success");
      setAlertMsg("Note created successfully!");
      setTimeout(() => {
        history.push("/notes");
      }, 1500);
    } catch (err) {
      setAlertVariant("danger");
      setAlertMsg("Could not create note. Please check the fields.");
      setErrors(err.response?.data || {});
    }
  };

  return (
    <div className={cardStyles.StickyNoteStatic}>
      <h2 className={`${cardStyles.title} mb-4`}>Create Note</h2>

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
