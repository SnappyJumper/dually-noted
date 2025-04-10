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
        console.error("Failed to load profile:", err);
      }
    };

    fetchProfile();
  }, [username]);

  if (!profile) return <p>Loading...</p>;

  return (
    <div>
      <h2>{profile.user}</h2>
      <p><strong>Joined:</strong> {new Date(profile.created_at).toDateString()}</p>
      {profile.bio && <p><strong>Bio:</strong> {profile.bio}</p>}
    </div>
  );
};

export default UserProfilePage;
