import { SetUserId, SetQuesId, ChatId, SetToken, AddContact, AddConversations, ChatIndex, AddMessage, AddSocket, PaymentInfo, PersonalObjectId, UpdateAnsId } from "./Constants";

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

const SetPaymentInfo = (paymentInfo) => {
  return {
    type: PaymentInfo,
    payload: paymentInfo,
  };
}

const setPersonalObjectId = (id) => {
  return {
    type: PersonalObjectId,
    payload: id,
  };
}

const updateAnsId = (id) => {
  return {
    type: UpdateAnsId,
    payload: id,
  };
}


export { setUserId, setQuesId, setChatId, setToken, addContact, addConversations, setChatIndex, addMessage, addSocket, SetPaymentInfo, setPersonalObjectId, updateAnsId };
