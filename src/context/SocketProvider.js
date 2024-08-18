import { createContext, useContext, useState, useEffect } from 'react';
import io from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => {
  return useContext(SocketContext);
}

export const SocketProvider = (props) => {
  const { id, children } = props;
  const [socket, setSocket] = useState(null);
  useEffect(() => {
    const newSocket = io('http://localhost:6006', { transports: ['websocket'], query: { id } });
    setSocket(newSocket);
    return () => newSocket.close();
  }, [id]);


  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
}

