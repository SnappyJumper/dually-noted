// src/pages/tags/TagsPage.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, ListGroup, Row, Col, Modal, Form } from "react-bootstrap";
import { useHistory } from "react-router-dom";

const TagsPage = () => {
  const [tags, setTags] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newTagName, setNewTagName] = useState("");
  const [editTagId, setEditTagId] = useState(null);
  const [editTagName, setEditTagName] = useState("");
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

  const handleCreateTag = async () => {
    try {
      await axios.post("/tags/", { name: newTagName });
      setNewTagName("");
      setShowModal(false);
      fetchTags();
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteTag = async (id) => {
    try {
      await axios.delete(`/tags/${id}/`);
      setTags((prev) => prev.filter((tag) => tag.id !== id));
    } catch (err) {
      console.log(err);
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
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <Row className="mb-3">
        <Col><h2>Tags</h2></Col>
        <Col className="text-end">
          <Button onClick={() => setShowModal(true)}>+ New Tag</Button>
        </Col>
      </Row>

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
                <Button size="sm" variant="outline-danger" onClick={() => handleDeleteTag(tag.id)}>
                  Delete
                </Button>
              </div>
            )}
          </ListGroup.Item>
        ))}
      </ListGroup>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
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
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button onClick={handleCreateTag}>Create</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default TagsPage;
