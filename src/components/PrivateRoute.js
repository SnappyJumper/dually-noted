import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import { CurrentUserContext } from "../App";

// PrivateRoute.js
const PrivateRoute = ({ component: Component, render, ...rest }) => {
    const currentUser = useContext(CurrentUserContext);
  
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