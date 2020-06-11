import userActionTypes from "./user.types";

const INITIAL_STATE = {
    currentUser: null,
    isAuthenticated: false,
    error: "",
    msg: "",
};

const userReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case userActionTypes.SIGN_IN_START:
            return {
                ...state,
                msg: "logging in",
            };
        case userActionTypes.SIGN_IN_SUCCESS:
            return {
                ...state,
                currentUser: action.payload,
                isAuthenticated: true,
                error: "",
                msg: "",
            };
        case userActionTypes.SIGN_IN_FAILURE:
            return {
                ...state,
                msg: "",
                error: action.payload,
            };
        case userActionTypes.SIGN_UP_START:
            return {
                ...state,
                msg: "logging in",
            };
        case userActionTypes.SIGN_UP_SUCCESS:
            return {
                ...state,
                currentUser: action.payload,
                isAuthenticated: true,
                error: "",
                msg: "",
            };
        case userActionTypes.SIGN_UP_FAILURE:
            return {
                ...state,
                msg: "",
                error: action.payload,
            };
        case userActionTypes.SIGN_OUT_START:
            return {
                ...state,
            };
        case userActionTypes.SIGN_OUT_SUCCESS:
            return {
                ...state,
                currentUser: null,
                isAuthenticated: false,
            };
        case userActionTypes.UPLOAD_PROFILE_SUCCESS:
            return {
                ...state,
                currentUser: { ...state.currentUser, profilePhoto: action.payload },
            };
        case userActionTypes.UPLOAD_COVER_SUCCESS:
            return {
                ...state,
                currentUser: { ...state.currentUser, coverPhoto: action.payload },
            };
        case userActionTypes.SET_CURRENT_USER:
            return {
                ...state,
                currentUser: action.payload,
                isAuthenticated: true,
            };
        default:
            return state;
    }
};

export default userReducer;
