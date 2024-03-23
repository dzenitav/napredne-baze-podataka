import React, { useState, useCallback, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";

import Products from "./products/pages/Products";
import UserProducts from "./products/pages/UserProducts";

let logoutTimer;

const App = () => {

  const routes = (
    <Switch>
      <Route path="/" exact>
        <Products />
      </Route>
      <Route path="/user/:userId/products" exact>
        <UserProducts />
      </Route>
      <Redirect to="/" />
    </Switch>
  );

  return (
   
      <Router>
        <main>{routes}</main>
      </Router>
  
  );
};

export default App;
