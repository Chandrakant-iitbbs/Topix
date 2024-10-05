import { SetUserId, SetQuesId, ChatId, setToken, AddContact, AddConversations, ChatIndex, AddMessage, AddSocket, PaymentInfo, PersonalObjectId, UpdateAnsId } from "./Constants"

const initialState = {
    UserId: localStorage.getItem("userId") || "",
    QuesId: localStorage.getItem("quesId") || "",
    ChatId: localStorage.getItem("chatId") || "",
    Token: localStorage.getItem("auth-token") || "",
    contacts: JSON.parse(localStorage.getItem("contacts")) || [],
    conversations: JSON.parse(localStorage.getItem("conversations")) || [],
    ChatIndex: localStorage.getItem("chatIndex") || 0,
    soket: null,
    paymentInfo: {
        UPI_Id: "",
        Amount: ""
    },
    personalObjectId: "",
    updateAnsId: localStorage.getItem("updateAnsId") || ""
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
            contacts = [...contacts, action.payload];
            localStorage.setItem("contacts", JSON.stringify(contacts));
            return {
                ...state,
                contacts: contacts
            }
        case AddConversations: {
            const updatedConversations = [
                ...state.conversations,
                {
                    ContactIds: action.payload.ContactIds,
                    message: action.payload.message
                }
            ];
            localStorage.setItem("conversations", JSON.stringify(updatedConversations));
            return {
                ...state,
                conversations: updatedConversations
            };
        }
        case ChatIndex:
            localStorage.setItem("chatIndex", action.payload);
            return {
                ...state,
                ChatIndex: action.payload
            }
        case AddMessage:
            const { recipientIds, text, senderId } = action.payload;
            let madeChange = false;
            const newMessage = { senderId, text };
            const newConversations = state.conversations.map((conversation) => {
                if (IsArrayEqual(conversation.ContactIds, recipientIds)) {
                    madeChange = true;
                    return {
                        ...conversation,
                        message: [...conversation.message, newMessage],
                    };
                }
                return conversation;
            });

            if (madeChange) {
                localStorage.setItem("conversations", JSON.stringify(newConversations));
                return { ...state, conversations: newConversations };
            } else {
                const newConversations = [
                    ...state.conversations,
                    { ContactIds: recipientIds, message: [newMessage] },
                ];
                localStorage.setItem(
                    "conversations",
                    JSON.stringify(newConversations)
                );

                return {
                    ...state,
                    conversations: newConversations,
                };
            }
        case AddSocket:
            return {
                ...state,
                socket: action.payload
            }
        case PaymentInfo:
            return {
                ...state,
                paymentInfo: {
                    UPI_Id: action.payload.UPI_Id,
                    Amount: action.payload.Amount
                }
            }
        case PersonalObjectId:
            return {
                ...state,
                personalObjectId: action.payload
            }
        case UpdateAnsId:
            localStorage.setItem("updateAnsId", action.payload)
            return {
                ...state,
                updateAnsId: action.payload
            }
        default:
            return state;
    }
}

const IsArrayEqual = (arr1, arr2) => {
    if (arr1.length !== arr2.length) return false;
    arr1.sort();
    arr2.sort();
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) return false;
    }
    return true;
}

export default reducers;
