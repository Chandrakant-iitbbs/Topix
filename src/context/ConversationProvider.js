import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import useLocalStorage from '../hooks/useLocalStorage.js';
import { useContacts } from './ContactProvider.js';
import { useSocket } from './SocketProvider.js';

const ConversationContext = createContext();

export const useConversations = () => {
  return useContext(ConversationContext);
}

export const ConversationsProvider = (props) => {
  const { children, id } = props;
  const socket = useSocket();

  const [conversations, setConversations] = useLocalStorage("conversations", []);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const { contacts } = useContacts();

  const createConversation = (selectedContactIds) => {
    setConversations((prevConversations) => {
      return [...prevConversations, { selectedContactIds, message: [] }];
    });
  };

  const formattedConversations = conversations.map((conversation, index) => {
    const recipients = conversation.selectedContactIds.map((recipient) => {
      const contact = contacts.find((contact) => {
        return contact.id === recipient;
      })
      const name = (contact && contact.name) || recipient;
      return { id: recipient, name }
    });

    const message = conversation.message.map((message) => {
      const contact = contacts.find(contact => {
        return contact.id === message.sender;
      });

      const name = (contact && contact.name) || message.sender;
      const fromMe = id === message.sender;
      return { ...message, senderName: name, fromMe }
    });

    const selected = index === selectedIndex;
    return { ...conversation, message, recipients, selected };
  })


  const addMessageToConversation = useCallback(({ recipients, text, sender }) => {
    setConversations((prevConversations) => {
      let madeChange = false;

      const newMessage = { sender, text };

      const newConversations = prevConversations.map((conversation) => {
        if (IsArrayEqual(conversation.selectedContactIds, recipients)) {
          madeChange = true;
          return { ...conversation, message: [...conversation.message, newMessage] };
        }
        return conversation;
      });

      if (madeChange) {
        return newConversations;
      }
      else {
        return [...prevConversations, { selectedContactIds: recipients, message: [newMessage] }]
      }
    });
  }, [setConversations])

  useEffect(() => {
    if (!socket) {
      return;
    }
    socket.on('receive-message', addMessageToConversation);
    return () => socket.off('receive-message', addMessageToConversation);
  }, [socket, addMessageToConversation])


  const sendMessage = (recipients, text) => {
    socket.emit('send-message', { recipients, text });
    addMessageToConversation({ recipients, text, sender: id })
  }

  return (
    <ConversationContext.Provider value={{
      sendMessage:sendMessage, 
      conversations: formattedConversations,
      selectedConversation: formattedConversations[selectedIndex],
      createConversation: createConversation, 
      selectedIndex: setSelectedIndex
    }}>
      {children}
    </ConversationContext.Provider>
  );
}

const IsArrayEqual = (a, b) => {
  if (a.length !== b.length) return false;
  a.sort();
  b.sort();
  return a.forEach((element,index) => {
    return element === b[index];
  });
}
