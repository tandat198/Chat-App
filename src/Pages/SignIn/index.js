import React, { useRef } from "react";
import { withRouter, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { signInStart, signUpStart } from "../../redux/user/user.actions";
import LoadingSpinner from "../../Components/LoadingSpinner";
import "./style.scss";

const SignIn = (props) => {
    const { isAuthenticated, msg, error } = props;
    const email = useRef(null);
    const password = useRef(null);

    const submitForm = (e) => {
        e.preventDefault();
        props.signIn({
            email: email.current.value,
            password: password.current.value,
        });
    };

    if (isAuthenticated) return <Redirect to='/' />;
    return (
        <React.Fragment>
            <div className='signin'>
                <div className='container signin-wrapper'>
                    <h3>Sign In to Your Account</h3>
                    <form onSubmit={submitForm}>
                        <div className='form-item'>
                            <label htmlFor='email'>Email</label>
                            <div className='control-input'>
                                <input defaultValue='tandat198@gmail.com' placeholder='Enter your email' type='email' ref={email} name='email' id='email' className='input' />
                                <span className='msg'>{error?.includes("does not exist") && "Email does not exist"}</span>
                            </div>
                        </div>
                        <div className='form-item'>
                            <label htmlFor='password'>Password</label>
                            <div className='control-input'>
                                <input defaultValue='12345678' placeholder='Enter your password' type='password' ref={password} name='password' id='password' className='input' autoComplete='on' />
                                <span className='msg'>{error.includes("does not match") && "Wrong Password"}</span>
                            </div>
                        </div>
                        <input className='submit-btn' type='submit' value='Sign In' />
                    </form>
                    <div className='not-have-account'>
                        You don't have an account? <span onClick={() => props.history.push("/signup")}>Sign Up Now</span>
                    </div>
                </div>
            </div>
            {msg === "logging in" && <LoadingSpinner />}
        </React.Fragment>
    );
};

const mapStateToProps = (state) => ({
    isAuthenticated: state.user.isAuthenticated,
    msg: state.user.msg,
    error: state.user.error,
});

const mapDispatchToProps = (dispatch) => ({
    signIn: (user) => dispatch(signInStart(user)),
    signUp: (user) => dispatch(signUpStart(user)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(SignIn));
