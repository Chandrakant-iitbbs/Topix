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
function App() {
  const [id, setId] = useLocalStorage("id", "");

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
        {/* <NavBar /> */}
        <NavBar2 />
        <About/>
    
        <Routes>
          <Route exact path='/login' element={<Login />} />
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
