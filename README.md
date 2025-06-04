# Pilot Tool

The Pilot Tool is an internal application developed for the FamilySearch engineering organization to manage and track engineering initiatives. It serves as a centralized repository for initiative metadata, facilitates executive decision-making, and ensures alignment with organizational goals by providing tailored reporting and seamless integration with Jira.

## Features

- **Metadata Storage**: Centralized repository for engineering initiative metadata
- **Executive Decision Support**: Tools for senior leaders to review, refine, and approve initiatives
- **Tailored Reporting**: Custom displays for project dependencies, timelines, and team organization
- **Jira Integration**: Bidirectional sync for real-time updates between Pilot Tool and Jira
- **Continuous Improvement Guidance**: Features to support engineering teams in planning and delivery processes

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **Authentication**: OAuth 2.0
- **Deployment**: Docker, AWS ECS

## Prerequisites

- Node.js 20.x or higher
- npm 10.x or higher
- Docker and Docker Compose (for containerized deployment)
- PostgreSQL (if running locally without Docker)

## Getting Started

### Development Setup

1. **Clone the repository**

```bash
git clone [repository-url]
cd pilot-tool
```

2. **Install dependencies**

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

3. **Set up environment variables**

```bash
# For backend
cp server/.env.example server/.env
# Edit the .env file with your configuration
```

4. **Start the development server**

```bash
# Start PostgreSQL using Docker
docker-compose -f docker-compose.dev.yml up -d

# Start the backend server
cd server
npm run dev

# In another terminal, start the frontend
cd ..
npm run dev
```

5. **Access the application**

- Frontend: [http://localhost:5173](http://localhost:5173)
- Backend API: [http://localhost:3001](http://localhost:3001)

### Production Deployment

1. **Build and run with Docker Compose**

```bash
docker-compose up --build -d
```

2. **Access the application**

- Frontend: [http://localhost](http://localhost)
- Backend API: [http://localhost/api](http://localhost/api)

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```
