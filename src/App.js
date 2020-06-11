import React from "react";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import ChatPage from "./Pages/ChatPage";
import SignIn from "./Pages/SignIn";
import SignUp from "./Pages/SignUp";
import Header from "./Components/Header";
import Profile from "./Pages/Profile";
import checkTokenValid from "./utils/checkTokenValid";
import { setCurrentUser, signOutStart } from "./redux/user/user.actions";
import { connect } from "react-redux";
import "./App.scss";

class App extends React.PureComponent {
    componentDidMount() {
        const decoded = checkTokenValid();
        if (decoded) {
            this.props.setUser(decoded);
        } else {
            this.props.signOut();
        }
    }

    authenticate = (Page, withHeader = true) => {
        const { isAuthenticated } = this.props;
        if (!isAuthenticated) return <Redirect to='/signin' />;
        return (
            <React.Fragment>
                {withHeader && <Header />}
                <Page />
            </React.Fragment>
        );
    };
    render() {
        const { isAuthenticated } = this.props;

        return (
            <Router>
                <Switch>
                    <Route
                        exact
                        path='/signin'
                        render={() => {
                            if (isAuthenticated) return <Redirect to='/' />;
                            return <SignIn />;
                        }}
                    />
                    <Route
                        exact
                        path='/signup'
                        render={() => {
                            if (isAuthenticated) return <Redirect to='/' />;
                            return <SignUp />;
                        }}
                    />
                    <Route exact path='/' render={() => this.authenticate(ChatPage, false)} />
                    <Route exact path='/profile/:userId' render={() => this.authenticate(Profile)} />
                </Switch>
            </Router>
        );
    }
}

const mapStateToProps = (state) => ({
    isAuthenticated: state.user.isAuthenticated,
});

const mapDispatchToProps = () => (dispatch) => ({
    setUser: (user) => dispatch(setCurrentUser(user)),
    signOut: () => dispatch(signOutStart()),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
