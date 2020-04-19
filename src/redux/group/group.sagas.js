import { takeEvery, takeLatest, take, call, put, fork, all, delay, apply } from "redux-saga/effects";
import io from "socket.io-client";
import groupActionTypes from "./group.types";
import api from "../../api";
import {
    createGroupSuccess,
    getGroupSuccess,
    deleteGroupSuccess,
    addUserSuccess,
    getUsersInGroupSuccess,
    getMessagesOfGroupSuccess,
    addUserFailure,
    addNewMessageSuccess
} from "./group.actions";
import { eventChannel } from "redux-saga";
//https://young-falls-17697.herokuapp.com
function connect() {
    const socket = io("http://localhost:5000");
    return new Promise(resolve => {
        socket.on("connect", () => {
            resolve(socket);
        });
    });
}

const createSocketChannel = socket =>
    eventChannel(emit => {
        const messageHandler = data => {
            emit(data);
        };
        const errorHandler = errorEvent => {
            emit(new Error(errorEvent));
        };

        socket.on("sendMsgFromServer", messageHandler);
        socket.on("error", errorHandler);
        const unsubscribe = () => {
            socket.off("sendMsgFromServer", messageHandler);
        };
        return unsubscribe;
    });

function* sendMsgFromServer(socket) {
    yield delay(3000);
    yield apply(socket, socket.emit, ["sendMsgFromServer"]);
}

const listenServerSaga = function* () {
    // connect to the server
    const socket = yield call(connect);

    // then create a socket channel
    const socketChannel = yield call(createSocketChannel, socket);

    // then put the new data into the reducer
    while (true) {
        try {
            // yield takeEvery(groupActionTypes.ADD_NEW_MESSAGE_START, sendMsg);

            const payload = yield take(socketChannel);
            if (payload.text) {
                yield put(addNewMessageSuccess(payload));
            }
            yield fork(sendMsgFromServer, socket);
        } catch (err) {
            console.log("socket error:", err);
        }
    }
};

export function* sendMsg({ payload }) {
    const socket = yield call(connect);
    const sendData = payload;
    const user = JSON.parse(localStorage.getItem("user"));
    sendData.user = user;
    socket.emit("room", sendData);
}

// export function* onAddMessage() {
//     yield takeEvery(groupActionTypes.ADD_MESSAGE_TO_STORE, );
// }

// export function* onWatchSendMsg() {
//     yield takeEvery(groupActionTypes.ADD_NEW_MESSAGE_START, sendMsg);
// }

// export const startStopChannel = function* () {
//     while (true) {
//         const payload = yield take(groupActionTypes.ADD_NEW_MESSAGE_START);
//         console.log(payload);
//         yield fork(listenServerSaga,)
//     }
// };

// export function subscribe(socket) {
//     return new eventChannel(emit => {
//         const update = data => {
//             console.log("listened data", data);
//             const sendData = {
//                 room: {
//                     id: "5e969682b5fd860017a391a3"
//                 }
//             };
//             return emit("room", sendData);
//         };

//         console.log("socket listening on get data");
//         socket.on("sendMsgFromServer", update);
//         return () => {};
//     });
// }

// function* read(socket) {
//     const channel = yield call(subscribe, socket);
//     while (true) {
//         let action = yield take(channel);
//         console.log("action", action);
//         yield put(action);
//     }
// }

// export function* write(socket) {
//     while (true) {
//         const data = yield take(groupActionTypes.ADD_NEW_MESSAGE_START);
//         const user = JSON.parse(localStorage.getItem("user"));
//         console.log("saga title", data.payload);
//         const sendData = data.payload;
//         sendData.user = user;
//         socket.emit("room", sendData);
//     }
// }

// export function* flow() {
//     yield take(groupActionTypes.ADD_NEW_MESSAGE_START);
//     const socket = yield call(connect);
//     yield fork(read, socket);
//     yield fork(write, socket);
// }
// const socket = io.connect("https://young-falls-17697.herokuapp.com", { autoConnect: true });

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

// export function* addNewMsg({ payload }) {
//     try {
//         const user = JSON.parse(localStorage.getItem("user"));
//         const sendData = payload;
//         sendData.user = user;
//         yield socket.emit("room", sendData);

//         yield socket.on("connect", function* () {
//             console.log(sendData);
//             yield socket.on("sendMsgFromServer", function* (data) {
//                 console.log(sendData);
//                 const datas = yield data;
//                 console.log(datas);
//             });
//         });
//     } catch (err) {
//         console.log(err);
//     }
// }

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

// export function* onAddMsg() {
//     yield takeEvery(groupActionTypes.ADD_NEW_MESSAGE_START, addNewMsg);
// }

export function* groupSagas() {
    yield all([
        fork(onGetGroup),
        fork(onGetUsersInGroup),
        fork(onGetMessagesOfGroup),
        fork(onCreateGroup),
        fork(onDeleteGroup),
        fork(onAddUser),
        // fork(onWatchSendMsg),
        fork(listenServerSaga)
        // fork(startStopChannel)
        // fork(flow)
        // fork(onAddMsg)
    ]);
}
