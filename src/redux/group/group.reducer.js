import groupActionTypes from "./group.types";

const INITIAL_STATE = {
    groups: [],
    users: [],
    error: null,
    loading: "",
    msg: null
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case groupActionTypes.GET_GROUPS_START:
            return {
                ...state,
                loading: "main"
            };
        case groupActionTypes.GET_GROUPS_SUCCESS:
            return {
                ...state,
                groups: action.payload,
                loading: ""
            };
        case groupActionTypes.GET_USERS_IN_GROUP_START:
            return {
                ...state,
                loading: "modal"
            };
        case groupActionTypes.GET_USERS_IN_GROUP_SUCCESS:
            return {
                ...state,
                users: action.payload,
                loading: "",
                msg: "get users successfully"
            };
        case groupActionTypes.CREATE_GROUP_START:
            return {
                ...state,
                loading: "modal",
                msg: ""
            };
        case groupActionTypes.CREATE_GROUP_SUCCESS:
            return {
                ...state,
                groups: state.groups.concat(action.payload),
                loading: "",
                msg: "create new successfully"
            };
        case groupActionTypes.DELETE_GROUP_START:
            return {
                ...state,
                loading: "delete"
            };
        case groupActionTypes.DELETE_GROUP_SUCCESS:
            return {
                ...state,
                groups: state.groups.filter(group => group._id !== action.payload.id),
                msg: action.payload.msg,
                loading: ""
            };
        case groupActionTypes.ADD_USER_START:
            return {
                ...state,
                loading: "modal"
            };
        case groupActionTypes.ADD_USER_SUCCESS:
            return {
                ...state,
                users: state.users.concat(action.payload),
                loading: "",
                msg: "add new successfully"
            };
        default:
            return state;
    }
};
