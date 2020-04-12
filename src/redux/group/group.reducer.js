import groupActionTypes from "./group.types";

const INITIAL_STATE = {
    groups: [],
    error: null,
    loading: false,
    msg: null
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case groupActionTypes.GET_GROUPS_SUCCESS:
            return {
                ...state,
                groups: state.groups.concat(action.payload)
            };
        case groupActionTypes.CREATE_GROUP_START:
            return {
                ...state,
                loading: true,
                msg: null
            };
        case groupActionTypes.CREATE_GROUP_SUCCESS:
            return {
                ...state,
                groups: state.groups.concat(action.payload),
                loading: false,
                msg: "success"
            };
        default:
            return state;
    }
};
