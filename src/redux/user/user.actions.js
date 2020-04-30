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
});

export const signOutSuccess = () => ({
    type: userActionTypes.SIGN_OUT_SUCCESS
});

export const uploadProfileStart = data => ({
    type: userActionTypes.UPLOAD_PROFILE_START,
    payload: data
});

export const uploadProfileSuccess = url => ({
    type: userActionTypes.UPLOAD_PROFILE_SUCCESS,
    payload: url
})

export const uploadCoverStart = data => ({
    type: userActionTypes.UPLOAD_COVER_START,
    payload: data
})

export const uploadCoverSuccess = url => ({
    type: userActionTypes.UPLOAD_COVER_SUCCESS,
    payload: url
})

export const setCurrentUser = user => ({
    type: userActionTypes.SET_CURRENT_USER,
    payload: user
})