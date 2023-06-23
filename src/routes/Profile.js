import React, { useState } from "react"
import { auth } from "fbase";
import { signOut, updateProfile } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Profile = ({ refreshUser, userObj }) => {
  const navigate = useNavigate();
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName)
  const onLogOutClick = () => {
    signOut(auth);
    navigate("/");
    refreshUser();
  };

  const onChange = (event) => {
    const { target: { value }, } = event;
    setNewDisplayName(value);
  }
  const onSubmit = async (event) => {
    event.preventDefault();
    if (userObj.displayName !== newDisplayName) {
      await updateProfile(auth.currentUser, {
        displayName: newDisplayName,
      });
      refreshUser();
    }
  }
  return (
    <div className="container">
      <form onSubmit={onSubmit} className="profileForm">
        <input
          onChange={onChange}
          type="text"
          autoFocus
          placeholder="Display name"
          value={newDisplayName}
          className="formInput"
        />
        <input
          type="submit"
          value="Update Profile"
          className="updateProfileBtn"
        />
      </form>
      <span onClick={onLogOutClick} className="logOut">Log Out</span>
    </div>
  );
};

export default Profile;