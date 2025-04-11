// src/pages/shared/SharedNoteDetailPage.js
import React, { useEffect, useState } from "react";
import { useParams, useHistory, Link } from "react-router-dom";
import axios from "axios";
import { Button, Form, Alert, Modal } from "react-bootstrap";

const SharedNoteDetailPage = () => {
  const { id } = useParams();
  const history = useHistory();
  const [note, setNote] = useState(null);
  const [canEdit, setCanEdit] = useState(false);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ title: "", content: "" });

  const [alertMsg, setAlertMsg] = useState(null);
  const [alertVariant, setAlertVariant] = useState("success");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchSharedNote = async () => {
      try {
        const { data } = await axios.get(`/shared-notes/${id}/`);
        setNote(data);
        setCanEdit(data.permission === "edit");
        setFormData({ title: data.title, content: data.content });
      } catch (err) {
        console.error(err);
        setAlertVariant("danger");
        setAlertMsg("Failed to load shared note.");
      }
    };

    fetchSharedNote();
  }, [id]);

  useEffect(() => {
    if (alertMsg) {
      const timer = setTimeout(() => setAlertMsg(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [alertMsg]);

  const handleEditToggle = () => setEditing(true);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/shared-notes/${id}/`, formData);
      setAlertVariant("success");
      setAlertMsg("Shared note updated successfully.");
      setEditing(false);

      setNote((prev) => ({
        ...prev,
        title: formData.title,
        content: formData.content,
      }));
    } catch (err) {
      console.error("Failed to update shared note", err);
      setAlertVariant("danger");
      setAlertMsg("Failed to update the note.");
    }
  };

  const handleRemoveSelf = async () => {
    try {
      await axios.delete(`/shared-notes/${id}/`);
      setAlertVariant("success");
      setAlertMsg("You have been removed from this shared note.");
      setTimeout(() => history.push("/shared"), 1500);
    } catch (err) {
      console.error("Failed to remove shared note", err);
      setAlertVariant("danger");
      setAlertMsg("Could not remove you from the shared note.");
    }
  };

  const confirmRemove = () => setShowModal(true);

  if (!note) return <p>Loading note...</p>;

  return (
    <div>
      <h2>Shared Note</h2>

      {alertMsg && (
        <Alert
          variant={alertVariant}
          dismissible
          onClose={() => setAlertMsg(null)}
        >
          {alertMsg}
        </Alert>
      )}

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
        <Button variant="outline-danger" onClick={confirmRemove}>
          Remove Me From This Note
        </Button>
        <Button variant="secondary" onClick={() => history.push("/shared")}>
          Back to Shared Notes
        </Button>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Leave Shared Note</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to remove yourself from this shared note?
          You will no longer have access to it.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleRemoveSelf}>
            Remove Me
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default SharedNoteDetailPage;
