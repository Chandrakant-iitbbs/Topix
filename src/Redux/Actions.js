import {
    SetUserId
} from "./Constants"

const setUserId = (id) => {
    return {
        type: SetUserId,
        payload: id
    }
}

export {
    setUserId
}