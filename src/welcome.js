import React from "react";
import { HashRouter, Route, Link } from "react-router-dom";

import Registration from "./registration";
import Login from "./login";

export default class Welcome extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <HashRouter>
                <div className="welcome">
                    <h1>Welcome Octagon!</h1>
                    <img className="welcomeLogo" src="/img/octagonoLogo.png" />
                    <div>
                        <Route exact path="/" component={Registration} />
                        <Route path="/login" component={Login} />
                    </div>
                    <Link to="/login" className="loginRoute">
                        {" "}
                        Log in{" "}
                    </Link>
                </div>
            </HashRouter>
        );
    }
}
