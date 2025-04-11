import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import { CurrentUserContext } from "../App";

const PrivateRoute = ({ component: Component, render, ...rest }) => {
  const currentUser = useContext(CurrentUserContext);

  // Don't render until we know if user is logged in or not
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
