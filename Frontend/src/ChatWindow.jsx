
import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import { MyContext } from "./MyContext.jsx";
import { useContext, useState } from "react";
import { ScaleLoader } from "react-spinners";

function ChatWindow() {
  const {
    prompt,
    setPrompt,
    setReply,
    currThreadId,
    setNewChat,
    setPrevChats,
    setAllThreads,
    token,
    logout,
    user,
    setUser,
  } = useContext(MyContext);

  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState("");

  // Settings states
  const [showSettings, setShowSettings] = useState(false);
  const [username, setUsername] = useState(user || "");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [settingsError, setSettingsError] = useState("");

  const getReply = async () => {
    if (!prompt.trim() || loading) return;

    const userMessage = prompt.trim();

    setPrompt("");
    setReply(null);
    setLoading(true);
    setNewChat(false);
    setError("");

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        message: userMessage,
        threadId: currThreadId,
      }),
    };

    try {
      const response = await fetch("/api/chat", options);
      const data = await response.json();

      if (response.status === 401) {
        logout();
        return;
      }

      if (!response.ok) {
        throw new Error(
          data.error || data.message || "Failed to get AI response",
        );
      }

      setPrevChats((prevChats) => [
        ...prevChats,
        { role: "user", content: userMessage },
        { role: "assistant", content: data.reply },
      ]);

      setReply(data.reply);

      setAllThreads((prevThreads) => {
        const existingThread = prevThreads.some(
          (thread) => thread.threadId === currThreadId,
        );

        if (existingThread) return prevThreads;

        return [
          {
            threadId: currThreadId,
            title: userMessage,
          },
          ...prevThreads,
        ];
      });
    } catch (err) {
      console.log("Chat error:", err);
      setError(err.message);
      setPrompt(userMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileClick = () => {
    setIsOpen(!isOpen);
  };

  const openSettings = () => {
    setUsername(user || "");
    setEmail("");
    setNewPassword("");
    setSettingsError("");
    setIsOpen(false);
    setShowSettings(true);
  };

  const updateProfile = async (e) => {
    e.preventDefault();

    if (!username.trim()) {
      setSettingsError("Username is required");
      return;
    }

    if (newPassword && newPassword.length < 8) {
      setSettingsError("Password must contain at least 8 characters");
      return;
    }

    setSavingProfile(true);
    setSettingsError("");

    try {
      const response = await fetch("/api/auth/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username: username.trim(),
          email: email.trim(),
          newPassword: newPassword,
        }),
      });

      const data = await response.json();

      if (response.status === 401) {
        logout();
        return;
      }

      if (!response.ok) {
        throw new Error(
          data.error || data.message || "Failed to update profile",
        );
      }

      const updatedUsername = data.username || username.trim();

      setUser(updatedUsername);
      localStorage.setItem("username", updatedUsername);

      setEmail("");
      setNewPassword("");
      setShowSettings(false);
    } catch (err) {
      console.error("Profile update error:", err);
      setSettingsError(err.message);
    } finally {
      setSavingProfile(false);
    }
  };

  return (
    <div className="chatWindow">
      <div className="navbar">
        <span>
          SigmaGPT <i className="fa-solid fa-chevron-down"></i>
        </span>

        <div
          className="userIconDiv"
          onClick={handleProfileClick}
          title={user || "Account"}
        >
          <span className="userIcon">
            {user ? (
              user.charAt(0).toUpperCase()
            ) : (
              <i className="fa-solid fa-user"></i>
            )}
          </span>
        </div>
      </div>

      {isOpen && (
        <div className="dropDown">
          <p>{user}</p>

          <button
            className="settingsButton"
            onClick={openSettings}
          >
            <i className="fa-solid fa-gear"></i> Settings
          </button>

          <button
            className="logoutButton"
            onClick={logout}
          >
            <i className="fa-solid fa-arrow-right-from-bracket"></i> Log out
          </button>
        </div>
      )}

      {showSettings && (
        <div className="settingsOverlay">
          <div className="settingsModal">
            <div className="settingsModalHeader">
              <h2>Account Settings</h2>

              <button
                className="settingsCloseButton"
                onClick={() => setShowSettings(false)}
              >
                &times;
              </button>
            </div>

            <form onSubmit={updateProfile}>
              <label>Update Username</label>

              <input
                className="settingsInput"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                minLength={3}
                maxLength={30}
              />

              <label>Update Email</label>

              <input
                className="settingsInput"
                type="email"
                placeholder="Enter new email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <label>Change Password</label>

              <input
                className="settingsInput"
                type="password"
                placeholder="New password (leave blank to keep current)"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />

              {settingsError && (
                <p className="settingsError">{settingsError}</p>
              )}

              <button
                className="saveSettingsButton"
                type="submit"
                disabled={savingProfile}
              >
                {savingProfile ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </div>
        </div>
      )}

      <Chat />

      {loading && <ScaleLoader color="#fff" loading={loading} />}

      {error && (
        <p className="chatError">
          {error}
        </p>
      )}

      <div className="chatInput">
        <div className="inputBox">
          <input
            placeholder="Ask anything"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                getReply();
              }
            }}
            disabled={loading}
          />

          <div
            id="submit"
            onClick={getReply}
            style={{
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            <i className="fa-solid fa-paper-plane"></i>
          </div>
        </div>

        <p className="info">
          SigmaGPT can make mistakes. Check important info.
        </p>
      </div>
    </div>
  );
}

export default ChatWindow;
