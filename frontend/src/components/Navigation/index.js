import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import OpenModalButton from '../OpenModalButton';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import CreateSpotModal from '../SpotsIndex/CreateSpotModal';
import './Navigation.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

  let sessionLinks;
  if (sessionUser) {
    sessionLinks = (
      <span className="logged-in-nav-buttons">
        <div className="create-a-spot-button">
          <OpenModalButton
            buttonText="Create a Spot"
            modalComponent={<CreateSpotModal />} />
        </div>
        <div className="view-all-reviews-button">
          <Link to="/reviews/current">
            <button>View all Reviews</button>
          </Link>
        </div>
        <div className="profile-button">
          <ProfileButton user={sessionUser} />
        </div>
      </span>
    );
  } else {
    sessionLinks = (
      <span className="login-signup-buttons">
        <div className="login-button">
          <OpenModalButton
            buttonText="Log In"
            modalComponent={<LoginFormModal />}
          />
        </div>
        <div className="signup-button">
          <OpenModalButton
            buttonText="Sign Up"
            modalComponent={<SignupFormModal />}
          />
        </div>
      </span>
    );
  }

  return (
    <div className="navButtons">
      <div className="home-button-container">
        <NavLink exact to="/">
          <i className="fa-solid fa-house fa-2x"></i>
        </NavLink>
      </div>
      {isLoaded && sessionLinks}
    </div>
  );
}

export default Navigation;
