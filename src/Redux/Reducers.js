import { SetUserId, SetQuesId } from "./Constants"

const initialState = {
    UserId: localStorage.getItem("userId") || "",
    QuesId: localStorage.getItem("quesId") || ""
}

const reducers = (state = initialState, action) => {
    switch (action.type) {
        case SetUserId:
            localStorage.setItem("userId", action.payload)
            return {
                ...state,
                UserId: action.payload
            }
        case SetQuesId:
            localStorage.setItem("quesId", action.payload)
            return {
                ...state,
                QuesId: action.payload
            }
        default:
            return state
    }
}

export default reducers;
