<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Pilot Tool - Copilot Instructions

This is a full-stack application for managing engineering initiatives at FamilySearch.

## Project Structure
- The project follows a client-server architecture
- Frontend: React with TypeScript and Tailwind CSS
- Backend: Node.js/Express.js with TypeScript and PostgreSQL database
- Integration with Jira API for syncing initiative data
- OAuth 2.0 authentication for user authentication

## Guidelines for Code Generation
- Use TypeScript for all code - both frontend and backend
- Follow React hooks patterns and functional components for frontend
- For database operations, use Sequelize ORM
- When writing API endpoints, follow RESTful API principles
- For styling, use Tailwind CSS utility classes
- For API communication from frontend, use axios with React Query
- Handle errors properly with try-catch blocks and appropriate error responses
- Include proper typing for all functions, components and variables

## Recommended Patterns
- Use React Query for data fetching and caching
- Implement proper loading states and error handling in UI components
- For form handling, use controlled components with appropriate validation
- Create reusable components to maintain DRY principles
- Use environment variables for configuration
- Implement proper authentication and authorization checks
