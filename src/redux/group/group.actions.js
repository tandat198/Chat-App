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

export const createGroupStart = body => ({
    type: groupActionTypes.CREATE_GROUP_START,
    payload: body
});

export const createGroupSuccess = group => ({
    type: groupActionTypes.CREATE_GROUP_SUCCESS,
    payload: group
});
