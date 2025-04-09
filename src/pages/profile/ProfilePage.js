// src/pages/profile/ProfilePage.js
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { CurrentUserContext } from "../../App";
import Avatar from "../../components/Avatar";
import { Form, Button, Container, Row, Col } from "react-bootstrap";

const ProfilePage = () => {
  const currentUser = useContext(CurrentUserContext);
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [updatedData, setUpdatedData] = useState({
    name: "",
    bio: "",
    profile_picture: null,
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axios.get(
          `/profiles/${currentUser.profile_id}/`
        );
        setProfile(data);
        setUpdatedData({
          name: data.name || "",
          bio: data.bio || "",
          profile_picture: null, // For file uploads
        });
      } catch (err) {
        console.log(err);
      }
    };

    if (currentUser) {
      fetchProfile();
    }
  }, [currentUser]);

  const handleChange = (e) => {
    setUpdatedData({
      ...updatedData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    setUpdatedData({
      ...updatedData,
      profile_picture: e.target.files[0],
    });
  };

  const handleSave = async () => {
    const formData = new FormData();
    formData.append("name", updatedData.name);
    formData.append("bio", updatedData.bio);
    if (updatedData.profile_picture) {
      formData.append("profile_picture", updatedData.profile_picture);
    }

    try {
      const { data } = await axios.put(
        `/profiles/${currentUser.profile_id}/`,
        formData
      );
      setProfile(data);
      setEditMode(false);
    } catch (err) {
      console.error(err);
    }
  };

  if (!profile) return <p>Loading profile...</p>;

  return (
    <Container>
      <Row className="my-4">
        <Col md={4} className="text-center">
          <Avatar
            src={profile.profile_picture}
            text={profile.user}
            height={100}
            canUpload={editMode}
            onChange={handleFileChange}
          />
          {editMode && (
            <Form.Group controlId="formFile" className="mt-2">
              <Form.Label>Change Picture</Form.Label>
              <Form.Control type="file" onChange={handleFileChange} />
            </Form.Group>
          )}
        </Col>
        <Col md={8}>
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

              <div className="d-flex gap-2">
                <Button variant="primary" onClick={handleSave}>
                  Save
                </Button>
                <Button variant="secondary" onClick={() => setEditMode(false)}>
                  Cancel
                </Button>
              </div>
            </>
          ) : (
            <>
              <h3>{profile.name || "No name provided"}</h3>
              <p>
                <strong>Username:</strong> {profile.user}
              </p>
              <p>
                <strong>Bio:</strong> {profile.bio || "No bio provided"}
              </p>
              <Button
                variant="outline-secondary"
                onClick={() => setEditMode(true)}
              >
                Edit Profile
              </Button>
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default ProfilePage;
