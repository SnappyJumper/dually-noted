import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Form, Row, Col, Alert } from "react-bootstrap";

import { CurrentUserContext } from "../../App";
import Avatar from "../../components/Avatar";

import cardStyles from "../../styles/StickyCard.module.css";
import btnStyles from "../../styles/Button.module.css";

/**
 * ProfilePage allows a user to view and edit their profile details.
 * Includes profile picture upload, name, and bio.
 */
const ProfilePage = () => {
  const currentUser = useContext(CurrentUserContext);

  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);

  const [updatedData, setUpdatedData] = useState({
    name: "",
    bio: "",
    profile_picture: null,
  });

  const [alertMsg, setAlertMsg] = useState(null);
  const [alertVariant, setAlertVariant] = useState("success");

  // Fetch current user's profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axios.get(`/profiles/${currentUser.profile_id}/`);
        setProfile(data);
        setUpdatedData({
          name: data.name || "",
          bio: data.bio || "",
          profile_picture: null,
        });
      } catch (err) {
        // console.log(err);
        setAlertVariant("danger");
        setAlertMsg("Failed to load profile.");
      }
    };

    if (currentUser) {
      fetchProfile();
    }
  }, [currentUser]);

  // Dismiss alerts after 4 seconds
  useEffect(() => {
    if (alertMsg) {
      const timer = setTimeout(() => setAlertMsg(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [alertMsg]);

  // Update form state on input change
  const handleChange = (e) => {
    setUpdatedData({ ...updatedData, [e.target.name]: e.target.value });
  };

  // Handle image file upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && !file.type.startsWith("image/")) {
      setAlertVariant("danger");
      setAlertMsg("Please upload a valid image file.");
      return;
    }
    setUpdatedData({ ...updatedData, profile_picture: file });
  };

  // Submit profile updates
  const handleSave = async () => {
    const formData = new FormData();
    formData.append("name", updatedData.name);
    formData.append("bio", updatedData.bio);
    if (updatedData.profile_picture) {
      formData.append("profile_picture", updatedData.profile_picture);
    }

    try {
      const { data } = await axios.put(`/profiles/${currentUser.profile_id}/`, formData);
      setProfile(data);
      setEditMode(false);
      setAlertVariant("success");
      setAlertMsg("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      setAlertVariant("danger");
      setAlertMsg("Failed to update profile. Please try again.");
    }
  };

  if (!profile) return <p>Loading profile...</p>;

  return (
    <div>
      <h2 className="mb-3">My Profile</h2>

      <div className={cardStyles.StickyNoteStatic}>
        <Row>
          {/* Left: Avatar and upload control */}
          <Col md={4} className="text-center">
            <Avatar
              src={profile.profile_picture}
              text={profile.user}
              height={100}
              canUpload={editMode}
              onChange={handleFileChange}
            />
            {editMode && (
              <Form.Group controlId="formFile" className="mt-3">
                <Form.Label>Change Picture</Form.Label>
                <Form.Control type="file" onChange={handleFileChange} />
              </Form.Group>
            )}
          </Col>

          {/* Right: Profile fields */}
          <Col md={8}>
            {alertMsg && (
              <Alert
                variant={alertVariant}
                dismissible
                onClose={() => setAlertMsg(null)}
              >
                {alertMsg}
              </Alert>
            )}

            {editMode ? (
              <>
                <Form.Group className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    name="name"
                    value={updatedData.name}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Bio</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="bio"
                    rows={4}
                    value={updatedData.bio}
                    onChange={handleChange}
                  />
                </Form.Group>

                <div className="d-flex gap-2 mt-2">
                  <button
                    className={`${btnStyles.Button} ${btnStyles.Blue}`}
                    onClick={handleSave}
                    aria-label="Save profile changes"
                  >
                    Save
                  </button>
                  <button
                    className={`${btnStyles.Button} ${btnStyles.BlackOutline}`}
                    onClick={() => setEditMode(false)}
                    aria-label="Cancel profile editing"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <h4>{profile.name || "No name provided"}</h4>
                <p><strong>Username:</strong> {profile.user}</p>
                <p><strong>Bio:</strong> {profile.bio || "No bio provided"}</p>
                <button
                  className={`${btnStyles.Button} ${btnStyles.BlueOutline}`}
                  onClick={() => setEditMode(true)}
                  aria-label="Edit profile"
                >
                  Edit Profile
                </button>
              </>
            )}
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default ProfilePage;
