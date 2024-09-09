import { useEffect, useState } from 'react';
import ChatLogin from './components/ChatLogin';
import { ContactProvider } from './context/ContactProvider';
import { ConversationsProvider } from './context/ConversationProvider';
import { SocketProvider } from './context/SocketProvider';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import OpenConversation from './components/OpenConversation';
import useLocalStorage from './hooks/useLocalStorage';
import SideBar from './components/SideBar';
import Login from './components/Login';
import SignUp from './components/SignUp';
import AskQuestion from './components/AskQuestion';
import NavBar from './components/NavBar';
import NavBar2 from './components/NavBar2';
import About from './components/About';
import User from './components/User';

const App = () => {

  const [id, setId] = useLocalStorage("id", "");

  const [isOnline, setIsOnline] = useState(false);;

  useEffect(() => {
    setIsOnline(true);
    return () => {
      setIsOnline(false);
      console.log("User is offline");
    };
  }, []);

  const sideBar = (
    <SocketProvider id={id}>
      <ContactProvider>
        <ConversationsProvider id={id}>
          <SideBar id={id} />
        </ConversationsProvider>
      </ContactProvider>
    </SocketProvider>
  )

  const openConversation = (
    <SocketProvider id={id}>
      <ContactProvider>
        <ConversationsProvider id={id}>
          <OpenConversation />
        </ConversationsProvider>
      </ContactProvider>
    </SocketProvider>
  )

  return (
    <>
      <Router>
        <NavBar />
        {/* <NavBar2 /> */}

        <Routes>
          <Route exact path="/" element={<About />} />
          <Route exact path='/login' element={<Login />} />
          <Route exact path='/user' element={<User isOnline={isOnline} />} />
          <Route exact path="/signup" element={<SignUp />} />
          <Route exact path='/askQues' element={<AskQuestion />} />
          {/* <Route path="/" element={id ? sideBar : <ChatLogin setId={setId}/>} /> */}
          <Route exact path="/chat" element={openConversation} />
        </Routes>
      </Router>

    </>
  );
}

export default App;
