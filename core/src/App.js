import React from "react";
import {
  Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";

import NewProduct from "./products/pages/NewProduct";
import UpdateProduct from "./products/pages/UpdateProduct";


export default ({history}) => {

  return (
      <Router history={history}>
        <Switch>
          <Route path="/products/new" exact>
            <NewProduct history={history} />
          </Route>
          <Route path="/products/:productId" exact>
            <UpdateProduct history={history} />
          </Route>
        </Switch>
      </Router>
  
  );
};
