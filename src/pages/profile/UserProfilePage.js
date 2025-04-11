// src/pages/users/UserProfilePage.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import cardStyles from "../../styles/StickyCard.module.css";

const UserProfilePage = () => {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axios.get(`/profiles/username/${username}/`);
        setProfile(data);
      } catch (err) {
        console.error("Error loading profile:", err);
      }
    };
    fetchProfile();
  }, [username]);

  if (!profile) return <p>Loading profile...</p>;

  return (
    <div>
      <h2 className="mb-3">@{profile.user}</h2>

      <div className={cardStyles.StickyNoteStatic}>
        {profile.profile_picture && (
          <img
            src={profile.profile_picture}
            alt={`${profile.name}'s profile`}
            style={{ width: 100, height: 100, borderRadius: "50%", marginBottom: "1rem" }}
          />
        )}

        <p><strong>Name:</strong> {profile.name || "Not provided"}</p>
        <p><strong>Bio:</strong> {profile.bio || "Not provided"}</p>
        <p><strong>Joined:</strong> {new Date(profile.created_at).toLocaleDateString()}</p>
      </div>
    </div>
  );
};

export default UserProfilePage;
