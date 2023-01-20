import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
  };

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  return (
    <>
      <button className="profile-button-container rounded-corners"onClick={openMenu}>
        <i className="fa-solid fa-bars fa-sm"></i>
        <i className="fas fa-user-circle fa-2xl" />
      </button>
      <div className={ulClassName} ref={ulRef}>
        <div>{user.username}</div>
        <div>{user.firstName} {user.lastName}</div>
        <div>{user.email}</div>
        <div>
          <button className="logout-button" onClick={logout}>Log Out</button>
        </div>
      </div>
    </>
  );
}

export default ProfileButton;
