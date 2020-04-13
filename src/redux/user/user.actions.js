import userActionTypes from "./user.types";

export const signInStart = user => ({
    type: userActionTypes.SIGN_IN_START,
    payload: user
});

export const signInSuccess = user => ({
    type: userActionTypes.SIGN_IN_SUCCESS,
    payload: user
});

export const signInFailure = err => ({
    type: userActionTypes.SIGN_IN_FAILURE,
    payload: err
});

export const signUpStart = user => ({
    type: userActionTypes.SIGN_UP_START,
    payload: user
});

export const signUpSuccess = user => ({
    type: userActionTypes.SIGN_UP_SUCCESS,
    payload: user
});

export const signUpFailure = err => ({
    type: userActionTypes.SIGN_UP_FAILURE,
    payload: err
});

export const signOutStart = () => ({
    type: userActionTypes.SIGN_OUT_START
})

export const signOutSuccess = () => ({
    type: userActionTypes.SIGN_OUT_SUCCESS
})