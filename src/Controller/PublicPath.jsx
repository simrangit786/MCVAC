import React from "react";
import { Redirect, Route } from "react-router-dom";
import { routes } from "./Routes";
import { isLoggedIn } from "./localStorageHandler";

export const PublicRoute = ({ component: Component, restricted, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      isLoggedIn() && restricted ? (
        <Redirect
          to={{ pathname: routes.dashboard, state: { from: props.location } }}
        />
      ) : (
        <Component {...props} {...rest} />
      )
    }
  />
);
