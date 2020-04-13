import userActionTypes from "./user.types";

const INITIAL_STATE = {
    currentUser: null,
    isAuthenticated: false,
    error: null
};

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
        case userActionTypes.SIGN_OUT_START:
            return {
                ...state,

            }
        case userActionTypes.SIGN_OUT_SUCCESS:
            return {
                ...state,
                currentUser: null,
                isAuthenticated: false
            }
        default:
            return state;
    }
};

export default userReducer;
