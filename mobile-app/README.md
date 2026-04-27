# Task Manager Mobile App

React Native mobile app for the Task Manager backend.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Update API URL in `src/services/api.js`:
   - For Android emulator: `http://10.0.2.2:5000/api`
   - For iOS simulator: `http://localhost:5000/api`
   - For physical device: `http://YOUR_IP:5000/api`

3. Start the app:
```bash
npm start
```

## Features

- User authentication (Login/Register)
- Task management (Create, Read, Update, Delete)
- AI Chat assistant
- Real-time task updates

## Screens

- **LoginScreen**: User login
- **RegisterScreen**: New user registration
- **TasksScreen**: Main task list with CRUD operations
- **ChatScreen**: AI assistant chat interface
