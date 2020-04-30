import { takeEvery, takeLatest, call, put, fork, all, take, apply } from "redux-saga/effects";
import { eventChannel } from 'redux-saga'
import io from 'socket.io-client';
import groupActionTypes from "./group.types";
import api from "../../api";
import {
    createGroupSuccess,
    getGroupSuccess,
    getGroupsFailure,
    deleteGroupSuccess,
    addUserSuccess,
    getUsersInGroupSuccess,
    getMessagesOfGroupSuccess,
    addUserFailure,
    addNewMessageSuccess
} from "./group.actions";

export function* createGroup({ payload }) {
    const res = yield call(api.post, "/groups", payload);

    if (res.group) {
        yield put(createGroupSuccess(res.group));
    }
}

export function* getGroups() {
    const res = yield call(api.get, "/groups");
    if (res.groups) {
        yield put(getGroupSuccess(res.groups));
    } else {
        yield put(getGroupsFailure(res.error));
    }
}

export function* getUserInGroup({ payload }) {
    const res = yield call(api.get, `/groups/${payload}/getUsers`);
    if (res.users) {
        yield put(getUsersInGroupSuccess(res.users));
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
            yield put(getMessagesOfGroupSuccess(messages, index, listIndex));
        }
    } catch (err) {
        console.log(err);
    }
}

function createWebSocketConnection() {
    const socket = io('https://chat-app-datng.herokuapp.com');
    return new Promise(resolve => {
        socket.on('connect', () => {
            resolve(socket);
        });
    });
}

function createSocketChannel(socket) {
    return eventChannel(emit => {
        const msgHandler = event => {
            emit(event)
        }

        socket.on("sendMsgFromServer", msgHandler)

        const unsubscribe = () => {
            socket.off('sendMsgFromServer', msgHandler)
        }

        return unsubscribe
    })
}

function* sendMsg(socket, { payload }) {
    yield apply(socket, socket.emit, ['room', payload])
}

function* joinRoom(socket, { payload }) {
    yield apply(socket, socket.emit, ["joinRoom", payload])
}

export function* watchOnMsg(socket) {
    const socketChannel = yield call(createSocketChannel, socket);

    while (true) {
        try {
            const payload = yield take(socketChannel)
            if (payload.senderId) {
                yield put(addNewMessageSuccess(payload))
            }
        } catch (error) {

        }
    }
}

function* onSendMsg(socket) {
    yield takeEvery(groupActionTypes.ADD_NEW_MESSAGE_START, sendMsg, socket)
}

function* onJoinRoom(socket) {
    yield takeLatest(groupActionTypes.JOIN_ROOM_START, joinRoom, socket)
}

function* webSocketFlow() {
    const socket = yield call(createWebSocketConnection);
    yield fork(onJoinRoom, socket)
    yield fork(watchOnMsg, socket)
    yield fork(onSendMsg, socket)
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
    yield all([
        fork(onGetGroup),
        fork(onGetUsersInGroup),
        fork(onGetMessagesOfGroup),
        fork(onCreateGroup),
        fork(onDeleteGroup),
        fork(onAddUser),
        fork(webSocketFlow)
    ]);
}
