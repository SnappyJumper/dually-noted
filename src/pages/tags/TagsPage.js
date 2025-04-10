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

  // Auto-dismiss alert
  useEffect(() => {
    if (alertMsg) {
      const timer = setTimeout(() => setAlertMsg(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [alertMsg]);

  const handleCreateTag = async () => {
    try {
      await axios.post("/tags/", { name: newTagName });
      setNewTagName("");
      setShowCreateModal(false);
      fetchTags();
      setAlertVariant("success");
      setAlertMsg("Tag created successfully.");
    } catch (err) {
      console.log(err);
      setAlertVariant("danger");
      setAlertMsg("Failed to create tag.");
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
  };

  const handleEditCancel = () => {
    setEditTagId(null);
    setEditTagName("");
  };

  const handleEditSave = async (id) => {
    try {
      await axios.put(`/tags/${id}/`, { name: editTagName });
      setEditTagId(null);
      setEditTagName("");
      fetchTags();
      setAlertVariant("success");
      setAlertMsg("Tag updated successfully.");
    } catch (err) {
      console.log(err);
      setAlertVariant("danger");
      setAlertMsg("Failed to update tag.");
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

      {/* ✅ Success/Error Alert */}
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

      {/* ✅ Create Tag Modal */}
      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create New Tag</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            placeholder="Enter tag name"
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCreateModal(false)}>Cancel</Button>
          <Button onClick={handleCreateTag}>Create</Button>
        </Modal.Footer>
      </Modal>

      {/* ✅ Delete Confirmation Modal */}
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
    </div>
  );
};

export default TagsPage;
