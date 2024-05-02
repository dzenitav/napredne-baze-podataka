import React, { useEffect } from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import { useParams } from 'react-router-dom';

import './NavLinks.css';

const NavLinks = ({isSignedIn, onSignIn}) => {

  const auth = {
    isLoggedIn: isSignedIn,
    userId: null,
    token: null,
    login: () => {},
    logout: () => {}
  }

  const userData = JSON.parse(localStorage.getItem("userData"));
  if (userData) {
    auth.userId = userData.userId;
  }

  const clickHandler = () =>{
    onSignIn(false);
  }

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (userData) {
      auth.userId = userData.userId;
    }
  }, [isSignedIn]);

  return (
    <ul className="nav-links">
      {auth.isLoggedIn && (
        <li>
          <NavLink to={`/user/${auth.userId}/products`}>My Products</NavLink>
        </li>
      )}
      {auth.isLoggedIn && (
        <li>
          <NavLink to="/products/new">Add Product</NavLink>
        </li>
      )}
      {!auth.isLoggedIn && (
        <li>
          <NavLink to="/auth">Sign In</NavLink>
        </li>
      )}
      {auth.isLoggedIn && (
        <li>
          <button onClick={clickHandler}>Sign Out</button>
        </li>
      )}
    </ul>
  );
};

export default NavLinks;
