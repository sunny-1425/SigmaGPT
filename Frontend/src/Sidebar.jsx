
import "./Sidebar.css";
import { useContext, useEffect } from "react";
import { MyContext } from "./MyContext.jsx";
import { v1 as uuidv1 } from "uuid";

const API_BASE_URL = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

function Sidebar() {
    const {
        allThreads,
        setAllThreads,
        currThreadId,
        setNewChat,
        setPrompt,
        setReply,
        setCurrThreadId,
        setPrevChats,
        token,
        logout
    } = useContext(MyContext);

    // Get all threads of the logged-in user
    const getAllThreads = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/thread`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (response.status === 401) {
                logout();
                return;
            }

            if (!response.ok) {
                throw new Error("Failed to fetch threads");
            }

            const res = await response.json();

            const filteredData = Array.isArray(res)
                ? res.map(thread => ({
                    threadId: thread.threadId,
                    title: thread.title
                }))
                : [];

            setAllThreads(filteredData);

        } catch (err) {
            console.error("Fetch threads error:", err);
        }
    };

    // Fetch threads when the user logs in
    useEffect(() => {
        if (token) {
            getAllThreads();
        }
    }, [token]);

    // Create a new chat
    const createNewChat = () => {
        setNewChat(true);
        setPrompt("");
        setReply(null);
        setCurrThreadId(uuidv1());
        setPrevChats([]);
    };

    // Open an existing thread
    const changeThread = async (newThreadId) => {
        try {
            const response = await fetch(
                `${API_BASE_URL}/api/thread/${newThreadId}`,
                {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                }
            );

            if (response.status === 401) {
                logout();
                return;
            }

            if (!response.ok) {
                throw new Error("Failed to fetch chat");
            }

            const res = await response.json();

            setCurrThreadId(newThreadId);
            setPrevChats(res);
            setNewChat(false);
            setReply(null);

        } catch (err) {
            console.error("Open thread error:", err);
        }
    };

    // Delete a thread
    const deleteThread = async (threadId) => {
        try {
            const response = await fetch(
                `${API_BASE_URL}/api/thread/${threadId}`,
                {
                    method: "DELETE",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                }
            );

            if (response.status === 401) {
                logout();
                return;
            }

            if (!response.ok) {
                throw new Error("Failed to delete thread");
            }

            setAllThreads(prevThreads =>
                prevThreads.filter(
                    thread => thread.threadId !== threadId
                )
            );

            if (threadId === currThreadId) {
                createNewChat();
            }

        } catch (err) {
            console.error("Delete thread error:", err);
        }
    };

    return (
        <section className="sidebar">

            <button onClick={createNewChat}>
                <img
                    src="src/assets/blacklogo.png"
                    alt="SigmaGPT logo"
                    className="logo"
                />

                <span>
                    <i className="fa-solid fa-pen-to-square"></i>
                </span>
            </button>

            <ul className="history">
                {allThreads?.map((thread) => (
                    <li
                        key={thread.threadId}
                        onClick={() => changeThread(thread.threadId)}
                        className={
                            thread.threadId === currThreadId
                                ? "highlighted"
                                : ""
                        }
                    >
                        {thread.title}

                        <i
                            className="fa-solid fa-trash"
                            onClick={(e) => {
                                e.stopPropagation();
                                deleteThread(thread.threadId);
                            }}
                        ></i>
                    </li>
                ))}
            </ul>

            <div className="sign">
                <p>By Sunny Ranpise &hearts;</p>
            </div>

        </section>
    );
}

export default Sidebar;
