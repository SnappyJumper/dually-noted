// src/pages/tags/TagsPage.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Button,
  ListGroup,
  Row,
  Col,
  Modal,
  Form,
  Alert,
} from "react-bootstrap";
import { useHistory } from "react-router-dom";

const TagsPage = () => {
  const [tags, setTags] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [tagToDelete, setTagToDelete] = useState(null);
  const [newTagName, setNewTagName] = useState("");
  const [editTagId, setEditTagId] = useState(null);
  const [editTagName, setEditTagName] = useState("");

  const [alertMsg, setAlertMsg] = useState(null);
  const [alertVariant, setAlertVariant] = useState("success");

  const [createErrors, setCreateErrors] = useState([]);
  const [editErrors, setEditErrors] = useState([]);

  const history = useHistory();

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      const { data } = await axios.get("/tags/");
      setTags(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (alertMsg) {
      const timer = setTimeout(() => setAlertMsg(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [alertMsg]);

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
      console.log(err);
      const errorMsg = err.response?.data?.name?.[0] || "Failed to create tag.";
      setCreateErrors([errorMsg]);
      setAlertVariant("danger");
      setAlertMsg(errorMsg);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`/tags/${tagToDelete}/`);
      setTags((prev) => prev.filter((tag) => tag.id !== tagToDelete));
      setAlertVariant("success");
      setAlertMsg("Tag deleted successfully.");
    } catch (err) {
      console.log(err);
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
      console.log(err);
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
      <Row className="mb-3">
        <Col><h2>Tags</h2></Col>
        <Col className="text-end">
          <Button onClick={() => setShowCreateModal(true)}>+ New Tag</Button>
        </Col>
      </Row>

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
                />
                <Button size="sm" variant="success" onClick={() => handleEditSave(tag.id)}>
                  Save
                </Button>
                <Button size="sm" variant="secondary" onClick={handleEditCancel}>
                  Cancel
                </Button>
              </div>
            ) : (
              <div
                className="flex-grow-1"
                style={{ cursor: "pointer" }}
                onClick={() => history.push(`/tags/${tag.id}`)}
              >
                #{tag.name}
              </div>
            )}
            {editTagId !== tag.id && (
              <div className="d-flex gap-2">
                <Button size="sm" variant="outline-primary" onClick={() => handleEditClick(tag)}>
                  Edit
                </Button>
                <Button size="sm" variant="outline-danger" onClick={() => openDeleteModal(tag.id)}>
                  Delete
                </Button>
              </div>
            )}
          </ListGroup.Item>
        ))}
      </ListGroup>

      {/* Create Tag Modal */}
      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
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
          />
          {createErrors.map((err, idx) => (
            <Alert key={idx} variant="warning" className="mt-2">
              {err}
            </Alert>
          ))}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCreateModal(false)}>Cancel</Button>
          <Button onClick={handleCreateTag}>Create</Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Delete Tag</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this tag? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Errors Display */}
      {editErrors.length > 0 && (
        <Alert className="mt-3" variant="warning">
          {editErrors.map((err, idx) => (
            <div key={idx}>{err}</div>
          ))}
        </Alert>
      )}
    </div>
  );
};

export default TagsPage;
