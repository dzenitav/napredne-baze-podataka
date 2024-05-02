import React, { useState, useCallback, useEffect } from "react";
import {
  Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";

import Products from "./products/pages/Products";
import UserProducts from "./products/pages/UserProducts";


export default ({history}) => {

  return (
      <Router history={history}>
        <Switch>
          <Route path="/user/:userId/products" exact>
            <UserProducts />
          </Route>
          <Route path="/" exact>
            <Products />
          </Route>
        </Switch>
      </Router>
  
  );
};
