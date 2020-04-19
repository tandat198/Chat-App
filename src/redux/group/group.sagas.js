import { takeEvery, takeLatest, call, put, fork, all } from "redux-saga/effects";
import groupActionTypes from "./group.types";
import api from "../../api";
import {
    createGroupSuccess,
    getGroupSuccess,
    deleteGroupSuccess,
    addUserSuccess,
    getUsersInGroupSuccess,
    getMessagesOfGroupSuccess,
    addUserFailure
} from "./group.actions";

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
        const { users } = yield call(api.get, `/groups/${payload}/getUsers`);
        yield put(getUsersInGroupSuccess(users));
    } catch (error) {
        console.log(error);
    }
}

export function* deleteGroup({ payload }) {
    try {
        const { group, message } = yield call(api.delete, `/groups/${payload}`);
        yield put(deleteGroupSuccess(group.id, message));
    } catch (err) {
        console.log(err);
    }
}

export function* addUser({ payload }) {
    const res = yield call(api.post, "/groups/addUser", payload);
    if (res.user) yield put(addUserSuccess(res.user));
    yield put(addUserFailure(res.error));
}

export function* getMessagesOfGroup({ payload: { listIndex, groupId } }) {
    try {
        if (listIndex) {
            const { messages, index } = yield call(api.get, `/groupMessages/?groupId=${groupId}&index=${listIndex}`);
            yield put(getMessagesOfGroupSuccess(messages, index));
        }
    } catch (err) {
        console.log(err);
    }
}

export function* onGetGroup() {
    yield takeLatest(groupActionTypes.GET_GROUPS_START, getGroups);
}

export function* onGetUsersInGroup() {
    yield takeEvery(groupActionTypes.GET_USERS_IN_GROUP_START, getUserInGroup);
}

export function* onGetMessagesOfGroup() {
    yield takeLatest(groupActionTypes.GET_MESSAGES_OF_GROUP_START, getMessagesOfGroup);
}

export function* onCreateGroup() {
    yield takeLatest(groupActionTypes.CREATE_GROUP_START, createGroup);
}

export function* onDeleteGroup() {
    yield takeLatest(groupActionTypes.DELETE_GROUP_START, deleteGroup);
}

export function* onAddUser() {
    yield takeLatest(groupActionTypes.ADD_USER_START, addUser);
}

export function* groupSagas() {
    yield all([fork(onGetGroup), fork(onGetUsersInGroup), fork(onGetMessagesOfGroup), fork(onCreateGroup), fork(onDeleteGroup), fork(onAddUser)]);
}
