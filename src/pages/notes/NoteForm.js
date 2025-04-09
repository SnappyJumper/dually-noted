// src/pages/notes/NoteForm.js
import React from "react";
import { Form, Button } from "react-bootstrap";

const NoteForm = ({ noteData, handleChange, handleSubmit }) => (
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

    <Button type="submit" variant="primary">Save</Button>
  </Form>
);

export default NoteForm;
