import { useEffect, useState } from 'react';
import ChatLogin from './components/ChatLogin';
import { ContactProvider } from './context/ContactProvider';
import { ConversationsProvider } from './context/ConversationProvider';
import { SocketProvider } from './context/SocketProvider';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import OpenConversation from './components/OpenConversation';
import SideBar from './components/SideBar';
import Login from './components/Login';
import SignUp from './components/SignUp';
import AskQuestion from './components/AskQuestion';
import NavBar from './components/NavBar';
import About from './components/About';
import User from './components/User';
import Users from './components/Users';
import Questions from './components/Questions';
import Question from './components/Question';
import Profile from './components/Profile';
import { useSelector, useDispatch} from "react-redux";
import { setOnline} from "./Redux/Actions"
const App = () => {
  const UserId = useSelector(state => state.UserId);
  const QuesId = useSelector(state => state.QuesId);
  const dispatch = useDispatch();

  const id = useSelector(state => state.ChatId);

  useEffect(() => {
    dispatch(setOnline(true));
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
        <Routes>
          <Route exact path="/" element={<About />} />
          <Route exact path='/about' element={<About />} />
          <Route exact path='/login' element={<Login  />} />
          <Route exact path='/user' element={<User  />} />
          <Route exact path={`/profile/${UserId}`} element={<Profile />} />
          <Route exact path='/users' element={<Users  />} />
          <Route exact path='/questions' element={<Questions />} />
          <Route exact path={`/question/${QuesId}`} element={<Question />} />
          <Route exact path="/signup" element={<SignUp  />} />
          <Route exact path='/askQues' element={<AskQuestion />} />
          <Route exact path="/chatting" element={id ? sideBar : <ChatLogin />} />
          <Route exact path="/chat" element={openConversation} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
