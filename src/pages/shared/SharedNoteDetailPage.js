// src/pages/shared/SharedNoteDetailPage.js

import React, { useEffect, useState } from "react";
import { useParams, useHistory, Link } from "react-router-dom";
import axios from "axios";
import { Form, Alert, Modal } from "react-bootstrap";

import styles from "../../styles/StickyCard.module.css";
import btnStyles from "../../styles/Button.module.css";

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
    <>
      <h2 className="mb-3">Shared Note</h2>

      <div className={styles.StickyNoteStatic}>
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
            <Form.Group controlId="title" className="mb-3">
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

            <button
              type="submit"
              className={`${btnStyles.Button} ${btnStyles.Blue} mt-3`}
              aria-label="Save changes to this shared note"
            >
              Save Changes
            </button>
          </Form>
        ) : (
          <>
            <h4 className={styles.title}>
              {note?.title || "Untitled Note"}
            </h4>
            <p className={styles.content}>
              {note?.content || "No content available."}
            </p>
            <p className={styles.meta}>
              <strong>Owner:</strong>{" "}
              {note?.user ? (
                <Link to={`/profiles/username/${note.user}`}>
                  {note.user}
                </Link>
              ) : (
                "Unknown"
              )}
            </p>
          </>
        )}

        <div className="mt-4 d-flex gap-2 flex-wrap">
          {canEdit && !editing && (
            <button
              className={`${btnStyles.Button} ${btnStyles.Blue}`}
              onClick={handleEditToggle}
              aria-label="Edit this shared note"
            >
              Edit
            </button>
          )}
          <button
            className={`${btnStyles.Button} ${btnStyles.DangerOutline}`}
            onClick={confirmRemove}
            aria-label="Remove yourself from this shared note"
          >
            Remove Me From This Note
          </button>
        </div>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Leave Shared Note</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to remove yourself from this shared note? You
          will no longer have access to it.
        </Modal.Body>
        <Modal.Footer>
          <button
            className={`${btnStyles.Button} ${btnStyles.Black}`}
            onClick={() => setShowModal(false)}
            aria-label="Cancel removal from shared note"
          >
            Cancel
          </button>
          <button
            className={`${btnStyles.Button} ${btnStyles.Danger}`}
            onClick={handleRemoveSelf}
            aria-label="Confirm removal from shared note"
          >
            Remove Me
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default SharedNoteDetailPage;
