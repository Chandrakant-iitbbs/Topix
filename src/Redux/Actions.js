import { SetUserId, SetQuesId, IsOnline, ChatId, SetToken } from "./Constants";

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
} 

export { setUserId, setQuesId, setOnline, setChatId,setToken };
