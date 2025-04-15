/**
 * TagNotesPage
 *
 * Displays all notes associated with a specific tag.
 * Users can also remove the current tag from any note directly from this page.
 * This helps with organizing notes across different topics.
 */

import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

import { Button, Modal, Alert } from "react-bootstrap";

import cardStyles from "../../styles/StickyCard.module.css";
import btnStyles from "../../styles/Button.module.css";

const TagNotesPage = () => {
  const { id } = useParams(); // Tag ID from URL
  const [tag, setTag] = useState({});
  const [notes, setNotes] = useState([]);
  const [alertMsg, setAlertMsg] = useState(null);
  const [alertVariant, setAlertVariant] = useState("success");

  const [noteToUpdate, setNoteToUpdate] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Clear alert after a few seconds
  useEffect(() => {
    if (alertMsg) {
      const timer = setTimeout(() => setAlertMsg(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [alertMsg]);

  // Load tag and notes associated with it
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
        // console.log(err);
        setAlertVariant("danger");
        setAlertMsg("Failed to load notes for this tag.");
      }
    };

    fetchNotesByTag();
  }, [id]);

  // Trigger modal to confirm tag removal from note
  const handleRemoveTag = (noteId) => {
    setNoteToUpdate(noteId);
    setShowModal(true);
  };

  // Remove the current tag from the selected note
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

      // Remove the note from list if it no longer contains the tag
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
      <h2 className="mb-3">Notes tagged with #{tag.name}</h2>

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
          <div key={note.id} className={cardStyles.StickyNoteStatic}>
            <h4 className={cardStyles.title}>
              <Link
                to={`/notes/${note.id}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                {note.title}
              </Link>
            </h4>
            <p>{note.content}</p>
            <Button
              variant="danger"
              size="sm"
              className={`${btnStyles.Button} mt-2`}
              onClick={() => handleRemoveTag(note.id)}
              aria-label={`Remove tag ${tag.name} from note titled ${note.title}`}
            >
              Remove from Tag
            </Button>
          </div>
        ))
      ) : (
        <p>No notes found for this tag.</p>
      )}

      {/* Confirmation Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Remove Tag</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to remove this note from the{" "}
          <strong>#{tag.name}</strong> tag?
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowModal(false)}
            aria-label="Cancel tag removal"
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            className={btnStyles.Button}
            onClick={handleConfirmRemove}
            aria-label="Confirm tag removal from note"
          >
            Remove Tag
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default TagNotesPage;
