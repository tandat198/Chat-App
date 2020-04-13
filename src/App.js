import React from "react";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store";
import HomePage from './Pages/HomePage/index'
import SignIn from "./Pages/SignIn";
import "./App.scss";

class App extends React.Component {
    render() {
        const authenticate = Page => {
            const token = localStorage.getItem("token");
            if (!token) return <Redirect to='/signin' />;
            return <Page />;
        };

        return (
            <Provider store={store}>
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
            </Provider>
        );
    }
}

export default App
