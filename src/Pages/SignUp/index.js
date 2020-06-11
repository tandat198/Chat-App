import React, { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signUpStart } from "../../redux/user/user.actions";
import "./style.scss";

const SignUp = () => {
    const dispatch = useDispatch();
    const error = useSelector((state) => state.user.error);
    const emailSignUp = useRef(null);
    const name = useRef(null);
    const passwordSignUp = useRef(null);
    const confirmPassword = useRef(null);

    const submitFormSignUp = (e) => {
        e.preventDefault();
        dispatch(
            signUpStart({
                email: emailSignUp.current.value,
                password: passwordSignUp.current.value,
                confirmPassword: confirmPassword.current.value,
                name: name.current.value,
            })
        );
    };

    console.log(error);

    return (
        <div className='signup'>
            <div className='signup-container'>
                <h3>Sign Up New Account</h3>
                <form onSubmit={submitFormSignUp}>
                    <div className='form-item'>
                        <label htmlFor='email-signup'>Email</label>
                        <div className='control-input'>
                            <input placeholder='Enter your email' type='email' ref={emailSignUp} id='email-signup' className='input' />
                            <span className='msg'>
                                {error?.email?.includes("exists") && "Email already exists"}
                                {error?.email?.includes("enter") && "Please enter your email"}
                            </span>
                        </div>
                    </div>
                    <div className='form-item'>
                        <label htmlFor='name-signup'>Name</label>
                        <div className='control-input'>
                            <input placeholder='Enter your fullname' type='text' ref={name} id='name-signup' className='input' />
                            <span className='msg'>{error?.name?.includes("enter") && "Please enter your name"}</span>
                        </div>
                    </div>
                    <div className='form-item'>
                        <label htmlFor='password-signup'>Password</label>
                        <div className='control-input'>
                            <input placeholder='Enter your password' type='password' ref={passwordSignUp} id='password-signup' className='input' autoComplete='off' />
                            <span className='msg'>
                                {error?.password?.includes("too weak") && "Password is too weak"}
                                {error?.password?.includes("enter") && "Please enter your password"}
                            </span>
                        </div>
                    </div>
                    <div className='form-item'>
                        <label htmlFor='password2-signup'>Confirm Password</label>
                        <div className='control-input'>
                            <input placeholder='Confirm Your Password' type='password' ref={confirmPassword} id='password2-signup' className='input' autoComplete='off' />
                            <span className='msg'>
                                {error?.confirmPassword?.includes("not match") && "Password and Confirm password do not match"}
                                {error?.confirmPassword?.includes("enter") && "Please enter your confirm password"}
                            </span>
                        </div>
                    </div>
                    <div className='form-item'>
                        <input className='submit-btn' type='submit' value='Sign Up' />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SignUp;
