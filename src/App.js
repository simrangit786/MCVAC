import React from "react";
import "./App.css";
import "./assets/css/bootstrap.min.css";
import "antd/dist/antd.css";
import "./assets/css/custom.css";
import "jquery";
import "popper.js";
import "bootstrap/dist/js/bootstrap.min";
import {Router} from "react-router-dom";
import {history} from "./Controller/history";
import Login from "./Components/auth/Login";
import ForgotPassword from "./Components/auth/ForgotPassword";
import Main from "./Components/Main";
import LogOut from "./Components/Logout";
import {PublicRoute} from "./Controller/PublicPath";
import {routes} from "./Controller/Routes";
import PrivateRoute from "./Controller/PrivatePath";
import {getEnvValue} from "./Controller/Environment";
import * as Sentry from "@sentry/react";


if (process.env.NODE_ENV === "production") {
    Sentry.init({
        dsn: getEnvValue("REACT_APP_SENTRY_DNS"), // integrations: [new BrowserTracing()],
        tracesSampleRate: 1.0,
    });
}

function App() {
    return (<Sentry.ErrorBoundary fallback={<p>An error has occurred</p>}>
        <div id="app_main" className="App text-left">
            <Router history={history} getUserConfirmation={null}>
                <PublicRoute restricted exact path={routes.login} component={Login}/>
                <PublicRoute
                    restricted
                    exact
                    path={routes.forget_password}
                    component={ForgotPassword}
                />
                <PublicRoute exact path={routes.logout} component={LogOut}/>
                <PrivateRoute path={routes.dashboard.self} component={Main}/>

            </Router>
        </div>
    </Sentry.ErrorBoundary>);
}


export default App;
