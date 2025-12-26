# Workout App – Draft Version

This repository contains the **Draft Version** of my Workout App, a full-stack web application designed to help users create and manage training routines.  
The project includes authentication, routine creation, exercise selection, and a basic routine details view.

This version focuses on delivering a **fully functional end-to-end workflow**, with clean and modular backend and frontend structure, ready for future expansion in the Beta Stage.

**The deploy is already done.** Link to the application: https://workout-app-peka.vercel.app/dashboard

---

## 🚀 Tech Stack

### **Frontend**
- React (Vite)
- React Router DOM
- Tailwind CSS
- Axios
- Visual Studio Code as the main editor

### **Backend**
- Node.js + Express
- MongoDB + Mongoose
- JWT authentication
- bcrypt for password hashing
- CORS enabled

---

## 📌 Features Included in the Draft Version

### ✅ **Authentication**
- Register new users (email, password, name)
- Login using secure JWT tokens
- Protected routes on frontend using custom `ProtectedRoute`

### ✅ **Routines Management**
- View all routines of the logged-in user
- Create new routines by selecting exercises from a backend catalog
- Assign:
  - Number of sets  
  - Repetitions  
  - Weight  
- Display routines in a list with clickable preview cards

### ✅ **Routine Detail Page**
- Navigate to `/routines/:id`
- View full details of a specific routine:
  - Exercise list
  - Sets / reps / weight information
  - Populated exercise data (name, muscle group, type)

### ⚙️ **Backend API**
- `POST /api/auth/register` – register user  
- `POST /api/auth/login` – login user  
- `GET /api/exercises` – list available exercises  
- `GET /api/routines` – list user's routines  
- `POST /api/routines` – create routine  
- `GET /api/routines/:id` – routine detail  

---

## 🛠️ Installation & Setup

### 🔧 Requirements
- Node.js (v16+ recommended)
- MongoDB Atlas or local MongoDB instance
- Visual Studio Code

---
## ⚙️ Backend Setup
  
1. Navigate to the backend folder:
    - cd backend
    - npm install

2. Create a .env file based on .env.example:
    - MONGO_URI=your_mongo_uri_here
    - JWT_SECRET=your_jwt_secret
    - PORT=5000

3. Start the backend:
    - npm run dev
        Backend runs on:
        http://localhost:5000

## ⚙️ Frontend Setup

1. Navigate to forntend folder:
    - cd frontend
    - npm install

2. Start the backend:
    - npm run dev
        The frontend will be available at something like:
        http://localhost:5173

## Draft Version Summary

This Draft Version demonstrates that:

- The architecture is correct

- Backend and frontend communicate properly

- User flow works end-to-end

- Routines can be created and stored in MongoDB

- Routine details are correctly displayed

- This version is intentionally unpolished, but the core mechanics are implemented and working.