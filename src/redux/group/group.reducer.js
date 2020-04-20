import groupActionTypes from "./group.types";

const INITIAL_STATE = {
    groups: [],
    users: [],
    messages: [],
    error: null,
    loading: "",
    msg: null,
    index: -15
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
                loading: "modal",
                msg: "",
                users: []
            };
        case groupActionTypes.GET_USERS_IN_GROUP_SUCCESS:
            return {
                ...state,
                users: action.payload,
                loading: "",
                msg: "get users successfully",
                error: null
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
                msg: "create new successfully",
                error: null
            };
        case groupActionTypes.DELETE_GROUP_START:
            return {
                ...state,
                loading: "delete"
            };
        case groupActionTypes.DELETE_GROUP_SUCCESS:
            return {
                ...state,
                groups: state.groups.filter(group => group.id !== action.payload.id),
                msg: action.payload.msg,
                loading: "",
                error: null
            };
        case groupActionTypes.ADD_USER_START:
            return {
                ...state,
                loading: "modal",
                msg: ""
            };
        case groupActionTypes.ADD_USER_SUCCESS:
            return {
                ...state,
                users: state.users.concat(action.payload),
                loading: "",
                msg: "add new successfully",
                error: null
            };
        case groupActionTypes.ADD_USER_FAILURE:
            return {
                ...state,
                loading: "",
                error: action.payload
            };
        case groupActionTypes.GET_MESSAGES_OF_GROUP_START:
            return {
                ...state,
                msg: "",
                messages: action.payload.listIndex === -15 ? [] : state.messages
            };
        case groupActionTypes.GET_MESSAGES_OF_GROUP_SUCCESS:
            return {
                ...state,
                messages: action.payload.messages.concat(state.messages),
                index: action.payload.index,
                error: null,
                msg: action.payload.lastIndex === -15 ? "first load" : "next load"
            };
        case groupActionTypes.ADD_NEW_MESSAGE_SUCCESS:
            return {
                ...state,
                messages: state.messages.concat(action.payload),
                error: null
            };
        case groupActionTypes.ADD_MESSAGE_TO_STORE:
            return {
                ...state,
                messages: state.messages.concat(action.payload),
                msg: "added to store"
            };
        default:
            return state;
    }
};
