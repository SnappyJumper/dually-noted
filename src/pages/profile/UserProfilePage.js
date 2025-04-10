// src/pages/users/UserProfilePage.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

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
      <h2>@{profile.user}</h2>

      {profile.profile_picture && (
        <img
          src={profile.profile_picture}
          alt={`${profile.name}'s profile`}
          style={{ width: 100, height: 100, borderRadius: "50%" }}
        />
      )}

      {profile.name && (
        <p>
          <strong>Name:</strong> {profile.name}
        </p>
      )}

      {profile.bio && (
        <p>
          <strong>Bio:</strong> {profile.bio}
        </p>
      )}

      <p>
        <strong>Joined:</strong>{" "}
        {new Date(profile.created_at).toLocaleDateString()}
      </p>
    </div>
  );
};

export default UserProfilePage;
