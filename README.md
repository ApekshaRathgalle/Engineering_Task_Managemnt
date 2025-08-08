# Engineering Task Management System

A full-stack task management application built with React, Node.js, MongoDB, and Firebase.

## 🚀 Features

- **User Authentication** - Firebase Auth with Google Sign-in
- **Role-based Access Control** - Admin and User roles
- **Task Management** - Create, read, update, delete tasks
- **User Management** - Admin can manage users and roles
- **Dashboard** - Overview of tasks and statistics
- **Responsive Design** - Works on desktop and mobile

## 🛠️ Tech Stack

### Frontend
- React 19+ with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- React Router for navigation
- Firebase Auth for authentication
- Lucide React for icons

### Backend
- Node.js with Express
- TypeScript
- MongoDB with Mongoose
- Firebase Admin SDK
- JWT authentication
- CORS, Helmet, Rate limiting

## 📋 Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- Firebase project with Auth enabled

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/ApekshaRathgalle/Engineering_Task_Management.git
cd Engineering_Task_Management
```

### 2. Install dependencies for all projects
```bash
npm run install:all
```

### 3. Set up environment variables

#### Backend (.env in `/backend` folder)
```env
MONGODB_URI=your_mongodb_connection_string
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_CLIENT_EMAIL=your_firebase_client_email
FIREBASE_PRIVATE_KEY="your_firebase_private_key"
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

#### Frontend (.env in `/frontend` folder)
```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_API_URL=http://localhost:5000/api
```

### 4. Start both frontend and backend concurrently
```bash
npm run dev
```

This will start:
- Backend server on `http://localhost:5000`
- Frontend development server on `http://localhost:3000`

## 📁 Project Structure

```
Engineering_Task_Management/
├── backend/                 # Node.js/Express backend
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   ├── middleware/      # Custom middleware
│   │   ├── models/         # MongoDB models
│   │   ├── routes/         # API routes
│   │   ├── utils/          # Utilities
│   │   └── app.ts          # Express app setup
│   ├── .env                # Backend environment variables
│   └── package.json
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── context/        # React contexts
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── types/          # TypeScript types
│   │   └── utils/          # Utility functions
│   ├── .env                # Frontend environment variables
│   └── package.json
└── package.json            # Root package.json with scripts
```

## 🔧 Available Scripts

### Root Level
- `npm run dev` - Start both frontend and backend
- `npm run build` - Build both projects
- `npm run install:all` - Install dependencies for all projects

### Backend Only
- `npm run dev:backend` - Start backend in development mode
- `npm run build:backend` - Build backend
- `npm run start:backend` - Start production backend

### Frontend Only
- `npm run dev:frontend` - Start frontend development server
- `npm run build:frontend` - Build frontend for production

## 🔐 Default Admin Account

After setting up Firebase Auth, you can manually set a user's role to 'admin' through the Firebase console or by updating the user document in MongoDB.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👤 Author

**Apeksha Rathgalle**
- GitHub: [@ApekshaRathgalle](https://github.com/ApekshaRathgalle)
