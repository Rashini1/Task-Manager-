# Task Manager

Demo Video link: https://drive.google.com/file/d/1bWenmmc6XRGtvdUau9fd_CANoM-Kh8i0/view?usp=sharing

A full-stack web application for managing tasks efficiently. This project consists of a React-based frontend and a Node.js/Express backend, providing a user-friendly interface for creating, updating, and organizing tasks.

## Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Running the Project](#running-the-project)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)

## Features

- Create, read, update, and delete (CRUD) tasks
- User-friendly interface with React
- RESTful API backend
- Database integration with MongoDB
- Task filtering and organization
- Responsive design with modern UI
- Real-time task management

## Project Structure

```
Task-Manager/
├── backend/                 # Node.js/Express backend
│   ├── config/
│   │   └── db.js           # Database configuration
│   ├── controllers/
│   │   └── controller.js    # Request handlers
│   ├── models/
│   │   └── model.js         # Data models
│   ├── routes/
│   │   └── routes.js        # API routes
│   ├── server.js            # Main server file
│   └── package.json         # Backend dependencies
├── frontend/                # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   └── TaskManager.jsx   # Main task component
│   │   ├── services/
│   │   │   └── service.js        # API service
│   │   ├── App.jsx          # Root component
│   │   ├── main.jsx         # Entry point
│   │   └── index.css        # Global styles
│   ├── public/              # Static assets
│   ├── index.html           # HTML template
│   ├── package.json         # Frontend dependencies
│   ├── vite.config.js       # Vite configuration
│   └── eslint.config.js     # ESLint configuration
└── README.md                # This file
```

## Technologies Used

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling (optional)

### Frontend
- **React** - UI library
- **Vite** - Build tool and dev server
- **JavaScript (ES6+)** - Programming language
- **CSS3** - Styling

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager
- MongoDB (local or cloud instance)

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure database connection in `config/db.js` with your MongoDB URI

4. Install any additional required packages as needed

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Running the Project

### Start the Backend Server

```bash
cd backend
npm start
```

The server will run on `http://localhost:5000` (or your configured port)

### Start the Frontend Development Server

```bash
cd frontend
npm run dev
```

The frontend will be available at `http://localhost:5173` (Vite default)

### Build for Production

#### Backend
```bash
cd backend
npm run build
```

#### Frontend
```bash
cd frontend
npm run build
```

## API Endpoints

The backend provides the following RESTful endpoints:

- **GET** `/api/tasks` - Get all tasks
- **GET** `/api/tasks/:id` - Get a specific task
- **POST** `/api/tasks` - Create a new task
- **PUT** `/api/tasks/:id` - Update a task
- **DELETE** `/api/tasks/:id` - Delete a task

Refer to the `routes/routes.js` file for detailed endpoint configurations.

## File Descriptions

### Backend Files

- **server.js** - Main server entry point that initializes Express and connects to the database
- **config/db.js** - Database connection configuration
- **controllers/controller.js** - Business logic for handling requests
- **models/model.js** - Task data model definition
- **routes/routes.js** - API route definitions

### Frontend Files

- **App.jsx** - Root React component
- **main.jsx** - Application entry point
- **components/TaskManager.jsx** - Main task management component
- **services/service.js** - API calls and services
- **index.css** - Global styling

## Development Workflow

1. Make changes to the code
2. The development server will auto-reload on changes
3. Test API endpoints using Postman or similar tools
4. Build and deploy when ready

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add your feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a pull request

## License

This project is open source and available under the MIT License.