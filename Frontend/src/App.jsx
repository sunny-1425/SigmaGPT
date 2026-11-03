import './App.css';
import Sidebar from "./Sidebar.jsx";
import ChatWindow from "./ChatWindow.jsx";
import Auth from "./Auth.jsx";
import { MyContext } from "./MyContext.jsx";
import { useState } from "react";
import { v1 as uuidv1 } from "uuid";

function App() {
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState(null);
  const [currThreadId, setCurrThreadId] = useState(uuidv1());
  const [prevChats, setPrevChats] = useState([]);
  const [newChat, setNewChat] = useState(true);
  const [allThreads, setAllThreads] = useState([]);

  // Authentication state
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(() => localStorage.getItem("username"));

  // Logout
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");

    setToken(null);
    setUser(null);

    // Reset chat state
    setPrompt("");
    setReply(null);
    setPrevChats([]);
    setAllThreads([]);
    setNewChat(true);
    setCurrThreadId(uuidv1());
  };

  const providerValues = {
    prompt, setPrompt,
    reply, setReply,
    currThreadId, setCurrThreadId,
    newChat, setNewChat,
    prevChats, setPrevChats,
    allThreads, setAllThreads,
    token, setToken,
    user, setUser,
    logout
  };

  return (
    <div className="app">
      <MyContext.Provider value={providerValues}>
        {token ? (
          <>
            <Sidebar />
            <ChatWindow />
          </>
        ) : (
          <Auth />
        )}
      </MyContext.Provider>
    </div>
  );
}

export default App;
