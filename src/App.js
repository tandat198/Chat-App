import React from "react";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import ChatPage from "./Pages/ChatPage";
import SignIn from "./Pages/SignIn";
import Header from "./Components/Header";
import HomePage from "./Pages/HomePage";
import Profile from "./Pages/Profile";
import checkTokenValid from './utils/checkTokenValid'
import { setCurrentUser, signOutStart } from "./redux/user/user.actions";
import { connect } from "react-redux";
import "./App.scss";

class App extends React.PureComponent {
    componentDidMount() {
        const decoded = checkTokenValid();
        if (decoded) {
            this.props.setUser(decoded)
        } else {
            this.props.signOut()
        }
    }

    render() {
        const authenticate = (Page, withHeader = true) => {
            const { isAuthenticated } = this.props;
            if (!isAuthenticated) return <Redirect to='/signin' />;
            return (
                <React.Fragment>
                    {withHeader && <Header />}
                    <Page />
                </React.Fragment>
            )
        };

        return (
            <Router>
                <Switch>
                    <Route
                        exact
                        path='/signin'
                        render={() => {
                            const { isAuthenticated } = this.props
                            if (isAuthenticated) return <Redirect to='/' />;
                            return <SignIn />;
                        }}
                    />
                    <Route exact path='/profile/:userId' render={() => authenticate(Profile)} />
                    <Route exact path='/' render={() => authenticate(HomePage)} />
                    <Route exact path='/chat' render={() => authenticate(ChatPage, false)} />

                </Switch>
            </Router>
        );
    }
}

const mapStateToProps = (state) => ({
    isAuthenticated: state.user.isAuthenticated
})

const mapDispatchToProps = () => dispatch => ({
    setUser: (user) => dispatch(setCurrentUser(user)),
    signOut: () => dispatch(signOutStart())
})

export default connect(mapStateToProps, mapDispatchToProps)(App);
