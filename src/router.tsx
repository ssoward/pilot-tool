import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';

// Placeholder components for routes we haven't created yet
const InitiativeList = () => <div>Initiative List Page</div>;
const InitiativeDetail = () => <div>Initiative Detail Page</div>;
const InitiativeForm = () => <div>Initiative Form Page</div>;
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
    path: '/initiatives',
    element: <MainLayout><InitiativeList /></MainLayout>,
  },
  {
    path: '/initiatives/:id',
    element: <MainLayout><InitiativeDetail /></MainLayout>,
  },
  {
    path: '/initiatives/new',
    element: <MainLayout><InitiativeForm /></MainLayout>,
  },
  {
    path: '/initiatives/:id/edit',
    element: <MainLayout><InitiativeForm /></MainLayout>,
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
