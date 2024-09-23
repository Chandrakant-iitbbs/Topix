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
import Users from './components/Users';
import Questions from './components/Questions';
import Question from './components/Question';
import Profile from './components/Profile';
import { useSelector} from "react-redux";

const App = () => {
  const UserId = useSelector(state => state.UserId);
  const QuesId = useSelector(state => state.QuesId);

  const [id, setId] = useLocalStorage("id", "");

  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    setIsOnline(true);
    return () => {
      setIsOnline(false);
      console.log("User is offline");
    };
  }, []);


  const [token, setToken] = useState(localStorage.getItem("auth-token"));

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
        {token ? <NavBar setToken={setToken} /> : <NavBar2 />}
        <Routes>
          <Route exact path="/" element={<About />} />
          <Route exact path='/about' element={<About />} />
          <Route exact path='/login' element={<Login setToken={setToken} />} />
          <Route exact path='/user' element={<User isOnline={isOnline}  />} />
          <Route exact path={`/profile/${UserId}`} element={<Profile isOnline={isOnline}   />} />
          <Route exact path='/users' element={<Users  />} />
          <Route exact path='/questions' element={<Questions />} />
          <Route exact path={`/question/${QuesId}`} element={<Question />} />
          <Route exact path="/signup" element={<SignUp setToken={setToken} />} />
          <Route exact path='/askQues' element={<AskQuestion />} />
          {/* <Route path="/" element={id ? sideBar : <ChatLogin setId={setId}/>} /> */}
          <Route exact path="/chat" element={openConversation} />
        </Routes>
      </Router>

    </>
  );
}

export default App;
