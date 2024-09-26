import { createContext, useContext, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import io from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => {
  return useContext(SocketContext);
}

export const SocketProvider = (props) => {
  const { children } = props;
  const chatId= useSelector(state => state.ChatId);
  const [socket, setSocket] = useState(null);
  useEffect(() => {
    const newSocket = io('http://localhost:6006', { transports: ['websocket'], query: { chatId } });
    setSocket(newSocket);
    return () => newSocket.close();
  }, [chatId]);


  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
}

