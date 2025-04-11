// src/components/PrivateRoute.js

import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import { CurrentUserContext } from "../App";

/**
 * PrivateRoute restricts access to authenticated users only.
 * - If a user is logged in, it renders the specified component or render function.
 * - If not, it redirects to the login page.
 *
 * Props:
 * - component: Component to render (optional)
 * - render: Render function (optional)
 * - ...rest: Additional props passed to the Route
 */
const PrivateRoute = ({ component: Component, render, ...rest }) => {
  const currentUser = useContext(CurrentUserContext);

  // Wait until user authentication status is determined
  if (currentUser === undefined) return null;

  return (
    <Route
      {...rest}
      render={(props) =>
        currentUser
          ? Component
            ? <Component {...props} />
            : render?.(props)
          : <Redirect to="/login" />
      }
    />
  );
};

export default PrivateRoute;
