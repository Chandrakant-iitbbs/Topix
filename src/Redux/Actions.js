import { SetUserId, SetQuesId } from "./Constants";

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

export { setUserId, setQuesId };
