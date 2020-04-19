import React from "react";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";

import HomePage from "./Pages/HomePage";
import SignIn from "./Pages/SignIn";
import "./App.scss";

class App extends React.PureComponent {
    render() {
        const authenticate = Page => {
            const token = localStorage.getItem("token");
            if (!token) return <Redirect to='/signin' />;
            return <Page />;
        };

        return (
            <Router>
                <Switch>
                    <Route
                        exact
                        path='/signin'
                        render={() => {
                            const token = localStorage.getItem("token");
                            if (token) return <Redirect to='/' />;
                            return <SignIn />;
                        }}
                    />
                    <Route exact path='/' render={() => authenticate(HomePage)} />
                </Switch>
            </Router>
        );
    }
}

export default App;
