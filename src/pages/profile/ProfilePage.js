// src/pages/profile/ProfilePage.js
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { CurrentUserContext } from "../../App";
import Avatar from "../../components/Avatar";

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const currentUser = useContext(CurrentUserContext);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axios.get(`/profiles/${currentUser.profile_id}/`);
        setProfile(data);
      } catch (err) {
        console.log(err);
      }
    };

    if (currentUser) {
      fetchProfile();
    }
  }, [currentUser]);

  if (!profile) return <p>Loading profile...</p>;

  return (
    <div>
      <h2>My Profile</h2>
      <Avatar src={profile.profile_picture} text={profile.user} height={80} />
      <p><strong>Name:</strong> {profile.name}</p>
      <p><strong>Username:</strong> {profile.user}</p>
      <p><strong>Bio:</strong> {profile.bio}</p>
    </div>
  );
};

export default ProfilePage;
