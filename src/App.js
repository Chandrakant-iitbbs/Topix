import ChatLogin from './components/ChatLogin';
import { ContactProvider } from './context/ContactProvider';
import { ConversationsProvider } from './context/ConversationProvider';
import {SocketProvider} from './context/SocketProvider';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import OpenConversation from './components/OpenConversation';
import useLocalStorage from './hooks/useLocalStorage';
import SideBar from './components/SideBar';
import Login from './components/Login';
import SignUp from './components/SignUp';
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
        <Routes>
          <Route path='/login' element={<Login/>} /> 
          <Route path="/signup" element={<SignUp/>} />
          {/* <Route path="/" element={id ? sideBar : <ChatLogin setId={setId}/>} /> */}
          <Route path="/chat" element={openConversation} />
        </Routes>
      </Router>

    </>
  );
}

export default App;
