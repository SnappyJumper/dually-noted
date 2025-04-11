// src/pages/tags/TagNotesPage.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { Button, Modal, Alert } from "react-bootstrap";

const TagNotesPage = () => {
  const { id } = useParams();
  const [tag, setTag] = useState({});
  const [notes, setNotes] = useState([]);
  const [alertMsg, setAlertMsg] = useState(null);
  const [alertVariant, setAlertVariant] = useState("success");

  const [noteToUpdate, setNoteToUpdate] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (alertMsg) {
      const timer = setTimeout(() => setAlertMsg(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [alertMsg]);

  useEffect(() => {
    const fetchNotesByTag = async () => {
      try {
        const { data: tagData } = await axios.get(`/tags/${id}/`);
        setTag(tagData);

        const { data: notesData } = await axios.get("/notes/");
        const filtered = notesData.filter(note =>
          note.tags.some(tag => tag.id === parseInt(id))
        );
        setNotes(filtered);
      } catch (err) {
        console.log(err);
        setAlertVariant("danger");
        setAlertMsg("Failed to load notes for this tag.");
      }
    };

    fetchNotesByTag();
  }, [id]);

  const handleRemoveTag = (noteId) => {
    setNoteToUpdate(noteId);
    setShowModal(true);
  };

  const handleConfirmRemove = async () => {
    const note = notes.find(n => n.id === noteToUpdate);
    const updatedTagIds = note.tags
      .filter(tag => tag.id !== parseInt(id))
      .map(tag => tag.id);

    try {
      await axios.put(`/notes/${noteToUpdate}/`, {
        title: note.title,
        content: note.content,
        tag_ids: updatedTagIds,
      });

      setNotes(prevNotes => prevNotes.filter(n => n.id !== noteToUpdate));
      setAlertVariant("success");
      setAlertMsg("Tag removed from note successfully.");
    } catch (err) {
      console.error("Failed to remove tag from note:", err);
      setAlertVariant("danger");
      setAlertMsg("Failed to remove tag from note.");
    } finally {
      setShowModal(false);
      setNoteToUpdate(null);
    }
  };

  return (
    <div>
      <h2>Notes tagged with #{tag.name}</h2>

      {alertMsg && (
        <Alert
          variant={alertVariant}
          className="my-3"
          dismissible
          onClose={() => setAlertMsg(null)}
        >
          {alertMsg}
        </Alert>
      )}

      {notes.length > 0 ? (
        notes.map((note) => (
          <div key={note.id}>
            <h4><Link to={`/notes/${note.id}`}>{note.title}</Link></h4>
            <p>{note.content}</p>
            <Button
              variant="danger"
              size="sm"
              onClick={() => handleRemoveTag(note.id)}
            >
              Remove from Tag
            </Button>
            <hr />
          </div>
        ))
      ) : (
        <p>No notes found for this tag.</p>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Remove Tag</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to remove this note from the <strong>#{tag.name}</strong> tag?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirmRemove}>
            Remove Tag
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default TagNotesPage;
