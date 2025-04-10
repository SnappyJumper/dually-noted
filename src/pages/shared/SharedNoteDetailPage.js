// src/pages/shared/SharedNoteDetailPage.js
import React, { useEffect, useState } from "react";
import { useParams, useHistory, Link } from "react-router-dom";
import axios from "axios";
import { Button, Form } from "react-bootstrap";

const SharedNoteDetailPage = () => {
  const { id } = useParams(); // ID of the SharedNote
  const history = useHistory();
  const [note, setNote] = useState(null);
  const [canEdit, setCanEdit] = useState(false);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ title: "", content: "" });

  useEffect(() => {
    const fetchSharedNote = async () => {
      try {
        const { data } = await axios.get(`/shared-notes/${id}/`);
        setNote(data);
        setCanEdit(data.permission === "edit");
        setFormData({ title: data.title, content: data.content });
      } catch (err) {
        console.error(err);
      }
    };

    fetchSharedNote();
  }, [id]);

  const handleRemoveSelf = async () => {
    try {
      await axios.delete(`/shared-notes/${id}/`);
      history.push("/shared");
    } catch (err) {
      console.error("Failed to remove shared note", err);
    }
  };

  const handleEditToggle = () => {
    setEditing(true);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/shared-notes/${id}/`, formData);
      history.push("/shared");
    } catch (err) {
      console.error("Failed to update shared note", err);
    }
  };

  if (!note) return <p>Loading note...</p>;

  return (
    <div>
      <h2>Shared Note</h2>

      {editing ? (
        <Form onSubmit={handleUpdate}>
          <Form.Group controlId="title">
            <Form.Label>Title</Form.Label>
            <Form.Control
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="content">
            <Form.Label>Content</Form.Label>
            <Form.Control
              as="textarea"
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows={6}
              required
            />
          </Form.Group>

          <Button type="submit" variant="primary" className="mt-3">
            Save Changes
          </Button>
        </Form>
      ) : (
        <>
          <h4>{note?.title || "Untitled Note"}</h4>
          <p>{note?.content || "No content available."}</p>
          <p>
            <strong>Owner:</strong>{" "}
            {note?.user ? (
              <Link to={`/profiles/username/${note.user}`}>{note.user}</Link>
            ) : (
              "Unknown"
            )}
          </p>
        </>
      )}

      <div className="mt-4 d-flex gap-2">
        {canEdit && !editing && (
          <Button variant="warning" onClick={handleEditToggle}>
            Edit
          </Button>
        )}
        <Button variant="outline-danger" onClick={handleRemoveSelf}>
          Remove Me From This Note
        </Button>
        <Button variant="secondary" onClick={() => history.push("/shared")}>
          Back to Shared Notes
        </Button>
      </div>
    </div>
  );
};

export default SharedNoteDetailPage;
