import React, { useState, useCallback, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";

import MainNavigation from "./components/Navigation/MainNavigation";
import ProductsApp from "./components/ProductsApp";

const App = (props, history) => {

  const routes = (
    <Switch>
      <Route path="/" exact component={ProductsApp}/>

    </Switch>
  );

  return (
   
      <Router>
        <main>
        
          {routes}
        </main>
      </Router>
  
  );
};

export default App;
