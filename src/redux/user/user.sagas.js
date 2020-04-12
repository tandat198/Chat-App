import { takeLatest, put, all, call, fork } from "redux-saga/effects";
import userActionTypes from "./user.types";
import { signInSuccess, signInFailure, signUpSuccess } from "./user.actions";
import api from "../../api";

export function* signIn({ payload }) {
    try {
        const data = yield call(api.post, "users/signin", payload);
        console.log(data);
        const { token, user } = data;
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("token", token);
        yield put(signInSuccess());
    } catch (err) {
        console.log(err);
        yield put(signInFailure(err));
    }
}

export function* signUp({ payload }) {
    try {
        const data = yield call(api.post, "users/signup", payload);
        const { token, user } = data;
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("token", token);
        yield put(signUpSuccess(user));
    } catch (err) {
        yield put(signInFailure(err));
    }
}

export function* onSignIn() {
    yield takeLatest(userActionTypes.SIGN_IN_START, signIn);
}

export function* onSignUp() {
    yield takeLatest(userActionTypes.SIGN_UP_START, signUp);
}

export function* userSagas() {
    yield all([fork(onSignIn), fork(onSignUp)]);
}
