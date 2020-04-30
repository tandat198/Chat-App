import groupActionTypes from "./group.types";

export const getGroupsStart = () => ({
    type: groupActionTypes.GET_GROUPS_START
});

export const getGroupSuccess = groups => ({
    type: groupActionTypes.GET_GROUPS_SUCCESS,
    payload: groups
});

export const getGroupsFailure = err => ({
    type: groupActionTypes.GET_GROUPS_FAILURE,
    payload: err
});

export const getUsersInGroupStart = id => ({
    type: groupActionTypes.GET_USERS_IN_GROUP_START,
    payload: id
});

export const getUsersInGroupSuccess = users => ({
    type: groupActionTypes.GET_USERS_IN_GROUP_SUCCESS,
    payload: users
});

export const createGroupStart = body => ({
    type: groupActionTypes.CREATE_GROUP_START,
    payload: body
});

export const createGroupSuccess = group => ({
    type: groupActionTypes.CREATE_GROUP_SUCCESS,
    payload: group
});

export const deleteGroupStart = id => ({
    type: groupActionTypes.DELETE_GROUP_START,
    payload: id
});

export const deleteGroupSuccess = (id, msg) => ({
    type: groupActionTypes.DELETE_GROUP_SUCCESS,
    payload: { id, msg }
});

export const addUserStart = data => ({
    type: groupActionTypes.ADD_USER_START,
    payload: data
});

export const addUserSuccess = user => ({
    type: groupActionTypes.ADD_USER_SUCCESS,
    payload: user
});

export const addUserFailure = err => ({
    type: groupActionTypes.ADD_USER_FAILURE,
    payload: err
});

export const getMessagesOfGroupStart = (groupId, index) => ({
    type: groupActionTypes.GET_MESSAGES_OF_GROUP_START,
    payload: { groupId, listIndex: index }
});

export const getMessagesOfGroupSuccess = (messages, index, listIndex) => ({
    type: groupActionTypes.GET_MESSAGES_OF_GROUP_SUCCESS,
    payload: {
        messages,
        index,
        lastIndex: listIndex
    }
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

export const addMsgToStore = msg => ({
    type: groupActionTypes.ADD_MESSAGE_TO_STORE,
    payload: msg
});

export const joinRoomStart = room => ({
    type: groupActionTypes.JOIN_ROOM_START,
    payload: { room }
})