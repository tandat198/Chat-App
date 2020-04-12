import userActionTypes from "./user.types";

const INITIAL_STATE = {
    currentUser: null,
    isAuthenticated: false,
    error: null
};

const token = localStorage.getItem("token");

const userReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case userActionTypes.SIGN_IN_SUCCESS:
            return {
                ...state,
                isAuthenticated: true,
                error: null
            };
        case userActionTypes.SIGN_UP_SUCCESS:
            return {
                ...state,
                currentUser: action.payload,
                isAuthenticated: true,
                error: null
            };
        default:
            return state;
    }
};

export default userReducer;
