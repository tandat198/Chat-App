import groupActionTypes from "./group.types";

const INITIAL_STATE = {
    groups: [],
    users: [],
    messages: [],
    error: null,
    loading: "",
    msg: null,
    skip: 0
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
                groups: action.payload.groups,
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
                users: action.payload.users,
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
                groups: state.groups.concat(action.payload.group),
                loading: "",
                msg: "Create group successfully",
                error: null
            };
        case groupActionTypes.DELETE_GROUP_START:
            return {
                ...state,
                loading: "deleting"
            };
        case groupActionTypes.DELETE_GROUP_SUCCESS:
            return {
                ...state,
                groups: state.groups.filter(group => group.id !== action.payload.group.id),
                messages: [],
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
                users: state.users.concat(action.payload.user),
                loading: "",
                msg: "Add user successfully",
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
                loading: "loading messages",
                messages: action.payload.skip === 0 ? [] : state.messages
            };
        case groupActionTypes.GET_MESSAGES_OF_GROUP_SUCCESS:
            return {
                ...state,
                loading: '',
                messages: action.payload.messages.concat(state.messages),
                msg: state.skip === 0 ? "first time load messages" : "next load messages",
                skip: action.payload.messages.length ? state.skip + 15 : 0,
                error: null,
            };
        case groupActionTypes.ADD_NEW_MESSAGE_START:
            return {
                ...state,
                msg: ''
            }
        case groupActionTypes.ADD_NEW_MESSAGE_SUCCESS:
            return {
                ...state,
                msg: 'added messages',
                messages: state.messages.concat(action.payload),
                error: null
            };
        default:
            return state;
    }
};
