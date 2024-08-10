import  { useEffect, useState } from 'react';

const useLocalStorage = (key, initialVal) => {

    const [value, setValue] = useState(() => {
        const jsonValue = localStorage.getItem(key);
        if(jsonValue != null) return JSON.parse(jsonValue);
        if(typeof initialVal === 'function'){
            return initialVal();
        }
        else{
            return initialVal;
        }
    });
    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(value));
    }, [key,value]);

    return [value, setValue];
}

export default useLocalStorage;
