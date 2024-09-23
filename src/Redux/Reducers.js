import {SetUserId} from "./Constants"

const initialState = {
    UserId: localStorage.getItem("userId") || ""
}

const reducers = (state = initialState, action) => {
    switch (action.type) {
        case SetUserId:
            localStorage.setItem("userId", action.payload)
            return {
                ...state,
                UserId: action.payload
            }
        default:
            return state
    }
}

export default reducers;
