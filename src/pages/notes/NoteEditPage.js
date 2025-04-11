// src/pages/notes/NoteEditPage.js

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useHistory } from "react-router-dom";
import NoteForm from "./NoteForm";
import { Alert } from "react-bootstrap";
import cardStyles from "../../styles/StickyCard.module.css";

/**
 * NoteEditPage allows users to edit an existing note.
 * Fetches the note's current content and tags, allows editing,
 * and optionally re-shares the note with another user.
 */
const NoteEditPage = () => {
  const [noteData, setNoteData] = useState({ title: "", content: "" });
  const [selectedTags, setSelectedTags] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [permission, setPermission] = useState("read");

  const [alertMsg, setAlertMsg] = useState(null);
  const [alertVariant, setAlertVariant] = useState("success");
  const [errors, setErrors] = useState({});

  const { id } = useParams(); // Get note ID from URL
  const history = useHistory();

  // Automatically clear alert messages after 4 seconds
  useEffect(() => {
    if (alertMsg) {
      const timer = setTimeout(() => setAlertMsg(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [alertMsg]);

  // Fetch the note and list of users on mount
  useEffect(() => {
    const fetchNote = async () => {
      try {
        const { data } = await axios.get(`/notes/${id}/`);
        setNoteData({ title: data.title, content: data.content });

        // Convert note tags to format expected by TagSelector
        const formattedTags = data.tags.map(tag => ({
          value: tag.id,
          label: tag.name,
        }));
        setSelectedTags(formattedTags);
      } catch (err) {
        console.log(err);
        setAlertVariant("danger");
        setAlertMsg("Could not load the note. Please try again.");
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

  // Update note state when form fields change
  const handleChange = (e) => {
    setNoteData({ ...noteData, [e.target.name]: e.target.value });
    setErrors({});
  };

  // Submit edited note and optionally share it
  const handleSubmit = async (e) => {
    e.preventDefault();
    const tag_ids = selectedTags.map(tag => tag.value);
    const payload = { ...noteData, tag_ids };

    try {
      await axios.put(`/notes/${id}/`, payload);

      // If sharing with a new user, send share request
      if (selectedUser) {
        await axios.post("/shared-notes/", {
          note: id,
          shared_with: selectedUser,
          permission,
        });
      }

      setAlertVariant("success");
      setAlertMsg("Note updated successfully!");
      setErrors({});

      setTimeout(() => {
        history.push("/notes");
      }, 1500);
    } catch (err) {
      console.log("Edit submission error:", err);
      setAlertVariant("danger");
      setAlertMsg("Could not update the note. Please check the fields.");
      setErrors(err.response?.data || {});
    }
  };

  return (
    <div className={cardStyles.StickyNoteStatic}>
      <h2 className={`${cardStyles.title} mb-4`}>Edit Note</h2>

      {/* Alert message */}
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

      {/* Display form field errors */}
      {["title", "content", "non_field_errors"].map((field) =>
        errors[field]?.map((msg, idx) => (
          <Alert key={`${field}-${idx}`} variant="warning">
            {msg}
          </Alert>
        ))
      )}

      {/* Render reusable note form */}
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

export default NoteEditPage;
