// src/pages/notes/NoteForm.js
import React from "react";
import { Form, Button } from "react-bootstrap";
import TagSelector from "../../components/TagSelector";
import { useHistory } from "react-router-dom";

const NoteForm = ({
  noteData,
  handleChange,
  handleSubmit,
  selectedTags,
  setSelectedTags,
}) => {
  const history = useHistory();

  const handleCancel = () => {
    history.push("/notes");
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="title">
        <Form.Label>Title</Form.Label>
        <Form.Control
          type="text"
          name="title"
          value={noteData.title}
          onChange={handleChange}
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
          rows={4}
          required
        />
      </Form.Group>

      <TagSelector
        selectedTags={selectedTags}
        setSelectedTags={setSelectedTags}
      />

      <div className="mt-3 d-flex gap-2">
        <Button type="submit" variant="primary">
          Save
        </Button>
        <Button variant="secondary" onClick={handleCancel}>
          Cancel
        </Button>
      </div>
    </Form>
  );
};

export default NoteForm;
