import { takeLatest, put, all, call, fork } from "redux-saga/effects";
import userActionTypes from "./user.types";
import { signInSuccess, signInFailure, signUpSuccess, signOutSuccess, uploadProfileSuccess, uploadCoverSuccess } from "./user.actions";
import api from "../../api";

export function* signIn({ payload }) {
    const res = yield call(api.post, "users/signin", payload);
    if (res.token) {
        const { token, user } = res;
        localStorage.setItem("token", token);
        yield put(signInSuccess(user));
    } else {
        yield put(signInFailure(res.error))
    }

}

export function* signUp({ payload }) {
    const res = yield call(api.post, "users/signup", payload);
    if (res.token) {
        const { token, user } = res;
        localStorage.setItem("token", token);
        yield put(signUpSuccess(user));
    } else {
        yield put(signInFailure(res.error));
    }
}

export function* signout() {
    localStorage.clear("token", "user");
    yield put(signOutSuccess());
}

export function* uploadProfile({ payload }) {
    const formData = new FormData();
    formData.append('profile', payload)
    const resAfterUpload = yield call(api.post, "users/upload", formData, 'formData');
    const { linkUrl } = resAfterUpload

    if (linkUrl) {
        const res = yield call(api.post, 'users/updateProfilePhoto', { linkUrl })
        const profileUrl = res.linkUrl;
        if (profileUrl) {
            yield put(uploadProfileSuccess(profileUrl))
        }
    }
}

export function* uploadCover({ payload }) {
    const formData = new FormData();
    formData.append('profile', payload)
    const resAfterUpload = yield call(api.post, "users/upload", formData, 'formData');
    const { linkUrl } = resAfterUpload

    if (linkUrl) {
        const res = yield call(api.post, 'users/updateCoverPhoto', { linkUrl })
        const coverUrl = res.linkUrl;
        if (coverUrl) {
            yield put(uploadCoverSuccess(coverUrl))
        }
    }
}

export function* onSignIn() {
    yield takeLatest(userActionTypes.SIGN_IN_START, signIn);
}

export function* onSignUp() {
    yield takeLatest(userActionTypes.SIGN_UP_START, signUp);
}

export function* onSignOut() {
    yield takeLatest(userActionTypes.SIGN_OUT_START, signout);
}

export function* onUploadProfile() {
    yield takeLatest(userActionTypes.UPLOAD_PROFILE_START, uploadProfile);
}

export function* onUploadCover() {
    yield takeLatest(userActionTypes.UPLOAD_COVER_START, uploadCover);
}

export function* userSagas() {
    yield all([fork(onSignIn), fork(onSignUp), fork(onSignOut), fork(onUploadCover), fork(onUploadProfile)]);
}
