import { takeEvery, call, put, fork, all } from "redux-saga/effects";
import groupActionTypes from "./group.types";
import api from "../../api";
import { createGroupSuccess, getGroupSuccess } from "./group.actions";

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

export function* onCreateGroup() {
    yield takeEvery(groupActionTypes.CREATE_GROUP_START, createGroup);
}

export function* onGetGroup() {
    yield takeEvery(groupActionTypes.GET_GROUPS_START, getGroups);
}

export function* groupSagas() {
    yield all([fork(onCreateGroup), fork(onGetGroup)]);
}
