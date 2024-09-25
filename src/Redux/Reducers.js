import { SetUserId, SetQuesId, IsOnline, ChatId, setToken } from "./Constants"

const initialState = {
    UserId: localStorage.getItem("userId") || "",
    QuesId: localStorage.getItem("quesId") || "",
    IsOnline: false,
    ChatId: localStorage.getItem("chatId") || "",
    Token: localStorage.getItem("auth-token") || ""
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
        
        case IsOnline:
            return {
                ...state,
                IsOnline: action.payload
            }
        case ChatId:
            localStorage.setItem("chatId", action.payload)
            return {
                ...state,
                ChatId: action.payload
            }
        case setToken:
            localStorage.setItem("auth-token", action.payload)
            return {
                ...state,
                Token: action.payload
            }
        default:
            return state
    }
}

export default reducers;
