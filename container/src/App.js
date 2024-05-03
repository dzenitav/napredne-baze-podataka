import React, { lazy, Suspense, useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch
} from "react-router-dom";

import MainNavigation from "./components/Navigation/MainNavigation";
import Progress from "./components/Progress";

//const ProductsLazy = lazy(() => import("./components/ProductsApp"));
//const AuthLazy = lazy(() => import("./components/AuthApp"))

import ProductsApp from './components/ProductsApp';
import CoreApp from './components/CoreApp';
import AuthApp from './components/AuthApp';

const App = () => {
  let isLoggedIn = false;
  const userData = localStorage.getItem("userData");
  if (userData) {
      isLoggedIn = true;
  }
  const [isSignedIn, setIsSignedIn] = useState(isLoggedIn);

  const signInCallback = (signInState) => {
      console.log("Container - I am setting new signed in state to: ", signInState)
      if(!signInState) {
        localStorage.removeItem("userData");
      }
      setIsSignedIn(signInState);
  }


  return (
  
      <Router>
        <main>
           <MainNavigation isSignedIn={isSignedIn} loginStateU={(loginState)=> signInCallback(loginState)}/>
           <Switch>
              <Route path="/" exact >
                  <ProductsApp isSignedIn={isSignedIn} />
              </Route>
              <Route path="/user/:userId/products" exact>
                  <ProductsApp isSignedIn={isSignedIn} />
              </Route>
              <Route path="/products/:productId" exact>
                  <CoreApp isSignedIn={isSignedIn} />
              </Route>
              <Route path="/products/new" exact>
                  <CoreApp isSignedIn={isSignedIn} />
              </Route>
              <Route path="/auth" exact >
                  <AuthApp onSignIn={()=> signInCallback(true)}/>
              </Route>
          </Switch>
        </main>
      </Router>
  
  );
};

export default App;
