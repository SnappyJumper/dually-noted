// src/pages/notes/NoteForm.js
import React from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import TagSelector from "../../components/TagSelector";
import btnStyles from "../../styles/Button.module.css";

const NoteForm = ({
  noteData,
  handleChange,
  handleSubmit,
  selectedTags,
  setSelectedTags,
  users,
  selectedUser,
  setSelectedUser,
  permission,
  setPermission,
}) => {
  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="title">
        <Form.Label>Title</Form.Label>
        <Form.Control
          type="text"
          name="title"
          value={noteData.title}
          onChange={handleChange}
          placeholder="Enter title"
          required
        />
      </Form.Group>

      <Form.Group controlId="content">
        <Form.Label>Content</Form.Label>
        <Form.Control
          as="textarea"
          name="content"
          value={noteData.content}
          onChange={handleChange}
          placeholder="Enter content"
          rows={4}
          required
        />
      </Form.Group>

      <Form.Group controlId="tags">
        <Form.Label>Tags</Form.Label>
        <TagSelector
          selectedTags={selectedTags}
          setSelectedTags={setSelectedTags}
        />
      </Form.Group>

      <Row className="my-3">
        <Col md={8}>
          <Form.Group controlId="sharedWith">
            <Form.Label>Share with a user</Form.Label>
            <Form.Control
              as="select"
              value={selectedUser || ""}
              onChange={(e) =>
                setSelectedUser(e.target.value === "" ? null : e.target.value)
              }
            >
              <option value="">-- Select a user --</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.username || user.user}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group controlId="permission">
            <Form.Label>Permission</Form.Label>
            <Form.Control
              as="select"
              value={permission}
              onChange={(e) => setPermission(e.target.value)}
              disabled={!selectedUser}
            >
              <option value="read">Read</option>
              <option value="edit">Edit</option>
            </Form.Control>
          </Form.Group>
        </Col>
      </Row>

      <div className="mt-3 d-flex gap-2 flex-wrap">
        <Button
          type="submit"
          className={`${btnStyles.Button} ${btnStyles.Bright}`}
        >
          Save
        </Button>
        <Button
          type="button"
          className={`${btnStyles.Button} ${btnStyles.BlueOutline}`}
          onClick={() => window.history.back()}
        >
          Cancel
        </Button>
      </div>
    </Form>
  );
};

export default NoteForm;
