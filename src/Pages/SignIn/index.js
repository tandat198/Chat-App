import React, { useState, useRef } from "react";
import { withRouter, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { signInStart, signUpStart } from "../../redux/user/user.actions";
import LoadingSpinner from "../../Components/LoadingSpinner";
import "./style.scss";

const SignIn = props => {
    const { isAuthenticated, msg, error } = props;
    // SIGN IN
    const email = useRef(null);
    const password = useRef(null);

    // SIGN UP
    const emailSignUp = useRef(null);
    const name = useRef(null);
    const passwordSignUp = useRef(null);
    const confirmPassword = useRef(null);

    const [displayForm, setDisplayForm] = useState(false);

    const toggleForm = () => {
        setDisplayForm(!displayForm);
    };

    const submitFormSignIn = e => {
        e.preventDefault();
        props.signIn({
            email: email.current.value,
            password: password.current.value
        });
    };

    const submitFormSignUp = e => {
        e.preventDefault();
        props.signUp({
            email: emailSignUp.current.value,
            password: passwordSignUp.current.value,
            confirmPassword: confirmPassword.current.value,
            name: name.current.value
        });
    };

    if (isAuthenticated) return <Redirect to='/' />;
    return (
        <React.Fragment>
            <div className='signin'>
                <div className='container signin-wrapper'>
                    <h3>Sign In to Your Account</h3>
                    <form onSubmit={submitFormSignIn}>
                        <div className='form-item'>
                            <label htmlFor='email'>Email</label>
                            <div className='control-input'>
                                <input defaultValue='tandat198@gmail.com' placeholder='Enter your email' type='email' ref={email} name='email' id='email' className='input' />
                            </div>
                            <span className='msg'>{error.includes("does not exist") && "Email does not exist"}</span>
                        </div>
                        <div className='form-item'>
                            <label htmlFor='password'>Password</label>
                            <div className='control-input'>
                                <input defaultValue='12345678' placeholder='Enter your password' type='password' ref={password} name='password' id='password' className='input' autoComplete='on' />
                            </div>
                            <span className='msg'>{error.includes("does not match") && "Wrong Password"}</span>
                        </div>
                        <input className='submit-btn' type='submit' value='Sign In' />
                    </form>
                    <div className='not-have-account'>
                        You don't have an account? <span onClick={toggleForm}>Sign Up Now</span>
                    </div>
                </div>
            </div>
            {msg === "logging in" && <LoadingSpinner />}
            {displayForm && (
                <div className='signup'>
                    <div className='signup-container'>
                        <span onClick={toggleForm} className='close-btn'>
                            &times;
                        </span>
                        <h3>Sign Up New Account</h3>
                        <form onSubmit={submitFormSignUp}>
                            <div className='form-item'>
                                <label htmlFor='email-signup'>Email</label>
                                <div className='control-input'>
                                    <input placeholder='Enter your email' type='email' ref={emailSignUp} id='email-signup' className='input' />
                                </div>
                            </div>
                            <div className='form-item'>
                                <label htmlFor='name-signup'>Name</label>
                                <div className='control-input'>
                                    <input placeholder='Enter your fullname' type='text' ref={name} id='name-signup' className='input' />
                                </div>
                            </div>
                            <div className='form-item'>
                                <label htmlFor='password-signup'>Password</label>
                                <div className='control-input'>
                                    <input placeholder='Enter your password' type='password' ref={passwordSignUp} id='password-signup' className='input' autoComplete='off' />
                                </div>
                            </div>
                            <div className='form-item'>
                                <label htmlFor='password2-signup'>Confirm Password</label>
                                <div className='control-input'>
                                    <input placeholder='Confirm Your Password' type='password' ref={confirmPassword} id='password2-signup' className='input' autoComplete='off' />
                                </div>
                            </div>
                            <div className='form-item'>
                                <input className='submit-btn' type='submit' value='Sign Up' />
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </React.Fragment>
    );
};

const mapStateToProps = state => ({
    isAuthenticated: state.user.isAuthenticated,
    msg: state.user.msg,
    error: state.user.error
});

const mapDispatchToProps = dispatch => ({
    signIn: user => dispatch(signInStart(user)),
    signUp: user => dispatch(signUpStart(user))
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(SignIn));
