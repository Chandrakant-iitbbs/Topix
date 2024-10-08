import { useEffect } from 'react';
import ChatLogin from './components/ChatLogin';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import OpenConversation from './components/OpenConversation';
import SideBar from './components/SideBar';
import Login from './components/Login';
import SignUp from './components/SignUp';
import AskQuestion from './components/AskQuestion';
import NavBarBeforeLogin from './components/NavBarBeforeLogin';
import NavbarAfterLogin from './components/NavbarAfterLogin';
import About from './components/About';
import User from './components/User';
import Users from './components/Users';
import Questions from './components/Questions';
import Question from './components/Question';
import Profile from './components/Profile';
import { useSelector, useDispatch } from "react-redux";
import { addSocket, addMessage } from "./Redux/Actions"
import io from 'socket.io-client';
import Payment from './components/Payment';
import EditAnswer from './components/EditAnswer';
import EditQuestion from './components/EditQuestion';

const App = () => {
  const UserId = useSelector(state => state.UserId);
  const QuesId = useSelector(state => state.QuesId);
  const socket = useSelector(state => state.socket);
  const dispatch = useDispatch();
  const chatId = useSelector(state => state.ChatId);
  const chatIndex = useSelector(state => state.ChatIndex);
  const updateAnsId = useSelector(state => state.updateAnsId);
  useEffect(() => {
    const newSocket = io('http://localhost:6006', { transports: ['websocket'], query: { chatId } });
    dispatch(addSocket(newSocket));
    return () =>{
      newSocket.close();
    }
  }, [chatId]);

  useEffect(() => {
    if (!socket) return;
    socket.on('receive-message', ({ recipients, text, senderId }) => {
      dispatch(addMessage(recipients, text, senderId));
    });
    return () => socket.off('receive-message');
  }, [socket, dispatch]);

  const token = useSelector(state => state.Token);
  console.log(token);

  return (
    <>
      <Router>
      {token!==null ? <NavbarAfterLogin /> : <NavBarBeforeLogin />}
        <Routes>
          <Route exact path='/payment' element={<Payment  />} />
          <Route exact path="/" element={<About />} />
          <Route exact path='/about' element={<About />} />
          <Route exact path='/login' element={<Login />} />
          <Route exact path='/user' element={<User />} />
          <Route exact path='/user/editProfile' element={<SignUp edit={true} />} />
          <Route exact path={`/editAnswer/${updateAnsId}`} element={< EditAnswer />} />
          <Route exact path={`/editQuestion/${QuesId}`} element={<EditQuestion />} />
          <Route exact path={`/profile/${UserId}`} element={<Profile />} />
          <Route exact path='/users' element={<Users />} />
          <Route exact path='/questions' element={<Questions />} />
          <Route exact path={`/question/${QuesId}`} element={<Question />} />
          <Route exact path="/signup" element={<SignUp edit={false} />} />
          <Route exact path='/askQues' element={<AskQuestion />} />
          <Route exact path="/chatting" element={chatId ? <SideBar /> : <ChatLogin />} />
          <Route exact path={`/chat/${chatIndex}`} element={<OpenConversation />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
