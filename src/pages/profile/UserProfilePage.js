// src/pages/users/UserProfilePage.js

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import cardStyles from "../../styles/StickyCard.module.css";

/**
 * UserProfilePage
 * 
 * Public view for displaying another user's profile by their username.
 * Accessible through shared notes or links.
 */
const UserProfilePage = () => {
  const { username } = useParams(); // Extract username from the route params
  const [profile, setProfile] = useState(null);

  // Fetch user profile data on mount
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

  // Show loading message while profile data is being fetched
  if (!profile) return <p>Loading profile...</p>;

  return (
    <div>
      <h2 className="mb-3">@{profile.user}</h2>

      <div className={cardStyles.StickyNoteStatic}>
        {/* Display profile image if available */}
        {profile.profile_picture && (
          <img
            src={profile.profile_picture}
            alt={`${profile.name}'s profile`}
            style={{ width: 100, height: 100, borderRadius: "50%", marginBottom: "1rem" }}
          />
        )}

        {/* Display profile details */}
        <p><strong>Name:</strong> {profile.name || "Not provided"}</p>
        <p><strong>Bio:</strong> {profile.bio || "Not provided"}</p>
        <p><strong>Joined:</strong> {new Date(profile.created_at).toLocaleDateString()}</p>
      </div>
    </div>
  );
};

export default UserProfilePage;
