import { all, fork } from "redux-saga/effects";
import { userSagas } from "./user/user.sagas";
import { groupSagas } from "./group/group.sagas";

export default function* rootSaga() {
    yield all([fork(userSagas), fork(groupSagas)]);
}
