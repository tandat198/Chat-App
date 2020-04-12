import { combineReducers } from "redux";

import user from "./user/user.reducer";
import group from "./group/group.reducer";

export default combineReducers({
    user,
    group
});
