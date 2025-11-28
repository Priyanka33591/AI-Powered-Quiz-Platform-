# AI Powered Quiz Platform

A full-stack MERN application for creating and taking AI-powered quizzes. Built with React + Vite for the frontend and Node.js + Express for the backend, using MongoDB as the database.

## Project Structure

```
├── backend/
│   ├── models/
│   │   └── User.js
│   ├── routes/
│   │   └── auth.js
│   ├── server.js
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── auth.js
│   │   ├── components/
│   │   │   ├── LoadingSpinner.jsx
│   │   │   └── PrivateRoute.jsx
│   │   ├── contexts/
│   │   │   └── AuthContext.jsx
│   │   ├── hooks/
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Quiz.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Results.jsx
│   │   │   └── Upload.jsx
│   │   ├── styles/
│   │   │   ├── index.css
│   │   │   ├── Dashboard.css
│   │   │   ├── Login.css
│   │   │   ├── Profile.css
│   │   │   ├── Quiz.css
│   │   │   ├── Register.css
│   │   │   ├── Results.css
│   │   │   └── Upload.css
│   │   ├── utils/
│   │   │   └── auth.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas account)

## Setup Instructions

### 1. Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```bash
cp .env
```

4. Update the `.env` file with your configuration:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ai-quiz-platform
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
```

**Note:** 
- For local MongoDB: Use `mongodb://localhost:27017/ai-quiz-platform`
- For MongoDB Atlas: Use your connection string from Atlas dashboard
- Change `JWT_SECRET` to a strong, random string in production

5. Start the backend server:
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

The backend server will run on `http://localhost:5000`

### 2. Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

### 3. MongoDB Setup

#### Option A: Local MongoDB

1. Install MongoDB locally from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Start MongoDB service:
   - Windows: MongoDB should start automatically as a service
   - Mac/Linux: `mongod` or `brew services start mongodb-community`
3. Use the connection string: `mongodb://localhost:27017/ai-quiz-platform`

#### Option B: MongoDB Atlas (Cloud)

1. Create a free account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get your connection string from the Atlas dashboard
4. Update `MONGODB_URI` in backend `.env` with your Atlas connection string

## Environment Variables

### Backend (.env)

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port number | `5000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/ai-quiz-platform` |
| `JWT_SECRET` | Secret key for JWT tokens | `your-super-secret-jwt-key` |
| `NODE_ENV` | Environment mode | `development` or `production` |

## Available Routes

### Frontend Routes
- `/login` - User login page
- `/register` - User registration page
- `/dashboard` - User dashboard (protected)
- `/upload` - Upload quiz page (protected)
- `/quiz/:id` - Take quiz page (protected)
- `/results` - View results page (protected)
- `/profile` - User profile page (protected)

### Backend API Routes
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/health` - Health check endpoint

## Run Commands

### Backend
```bash
cd backend

# Install dependencies
npm install

# Development mode (with nodemon)
npm run dev

# Production mode
npm start
```

### Frontend
```bash
cd frontend

# Install dependencies
npm install

# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Features

- ✅ User authentication (Register/Login)
- ✅ JWT token-based authentication
- ✅ Protected routes
- ✅ Responsive design
- ✅ Form validation
- ✅ Loading states and error handling
- ✅ Clean folder structure
- ✅ Plain CSS styling (no frameworks)

## Technologies Used

### Frontend
- React 18
- Vite
- React Router DOM
- Axios
- Plain CSS

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT (jsonwebtoken)
- bcryptjs
- CORS

## Development Notes

- The frontend uses Vite's proxy to forward `/api` requests to the backend
- JWT tokens are stored in localStorage
- All protected routes require authentication
- The app uses ES6 modules (type: "module")

## Next Steps

- Implement quiz creation and management
- Add quiz taking functionality
- Implement results and scoring
- Add user profile management
- Integrate AI features for quiz generation

## License

ISC

