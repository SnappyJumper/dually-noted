// src/pages/tags/TagsPage.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, ListGroup, Row, Col, Modal, Form } from "react-bootstrap";
import { useHistory } from "react-router-dom";

const TagsPage = () => {
  const [tags, setTags] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newTagName, setNewTagName] = useState("");
  const history = useHistory();

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const { data } = await axios.get("/tags/");
        setTags(data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchTags();
  }, []);

  const handleCreateTag = async () => {
    try {
      await axios.post("/tags/", { name: newTagName });
      setNewTagName("");
      setShowModal(false);
      const { data } = await axios.get("/tags/");
      setTags(data);
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
          <ListGroup.Item key={tag.id} className="d-flex justify-content-between align-items-center">
            <span
              style={{ cursor: "pointer" }}
              onClick={() => history.push(`/tags/${tag.id}`)}
            >
              #{tag.name}
            </span>
            <Button
              variant="outline-danger"
              size="sm"
              onClick={() => handleDeleteTag(tag.id)}
            >
              Delete
            </Button>
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
