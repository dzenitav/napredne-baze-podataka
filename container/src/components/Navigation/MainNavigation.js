import React from 'react';
import { Link } from 'react-router-dom';

import MainHeader from './MainHeader';
import NavLinks from './NavLinks';
import './MainNavigation.css';

const MainNavigation = ({isSignedIn, loginStateU}) => {

  const signInCallbackMain = (loginState) => {
    loginStateU(false);
  }

  return (
    <React.Fragment>
      <MainHeader>
        <h1 className="main-navigation__title">
          <Link to="/">Products</Link>
        </h1>
        <nav className="main-navigation__header-nav">
          <NavLinks isSignedIn={isSignedIn} onSignIn={(signInState) => signInCallbackMain(signInState)}/>
        </nav>
      </MainHeader>
    </React.Fragment>
  );
};

export default MainNavigation;
