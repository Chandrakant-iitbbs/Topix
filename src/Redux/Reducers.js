import { SetUserId, SetQuesId, IsOnline, ChatId, setToken, AddContact } from "./Constants"

const initialState = {
    UserId: localStorage.getItem("userId") || "",
    QuesId: localStorage.getItem("quesId") || "",
    IsOnline: false,
    ChatId: localStorage.getItem("chatId") || "",
    Token: localStorage.getItem("auth-token") || "",
    contacts: JSON.parse(localStorage.getItem("contacts")) || [],
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
        case AddContact:
            let contacts = state.contacts;
            contacts= [...contacts, action.payload];
            localStorage.setItem("contacts", JSON.stringify(contacts));
            return {
                ...state,
                contacts: contacts
            }
        default:
            return state;
    }
}

export default reducers;
