# ⚡ Task Master — Premium To-Do List Application

Task Master is a premium, full-stack Task Management application built with a modern glassmorphic design system. It features real-time synchronization with a Node.js/Express backend, persistent storage in MongoDB, state management via Redux Toolkit, and standard-compliant styling with light/dark theme support.

---

## ✨ Features

- **Intuitive UI/UX:** A stunning glassmorphism interface featuring responsive gradients, smooth animations, and interactive hover states.
- **Full CRUD Support:** Add, read, update (inline editing), and delete tasks.
- **Categorization:** Classify tasks with color-coded badges (`Work`, `Study`, `Design`, `Other`).
- **Filters:** Easily toggle between `All`, `Active`, and `Completed` tasks.
- **Dynamic Theme Mode:** Seamlessly switch between Light and Dark themes (state persisted in Redux).
- **Full-Stack Sync:** Fully powered by asynchronous Redux Toolkit Thunks interacting with a MongoDB database.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 19 + Vite
- **State Management:** Redux Toolkit (`@reduxjs/toolkit` & `react-redux`)
- **Styling:** Vanilla CSS (Modern CSS Custom Properties, Glassmorphism, Responsive layout)

### Backend
- **Server:** Node.js + Express
- **Database:** MongoDB (via Mongoose ODM)
- **API:** RESTful endpoints for Task CRUD operations

---

## 🚀 Getting Started

Follow these steps to run both the backend server and the frontend client locally.

### Prerequisites
- [Node.js](https://nodejs.org/) installed on your machine.
- Access to a MongoDB instance (default is configured to connect to MongoDB Atlas).

### 1. Run the Backend Server
1. Navigate to the `server` directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   npm start
   # or
   node server.js
   ```
   *The server runs on port `5000` (http://localhost:5000).*

### 2. Run the Frontend Client
1. Navigate to the root directory of the project:
   ```bash
   cd ..
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   *The client runs on port `5173` (http://localhost:5173).*

---

## 📁 Project Structure

```text
├── angular-todo/        # Alternate Angular implementation
├── public/              # Static assets (Favicons, Icons)
├── server/              # Backend server codebase
│   ├── server.js        # Express application entry & MongoDB model definitions
│   └── package.json     # Server-side package details
├── src/                 # React frontend codebase
│   ├── component/       # React UI Components (Header, TaskInput, TaskItem, etc.)
│   ├── store/           # Redux state store (todosSlice & themSlice)
│   ├── App.jsx          # Root React component
│   ├── App.css          # Core layouts & interactive styles
│   ├── index.css        # Theme variables, utility anims, & background gradients
│   └── main.jsx         # React application mounting
├── index.html           # Main HTML document
└── package.json         # Frontend package details
```

---

## 🔌 API Endpoints

The Express server exposes the following endpoints at `http://localhost:5000/api/tasks`:

| Method | Endpoint | Description | Request Body (JSON) |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/tasks` | Fetch all tasks sorted by creation date | None |
| **POST** | `/api/tasks` | Create a new task | `{ "title": "...", "category": "..." }` |
| **PUT** | `/api/tasks/:id` | Update task details (title, status, etc.) | `{ "title": "...", "completed": true/false }` |
| **DELETE** | `/api/tasks/:id` | Delete a specific task by ID | None |

---

## 🎨 Theme Configuration

Themes are controlled globally via Redux and applied to the document body using HTML attributes:
- **Light Theme (Default):** Warm glass card overlays and soft shadows.
- **Dark Theme:** Deep dark blue backgrounds with vibrant glowing highlights.
- **Gradients:** Custom CSS gradients applied to title headers and action buttons.
