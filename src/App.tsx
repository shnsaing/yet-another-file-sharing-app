import React, { FC, useEffect } from 'react';
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
  useNavigate,
} from 'react-router-dom';

import FilesPage from './components/Files';
import HomePage from './components/Home';
import DefaultLayout from './components/Layout';
import LoginPage from './components/Login';
import UsersPage from './components/Users';
import { Role } from './services/auth/auth';

type ProtectedRouteProps = {
  rolesAllowed: Role[];
  children?: React.ReactNode;
};

const LogoutPage = () => {
  const navigate = useNavigate();
  useEffect(() => {
    sessionStorage.clear();
    navigate('/');
  }, []);
  return null;
};

const ProtectedRoute = ({
  rolesAllowed,
  children,
}: ProtectedRouteProps): JSX.Element => {
  const role = sessionStorage.getItem('role');
  if (role) {
    if (rolesAllowed.find((allowedRole) => role === allowedRole)) {
      return <React.Fragment>{children}</React.Fragment>;
    }
  }
  return <Navigate to="/" replace={true} />;
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <DefaultLayout />,
    children: [
      { index: true, element: <HomePage /> },
      {
        path: 'home',
        element: <HomePage />,
      },
      {
        path: 'forgot-password',
        element: <div>forgotpass</div>,
      },
      {
        path: ':operationToken',
        element: <FilesPage />,
      },
      {
        path: ':operationToken/folder/:folderId',
        element: <FilesPage />,
      },
    ],
  },
  {
    path: 'admin',
    element: <DefaultLayout />,
    children: [
      {
        path: 'users',
        element: (
          <ProtectedRoute rolesAllowed={[Role.ADMIN]}>
            <UsersPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'user/:id',
        element: (
          <ProtectedRoute rolesAllowed={[Role.ADMIN]}>
            <div />
          </ProtectedRoute>
        ),
      },
      {
        path: 'operations',
        element: (
          <ProtectedRoute rolesAllowed={[Role.CLIENT, Role.ADMIN]}>
            <div />
          </ProtectedRoute>
        ),
      },
      {
        path: 'operation/id',
        element: (
          <ProtectedRoute rolesAllowed={[Role.CLIENT, Role.ADMIN]}>
            <div />
          </ProtectedRoute>
        ),
      },
      // {
      //   path: 'clients',
      //   element: (
      //     <ProtectedRoute rolesAllowed={[Role.USER, Role.CLIENT, Role.ADMIN]}>
      //       <div />
      //     </ProtectedRoute>
      //   ),
      // },
      // {
      //   path: 'client/:id',
      //   element: (
      //     <ProtectedRoute rolesAllowed={[Role.USER, Role.CLIENT, Role.ADMIN]}>
      //       <div />
      //     </ProtectedRoute>
      //   ),
      // },
    ],
  },
  {
    path: 'login',
    element: <LoginPage />,
  },
  {
    path: 'logout',
    element: <LogoutPage />,
  },
]);

const App: FC = () => {
  return <RouterProvider router={router} />;
};

export default App;
