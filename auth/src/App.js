import React, { useState, useCallback, useEffect } from "react";
import {
  Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";

import Auth from "./user/pages/Auth";
import { AuthContext } from "./shared/context/auth-context";

let logoutTimer;

export default ({history}) => {
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(false);
  const [tokenExpirationDate, setTokenExpirationDate] = useState();

  const login = useCallback((uid, token, expirationDate) => {
    setToken(token);
    setUserId(uid);
    const tokenExpirationDate = expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
    setTokenExpirationDate(tokenExpirationDate);
    localStorage.setItem(
      "userData",
      JSON.stringify({
        userId: uid,
        token: token,
        expiration: tokenExpirationDate.toISOString(),
      })
    );
    history.push("/");
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUserId(null);
    setTokenExpirationDate(null)
    localStorage.removeItem("userData");
  }, []); 

  useEffect(() => {
    if(token && tokenExpirationDate) {
      const remainingTime = tokenExpirationDate.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, tokenExpirationDate]);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userData"));
    if (storedData && storedData.token && new Date(storedData.expiration) > new Date()) {
      login(storedData.userId, storedData.token, new Date(storedData.expiration));
    }
  }, []);

  let routes;

  routes = (
      <Switch>
        <Route path="/auth" exact>
          <Auth />
        </Route>
      </Switch>
  );

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        userId: userId,
        login: login,
      }}
    >
      <Router history={history}>
        <main>
          {routes}
        </main>
      </Router>
    </AuthContext.Provider>
  );
};

