/**
 * TagsPage
 *
 * Displays a list of all tags, and provides full CRUD functionality:
 * - Users can create, edit, or delete tags.
 * - Clicking on a tag navigates to a list of associated notes.
 * - Success and error states are managed via alerts and modals.
 */

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";

import { Button, ListGroup, Modal, Form, Alert } from "react-bootstrap";

import cardStyles from "../../styles/StickyCard.module.css";
import btnStyles from "../../styles/Button.module.css";

const TagsPage = () => {
  const [tags, setTags] = useState([]);

  // Modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Form states
  const [tagToDelete, setTagToDelete] = useState(null);
  const [newTagName, setNewTagName] = useState("");
  const [editTagId, setEditTagId] = useState(null);
  const [editTagName, setEditTagName] = useState("");

  // Alert and error handling
  const [alertMsg, setAlertMsg] = useState(null);
  const [alertVariant, setAlertVariant] = useState("success");
  const [createErrors, setCreateErrors] = useState([]);
  const [editErrors, setEditErrors] = useState([]);

  const history = useHistory();

  useEffect(() => {
    fetchTags();
  }, []);

  // Fetch all tags from API
  const fetchTags = async () => {
    try {
      const { data } = await axios.get("/tags/");
      setTags(data);
    } catch (err) {
      console.log(err);
    }
  };

  // Auto-hide alerts after a few seconds
  useEffect(() => {
    if (alertMsg) {
      const timer = setTimeout(() => setAlertMsg(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [alertMsg]);

  // Create new tag
  const handleCreateTag = async () => {
    const trimmed = newTagName.trim();
    if (!trimmed) {
      setCreateErrors(["Tag name cannot be empty."]);
      return;
    }

    try {
      await axios.post("/tags/", { name: trimmed });
      setNewTagName("");
      setShowCreateModal(false);
      fetchTags();
      setCreateErrors([]);
      setAlertVariant("success");
      setAlertMsg("Tag created successfully.");
    } catch (err) {
      const errorMsg = err.response?.data?.name?.[0] || "Failed to create tag.";
      setCreateErrors([errorMsg]);
      setAlertVariant("danger");
      setAlertMsg(errorMsg);
    }
  };

  // Confirm and delete tag
  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`/tags/${tagToDelete}/`);
      setTags((prev) => prev.filter((tag) => tag.id !== tagToDelete));
      setAlertVariant("success");
      setAlertMsg("Tag deleted successfully.");
    } catch (err) {
      setAlertVariant("danger");
      setAlertMsg("Failed to delete tag.");
    } finally {
      setShowDeleteModal(false);
      setTagToDelete(null);
    }
  };

  const handleEditClick = (tag) => {
    setEditTagId(tag.id);
    setEditTagName(tag.name);
    setEditErrors([]);
  };

  const handleEditCancel = () => {
    setEditTagId(null);
    setEditTagName("");
    setEditErrors([]);
  };

  const handleEditSave = async (id) => {
    const trimmed = editTagName.trim();
    if (!trimmed) {
      setEditErrors(["Tag name cannot be empty."]);
      return;
    }

    try {
      await axios.put(`/tags/${id}/`, { name: trimmed });
      setEditTagId(null);
      setEditTagName("");
      fetchTags();
      setEditErrors([]);
      setAlertVariant("success");
      setAlertMsg("Tag updated successfully.");
    } catch (err) {
      const errorMsg = err.response?.data?.name?.[0] || "Failed to update tag.";
      setEditErrors([errorMsg]);
      setAlertVariant("danger");
      setAlertMsg(errorMsg);
    }
  };

  const openDeleteModal = (id) => {
    setTagToDelete(id);
    setShowDeleteModal(true);
  };

  return (
    <div>
      <h2 className="mb-3">Tags</h2>

      <button
        className={`${btnStyles.Button} ${btnStyles.Blue} mb-4`}
        onClick={() => setShowCreateModal(true)}
        aria-label="Create a new tag"
      >
        + New Tag
      </button>

      <div className={cardStyles.StickyNoteStatic}>
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

        <ListGroup>
          {tags.map((tag) => (
            <ListGroup.Item
              key={tag.id}
              className="d-flex justify-content-between align-items-center"
            >
              {editTagId === tag.id ? (
                <div className="d-flex flex-grow-1 align-items-center gap-2">
                  <Form.Control
                    size="sm"
                    value={editTagName}
                    onChange={(e) => setEditTagName(e.target.value)}
                    aria-label={`Edit tag name for ${tag.name}`}
                  />
                  <Button
                    size="sm"
                    variant="success"
                    className={btnStyles.Button}
                    onClick={() => handleEditSave(tag.id)}
                    aria-label={`Save changes to tag ${tag.name}`}
                  >
                    Save
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    className={btnStyles.Button}
                    onClick={handleEditCancel}
                    aria-label="Cancel tag editing"
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <div
                  className="flex-grow-1 fw-bold"
                  style={{ cursor: "pointer" }}
                  onClick={() => history.push(`/tags/${tag.id}`)}
                  aria-label={`View notes tagged with ${tag.name}`}
                >
                  #{tag.name}
                </div>
              )}
              {editTagId !== tag.id && (
                <div className="d-flex gap-2">
                  <Button
                    size="sm"
                    className={`${btnStyles.Button} ${btnStyles.BlueOutline}`}
                    onClick={() => handleEditClick(tag)}
                    aria-label={`Edit tag ${tag.name}`}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    className={`${btnStyles.Button} ${btnStyles.BlackOutline}`}
                    onClick={() => openDeleteModal(tag.id)}
                    aria-label={`Delete tag ${tag.name}`}
                  >
                    Delete
                  </Button>
                </div>
              )}
            </ListGroup.Item>
          ))}
        </ListGroup>

        {/* Create Modal */}
        <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Create New Tag</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Control
              placeholder="Enter tag name"
              value={newTagName}
              onChange={(e) => {
                setNewTagName(e.target.value);
                setCreateErrors([]);
              }}
              aria-label="New tag name input"
            />
            {createErrors.map((err, idx) => (
              <Alert key={idx} variant="warning" className="mt-2">
                {err}
              </Alert>
            ))}
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowCreateModal(false)}
              aria-label="Cancel creating new tag"
            >
              Cancel
            </Button>
            <Button
              className={btnStyles.Button}
              onClick={handleCreateTag}
              aria-label="Confirm create tag"
            >
              Create
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Delete Modal */}
        <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Delete Tag</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to delete this tag? This action cannot be undone.
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowDeleteModal(false)}
              aria-label="Cancel tag deletion"
            >
              Cancel
            </Button>
            <Button
              className={btnStyles.Button}
              variant="danger"
              onClick={handleConfirmDelete}
              aria-label="Confirm delete tag"
            >
              Delete
            </Button>
          </Modal.Footer>
        </Modal>

        {editErrors.length > 0 && (
          <Alert className="mt-3" variant="warning">
            {editErrors.map((err, idx) => (
              <div key={idx}>{err}</div>
            ))}
          </Alert>
        )}
      </div>
    </div>
  );
};

export default TagsPage;
