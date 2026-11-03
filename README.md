# 🌌 SigmaGPT – AI Chat Application

SigmaGPT is a full-stack AI-powered chat application built using React, Node.js, Express.js, and MongoDB. It integrates Google's Gemini API to generate AI responses and provides a clean chat interface with secure user authentication and individual conversation histories.

## 🚀 Features

- 🤖 **AI-Powered Chat:** Generate intelligent responses using Google's Gemini API.
- 🔐 **Secure Authentication:** User registration and login using JWT and password hashing with Bcrypt.
- 👤 **Account Management:** Update username, email, and password through account settings.
- 💬 **Chat Management:** Create new conversations, access previous chats, and delete chat threads.
- 🔒 **Private Conversations:** Each user's chat history is associated with their account, preventing access by other users.
- 📝 **Markdown Support:** Render formatted AI responses, including headings, lists, code blocks, and syntax highlighting.
- 🎨 **Clean User Interface:** Dark-themed interface with a simple and user-friendly chat experience.
- 🗄️ **Database Integration:** Store user accounts and conversation histories using MongoDB.

## 🛠️ Tech Stack

### Frontend
- **Library:** React.js
- **Build Tool:** Vite
- **Styling:** Vanilla CSS
- **Markdown Rendering:** React Markdown
- **Syntax Highlighting:** Rehype Highlight and Highlight.js
- **Icons:** Font Awesome

### Backend
- **Runtime Environment:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB Atlas
- **ODM:** Mongoose
- **AI Integration:** Google Gemini API
- **Authentication:** JSON Web Tokens (JWT)
- **Password Security:** Bcrypt.js

## 📂 Project Structure

```text
SigmaGPT/
│
├── Backend/
│   ├── models/
│   │   ├── User.js
│   │   └── Thread.js
│   │
│   ├── routes/
│   │   ├── auth.js
│   │   └── chat.js
│   │
│   ├── utils/
│   │   ├── gemini.js
│   │   └── authMiddleware.js
│   │
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── Frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── Auth.jsx
│   │   ├── Chat.jsx
│   │   ├── ChatWindow.jsx
│   │   ├── ChatWindow.css
│   │   ├── Sidebar.jsx
│   │   └── MyContext.jsx
│   │
│   ├── public/
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
└── README.md
```

## 🔑 Environment Variables

Create a `.env` file inside the `Backend` directory and configure the following environment variables:

```env
# MongoDB Database
MONGODB_URI=your_mongodb_connection_string

# JWT Authentication
JWT_SECRET=your_secure_jwt_secret

# Google Gemini API
GEMINI_API_KEY=your_gemini_api_key
```

**Important:** Keep your API keys and database credentials private. Never commit your `.env` file to GitHub.

## ⚙️ Installation & Setup

Follow these steps to run SigmaGPT locally.

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/SigmaGPT.git

cd SigmaGPT
```

Replace `your-username` with your GitHub username and update the repository URL if necessary.

### 2. Setup the Backend

Open a terminal and navigate to the Backend directory:

```bash
cd Backend

npm install
```

Create the `.env` file and add your MongoDB connection string, JWT secret, and Gemini API key.

Start the backend server:

```bash
npm run dev
```

The backend server runs on:

```text
http://localhost:8080
```

### 3. Setup the Frontend

Open another terminal and navigate to the Frontend directory:

```bash
cd Frontend

npm install

npm run dev
```

Vite will start the frontend development server. Open the local URL displayed in your terminal (usually `http://localhost:5173`).

### 4. Start Chatting

1. Create a new account using the Signup page.
2. Log in to your SigmaGPT account.
3. Start a new conversation.
4. Ask questions and receive AI-generated responses powered by Gemini.
5. Access your previous conversations from the chat sidebar.

## 🔐 Authentication & Security

SigmaGPT implements a JWT-based authentication system to protect user accounts and conversations.

- Passwords are hashed using Bcrypt before being stored.
- JWT tokens are used to authenticate protected API requests.
- Authentication middleware verifies incoming requests.
- Chat operations are scoped to the authenticated user's ID.
- Users can access and manage only their own conversations.

## 🔮 Future Improvements

- 🎙️ **Voice Interaction:** Add speech-to-text and text-to-speech capabilities.
- 🔄 **Multiple AI Models:** Allow users to switch between different AI models.
- 🖼️ **Image Support:** Enable image-based conversations and AI image generation.
- 🎨 **UI Enhancements:** Further improve the interface and mobile experience.
- ⚡ **Performance Improvements:** Optimize chat loading and response handling.

## 🤝 Contributions

Contributions, suggestions, and feedback are welcome!

1. Fork the repository.
2. Create a new feature branch:

   ```bash
   git checkout -b feature/YourFeature
   ```

3. Commit your changes:

   ```bash
   git commit -m "Add YourFeature"
   ```

4. Push your branch:

   ```bash
   git push origin feature/YourFeature
   ```

5. Open a Pull Request.

---

**Created with ❤️ by Sunny Ranpise**

