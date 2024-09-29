import { SetUserId, SetQuesId, IsOnline, ChatId, SetToken, AddContact, AddConversations, ChatIndex, AddMessage, AddSocket } from "./Constants";

const setUserId = (id) => {
  return {
    type: SetUserId,
    payload: id,
  };
};

const setQuesId = (id) => {
  return {
    type: SetQuesId,
    payload: id,
  };
};

const setOnline = (status) => {
  return {
    type: IsOnline,
    payload: status,
  };
};

const setChatId = (id) => {
  return {
    type: ChatId,
    payload: id,
  };
}

const setToken = (token) => {
  localStorage.setItem("auth-token", token);
  return {
    type: SetToken,
    payload: token,
  };
};

const addContact = (chatId, name) => {
  return {
    type: AddContact,
    payload: { chatId, name },
  };
};

const addConversations = (ContactIds, message) => {
  return {
    type: AddConversations,
    payload: { ContactIds, message },
  };
};

const setChatIndex = (index) => {
  return {
    type: ChatIndex,
    payload: index,
  };
};

const addMessage = (recipients, text, chatId) => {
  return {
    type: AddMessage,
    payload: { recipientIds: recipients, text, senderId: chatId },
  };
};

const addSocket = (socket) => {
  return {
    type: AddSocket,
    payload: socket,
  };
}


export { setUserId, setQuesId, setOnline, setChatId, setToken, addContact, addConversations, setChatIndex, addMessage, addSocket };
