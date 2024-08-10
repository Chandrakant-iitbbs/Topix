import  { createContext, useContext } from 'react';
import useLocalStorage from '../hooks/useLocalStorage.js';

const ContactContext = createContext();

export const useContacts=()=> {
  return useContext(ContactContext);
}

export const ContactProvider = (props)=> {
  const { children } = props;
  const [contacts, setContacts] = useLocalStorage("contacts", []);
  const createContact = (id, name) => {
    setContacts((prevContacts) => {
      return [...prevContacts, { id, name }];
    });
  };

  return (
    <ContactContext.Provider value={{ contacts, createContact }}>
      {children}
    </ContactContext.Provider>
  );
}

