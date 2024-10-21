# 🏆 Topix - Collaborative Q&A Platform with Rewards

## 🌟 Introduction

Introducing **Topix**, the interactive platform where curiosity meets collaboration! Topix is your go-to app for asking burning questions and being part of a dynamic community that loves solving them. It is designed to foster community-driven knowledge sharing, allowing users to post questions, contribute answers, and earn monetary rewards for providing the best solutions.

---

## 🌟 Why Topix?

Topix brings together learners, experts, and knowledge seekers in an interactive platform. Here, users can:

- **Ask and Answer Questions**: Share your knowledge or seek advice from the community.
- **Earn Money**: Users can receive monetary rewards for providing the best answers to questions.
- **Engage in Real-Time Conversations**: Use instant messaging to discuss topics further.
- **Easily Find Answers**: Sort and filter questions by rewards, topics, or recency for a streamlined experience.

With its intuitive design and rich features, Topix is more than a Q&A platform—it's a hub for collaborative problem-solving.

---

## 🔑 Key Features

- **👨‍👩‍👦 User-Driven Platform**: A platform where users can create profiles, ask questions, and provide answers across a wide range of topics.
- 💰 **Monetary Reward System**: Users can assign money as a reward to encourage high-quality answers. Those who provide the best answers receive the rewards.
- **⭐ User Rating System**: Tracks user activity, including participation, likes received, best answers given, and overall engagement, fostering a competitive and rewarding environment.
- 👍**Upvote/👎Downvote Answers**: Users can upvote or downvote any answer, promoting quality content and allowing for community-driven moderation.
- 💬 **Real-Time Chat**: Enjoy real-time communication with other users through one-on-one and group chats.
- 🔽 **Advanced Question Sorting**: Designed an advanced sorting system for questions based on time, tags, and reward, improving content discovery.
- 👤 **Profile Management**: Enabled users to manage their profiles, questions, and answers with edit and delete functionality.
- 🛡️ **Secure Authentication**: User login and data are protected by JWT-based authentication.
- 📊 **Responsive Design**: Access Topix smoothly from any device, whether desktop or mobile.

---

## 🛠️ Tech Stack

Topix leverages a modern technology stack to provide a scalable and responsive platform:

- 🌐 **Frontend**: React.js for building a dynamic and interactive user interface, with state management using Redux.
- 💻 **Backend**: Node.js with Express.js for handling server-side logic and API endpoints.
- 🗄️ **Database**: MongoDB for efficient and flexible data storage.
- 🔒 **Authentication**: Secure user sessions with JSON Web Tokens (JWT).
- 💬 **Real-time Messaging**: Powered by Socket.IO for real-time chat functionality.

---

## 🚀 Getting Started

### 📋 Prerequisites

To run Topix locally, ensure you have the following installed:

- **Node.js**: [Install Node.js](https://nodejs.org/)
- **MongoDB**: [Install MongoDB](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) for cloud-based databases.

### ⚙️ Installation Steps

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/Chandrakant-iitbbs/Topix.git
   cd Topix

   ```

2. **Install Dependencies for frontend**:

   ```bash
   npm install

   ```

3. **Configure Environment Variables for frontend**:
   Create a .env file in the root directory of frontend and add the following variables:

   ```bash
   REACT_APP_BASE_URI_BACKEND=http://localhost:5000
   REACT_APP_BASE_URI_CHAT_CLIENT=http://localhost:6006
   ```

4. **Install Dependencies for backend**:

   ```bash
   cd ./BackEnd
   npm install

   ```

5. **Configure Environment Variables for backend**:
   Create a .env file in the root directory of backend and add the following variables:

   ```bash
   DATABASE_URL=mongodb://localhost:27017/topix
   JWT_SECRET=CK@K@nt
   CHAT_PORT=6000
   BACKEND_PORT=5000

   ```

6. **Start the Backend Server**:

```bash
   node index.js
```

5. **Run the Frontend**:

```bash
cd ../
npm start
```

## 📁 Project Structure

```bash
Topix/
├── src/               # Source code for the frontend application
|   ├── Assets/        # Folder for static assets (images)
|   ├── componemts/    # Reusable UI components used across the app
│   ├── Functions/     # Utility functions for various operations
│   ├── Redux/         # Redux state management setup (constants, actions, reducers, store)
|   ├── App.js         # Main application component
|   └── index.js       # Entry point for the React application
├── public/            # Public assets (index.html, favicon, etc.)
├── BackEnd/           # Backend server code and logic
│   ├── models/        # Mongoose models for database schemas
|   ├── chatServer/    # Chat server implementation for real-time communication
│   ├── routes/        # API routes for handling requests
|   ├── index.js       # Entry point for backend
│   ├── middleWare/    # Custom middleware for request handling
|   ├── .env           # Environment variables for configuration
|   ├── package.json   # Dependencies and scripts for the backend
│   └── db.js          # database connection setup
├── .env               # Environment variables for the root application or frontend
├── package.json       # Dependencies and scripts for the frontend
├── LICENSE            # License file for project usage
└── README.md          # Project documentation
```

## 💡 Usage

After setting up the project, you can explore Topix's features:

- 🔐 **Sign Up / Log In**: Create a user account or log in with existing credentials.
- ❓ **Post Questions**: Submit questions with optional monetary rewards to encourage valuable answers.
- ✏️ **Provide Answers**: Contribute answers and earn rewards from users.
- 💬 **Chat in Real-Time**: Engage with others via the built-in chat system for further discussion.

## 🤝 Contributing

We welcome and appreciate contributions to Topix! To get started:

1. **Fork this repository**.
2. **Create a new branch**: `git checkout -b feature-branch`.
3. **Make your changes** and commit them: `git commit -m 'Description of feature'`.
4. **Push to your branch**: `git push origin feature-branch`.
5. **Submit a pull request** explaining your changes.

### Contribution Guidelines

- **Code Quality**: Ensure your code follows project conventions and is well-documented.
- **Testing**: Add relevant tests for new features or changes.
- **Pull Request Description**: Clearly describe your changes in the pull request to help with the review process.

## 📅 Future Features

Topix is constantly evolving. Here are some exciting features planned for future releases:

- 🕵️‍♂️ **Advanced Search Filters**: Refine search results with advanced filtering options.
- 🔔 **Notification System**: Real-time notifications for chat messages, rewards, and answers.
- ⭐ **Leaderboard**: A leaderboard showcasing the top contributors on the platform.

## 📝 License

Topix is licensed under the **MIT License**. See the [LICENSE](https://github.com/Chandrakant-iitbbs/Topix/blob/main/LICENSE) file for full details.

## 📞 Contact

For questions, suggestions, or bug reports, feel free to reach out:

- 📧 **Email**: chandrakantgupta681@gmail.com
- **GitHub Issues**: Open an issue for any bugs or feature requests.

_🚀 Happy coding! Together, let’s make knowledge sharing more rewarding and interactive._
