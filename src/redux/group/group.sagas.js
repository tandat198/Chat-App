import { takeEvery, takeLatest, call, put, fork, all } from "redux-saga/effects";
import groupActionTypes from "./group.types";
import api from "../../api";
import { createGroupSuccess, getGroupSuccess, deleteGroupSuccess, addUserSuccess, getUsersInGroupSuccess } from "./group.actions";

export function* createGroup({ payload }) {
    try {
        const { group } = yield call(api.post, "/groups", payload);
        yield put(createGroupSuccess(group));
    } catch (err) {
        console.log(err);
    }
}

export function* getGroups() {
    try {
        const { groups } = yield call(api.get, "/groups");
        yield put(getGroupSuccess(groups));
    } catch (err) {
        console.log(err);
    }
}

export function* getUserInGroup({ payload }) {
    try {
        const { users } = yield call(api.get, `/groups/${payload}/getUsers`)
        yield put(getUsersInGroupSuccess(users))
    } catch (error) {
        console.log(error)
    }
}

export function* deleteGroup({ payload }) {
    try {
        const { group, message } = yield call(api.delete, `/groups/${payload}`);
        yield put(deleteGroupSuccess(group._id, message))
    } catch (err) {
        console.log(err)
    }
}

export function* addUser({ payload }) {
    try {
        const { user } = yield call(api.post, '/groups/addUser', payload)
        yield put(addUserSuccess(user))
    } catch (err) {
        console.log(err)
    }
}

export function* onGetGroup() {
    yield takeEvery(groupActionTypes.GET_GROUPS_START, getGroups);
}

export function* onGetUsersInGroup() {
    yield takeEvery(groupActionTypes.GET_USERS_IN_GROUP_START, getUserInGroup);
}

export function* onCreateGroup() {
    yield takeLatest(groupActionTypes.CREATE_GROUP_START, createGroup);
}

export function* onDeleteGroup() {
    yield takeLatest(groupActionTypes.DELETE_GROUP_START, deleteGroup)
}

export function* onAddUser() {
    yield takeLatest(groupActionTypes.ADD_USER_START, addUser)
}

export function* groupSagas() {
    yield all([
        fork(onGetGroup),
        fork(onGetUsersInGroup),
        fork(onCreateGroup),
        fork(onDeleteGroup),
        fork(onAddUser)
    ]);
}
