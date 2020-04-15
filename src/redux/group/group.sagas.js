import { takeEvery, takeLatest, call, put, fork, all } from "redux-saga/effects";
import io from "socket.io-client";
import groupActionTypes from "./group.types";
import api from "../../api";
import { createGroupSuccess, getGroupSuccess, deleteGroupSuccess, addUserSuccess, getUsersInGroupSuccess, getMessagesOfGroupSuccess } from "./group.actions";

const socket = io.connect("https://young-falls-17697.herokuapp.com/api", { autoConnect: true });

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
        yield put(deleteGroupSuccess(group._id, message));
    } catch (err) {
        console.log(err);
    }
}

export function* addUser({ payload }) {
    try {
        const { user } = yield call(api.post, "/groups/addUser", payload);
        yield put(addUserSuccess(user));
    } catch (err) {
        console.log(err);
    }
}

export function* addNewMsg({ payload }) {
    try {
        const user = JSON.parse(localStorage.getItem("user"));
        const sendData = payload;
        sendData.user = user;
        yield socket.emit("room", sendData);

        yield socket.on("connect", function* () {
            console.log(sendData);
            yield socket.on("sendMsgFromServer", function* (data) {
                console.log(sendData);
                const datas = yield data;
                console.log(datas);
            });
        });
    } catch (err) {
        console.log(err);
    }
}

export function* getMessagesOfGroup({ payload }) {
    try {
        const { messages } = yield call(api.get, `/groupMessages/?groupId=${payload}`);
        yield put(getMessagesOfGroupSuccess(messages));
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

export function* onAddMsg() {
    yield takeEvery(groupActionTypes.ADD_NEW_MESSAGE_START, addNewMsg);
}

export function* groupSagas() {
    yield all([
        fork(onGetGroup),
        fork(onGetUsersInGroup),
        fork(onGetMessagesOfGroup),
        fork(onCreateGroup),
        fork(onDeleteGroup),
        fork(onAddUser),
        fork(onAddMsg)
    ]);
}
