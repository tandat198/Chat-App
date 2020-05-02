import { takeEvery, takeLatest, call, put, fork, all, take, apply } from "redux-saga/effects";
import { eventChannel } from 'redux-saga'
import groupActionTypes from "./group.types";
import api from "../../api";
import {
    createGroupSuccess,
    getGroupSuccess,
    deleteGroupSuccess,
    addUserSuccess,
    getUsersInGroupSuccess,
    getMessagesOfGroupSuccess,
    addNewMessageSuccess,
} from "./group.actions";
import { signOutStart } from "../user/user.actions";

const io = require('socket.io-client');

function* checkForbiddenStatus(successFunc, res, successKey) {
    const dataSendToStore = {};
    successKey.map(key => res[key] ? dataSendToStore[key] = res[key] : null)
    if (Object.keys(dataSendToStore).length) {
        yield put(successFunc(dataSendToStore))
    } else if (res.status === 403) {
        yield put(signOutStart())
    }
}

function* createGroup({ payload }) {
    const res = yield call(api.post, "/groups", payload);
    yield call(checkForbiddenStatus, createGroupSuccess, res, ["group"])
}

function* getGroups() {
    const res = yield call(api.get, "/groups");
    yield call(checkForbiddenStatus, getGroupSuccess, res, ["groups"])
}

function* getUsersInGroup({ payload }) {
    const res = yield call(api.get, `/groups/${payload}/getUsers`);
    yield call(checkForbiddenStatus, getUsersInGroupSuccess, res, ["users"])
}

function* deleteGroup({ payload }) {
    const res = yield call(api.delete, `/groups/${payload}`);
    yield call(checkForbiddenStatus, deleteGroupSuccess, res, ["group", "message"])
}

function* addUser({ payload }) {
    const res = yield call(api.post, "/groups/addUser", payload);
    yield call(checkForbiddenStatus, addUserSuccess, res, ["user"])
}

function* getMessagesOfGroup({ payload: { skip, groupId } }) {
    const limit = 15;
    const res = yield call(api.get, `/groupMessages/?groupId=${groupId}&limit=${limit}&skip=${skip}`);
    yield call(checkForbiddenStatus, getMessagesOfGroupSuccess, res, ["messages"])
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

function* onGetGroup() {
    yield takeLatest(groupActionTypes.GET_GROUPS_START, getGroups);
}

function* onGetUsersInGroup() {
    yield takeEvery(groupActionTypes.GET_USERS_IN_GROUP_START, getUsersInGroup);
}

function* onGetMessagesOfGroup() {
    yield takeLatest(groupActionTypes.GET_MESSAGES_OF_GROUP_START, getMessagesOfGroup);
}

function* onCreateGroup() {
    yield takeLatest(groupActionTypes.CREATE_GROUP_START, createGroup);
}

function* onDeleteGroup() {
    yield takeLatest(groupActionTypes.DELETE_GROUP_START, deleteGroup);
}

function* onAddUser() {
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
