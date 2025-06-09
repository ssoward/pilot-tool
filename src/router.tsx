import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import TeamManagementDashboard from './components/TeamManagementDashboard';
import RoadmapVisualization from './components/RoadmapVisualization';
import InitiativeAssignmentPage from './pages/InitiativeAssignmentPage';
import EmployeesPage from './pages/EmployeesPage';
import InitiativeManagementPage from './pages/InitiativeManagementPage';
import InitiativeDetail from './pages/InitiativeDetail';

// Placeholder components for routes we haven't created yet
const Reports = () => <div>Reports Page</div>;
const Login = () => <div>Login Page</div>;
const NotFound = () => <div className="flex flex-col items-center justify-center h-screen">
  <h1 className="text-4xl font-bold mb-4">404</h1>
  <p className="text-gray-600 mb-4">Page not found</p>
  <a href="/" className="text-indigo-600 hover:underline">Go back home</a>
</div>;

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout><Dashboard /></MainLayout>,
  },
  {
    path: '/employees', // Add this route definition
    element: <MainLayout><EmployeesPage /></MainLayout>,
  },
  {
    path: '/initiatives',
    element: <MainLayout><InitiativeManagementPage /></MainLayout>,
  },
  {
    path: '/initiatives/:id',
    element: <MainLayout><InitiativeDetail /></MainLayout>,
  },
  {
    path: '/initiatives/:id/edit',
    element: <MainLayout><InitiativeManagementPage /></MainLayout>,
  },
  {
    path: '/teams',
    element: <MainLayout><TeamManagementDashboard /></MainLayout>,
  },
  {
    path: '/roadmap',
    element: <MainLayout><RoadmapVisualization /></MainLayout>,
  },
  {
    path: '/assignments',
    element: <MainLayout><InitiativeAssignmentPage /></MainLayout>,
  },
  {
    path: '/reports',
    element: <MainLayout><Reports /></MainLayout>,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);

const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;
