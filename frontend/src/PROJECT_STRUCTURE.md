# Frontend Project Structure

## Folder Organization

```
src/
├── components/
│   ├── common/          # Reusable UI components
│   │   └── Navbar/
│   └── features/        # Feature-specific components
├── pages/
│   ├── auth/           # Authentication pages
│   ├── tasks/          # Task-related pages
│   └── ai/             # AI feature pages
├── hooks/              # Custom React hooks
│   ├── useAuth.js
│   └── useTasks.js
├── services/           # API and external services
│   └── api.js
├── styles/             # Global styles
└── utils/              # Utility functions
```

## Key Improvements

1. **Separation of Concerns**: Components, pages, hooks, and services are separated
2. **Custom Hooks**: Business logic extracted into reusable hooks (useAuth, useTasks)
3. **Centralized API**: All API calls in services/api.js
4. **Component Organization**: Common components in components/common, feature-specific in components/features
5. **Scalability**: Easy to add new features and maintain code

## Next Steps

Move existing page components to appropriate folders:
- Login.js, Register.js → pages/auth/
- Dashboard.js, Stats.js, Categories.js → pages/tasks/
- Chat.js, AIAssistant.js, AIInsights.js → pages/ai/
