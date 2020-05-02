import groupActionTypes from "./group.types";

export const getGroupsStart = () => ({
    type: groupActionTypes.GET_GROUPS_START
});

export const getGroupSuccess = data => ({
    type: groupActionTypes.GET_GROUPS_SUCCESS,
    payload: data
});

export const getGroupsFailure = err => ({
    type: groupActionTypes.GET_GROUPS_FAILURE,
    payload: err
});

export const getUsersInGroupStart = id => ({
    type: groupActionTypes.GET_USERS_IN_GROUP_START,
    payload: id
});

export const getUsersInGroupSuccess = data => ({
    type: groupActionTypes.GET_USERS_IN_GROUP_SUCCESS,
    payload: data
});

export const createGroupStart = body => ({
    type: groupActionTypes.CREATE_GROUP_START,
    payload: body
});

export const createGroupSuccess = data => ({
    type: groupActionTypes.CREATE_GROUP_SUCCESS,
    payload: data
});

export const deleteGroupStart = id => ({
    type: groupActionTypes.DELETE_GROUP_START,
    payload: id
});

export const deleteGroupSuccess = data => ({
    type: groupActionTypes.DELETE_GROUP_SUCCESS,
    payload: data
});

export const addUserStart = data => ({
    type: groupActionTypes.ADD_USER_START,
    payload: data
});

export const addUserSuccess = data => ({
    type: groupActionTypes.ADD_USER_SUCCESS,
    payload: data
});

export const addUserFailure = err => ({
    type: groupActionTypes.ADD_USER_FAILURE,
    payload: err
});

export const getMessagesOfGroupStart = (groupId, skip) => ({
    type: groupActionTypes.GET_MESSAGES_OF_GROUP_START,
    payload: { groupId, skip }
});

export const getMessagesOfGroupSuccess = data => ({
    type: groupActionTypes.GET_MESSAGES_OF_GROUP_SUCCESS,
    payload: data
});

export const addNewMessageStart = (user, room, msg) => ({
    type: groupActionTypes.ADD_NEW_MESSAGE_START,
    payload: {
        user,
        msg,
        room
    }
});

export const addNewMessageSuccess = msg => ({
    type: groupActionTypes.ADD_NEW_MESSAGE_SUCCESS,
    payload: msg
});

export const joinRoomStart = room => ({
    type: groupActionTypes.JOIN_ROOM_START,
    payload: { room }
})