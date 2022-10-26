import React, { FC } from 'react';
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from 'react-router-dom';

import FilesPage from './components/Files';
import HomePage from './components/Home';
import DefaultLayout from './components/Layout';
import LoginPage from './components/Login';

type ProtectedRouteProps = {
  children?: React.ReactNode;
};

const ProtectedRoute = ({ children }: ProtectedRouteProps): JSX.Element => {
  if (!sessionStorage.getItem('token')) {
    return <Navigate to="/" replace={true} />;
  }
  return <React.Fragment>{children}</React.Fragment>;
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
    element: (
      <ProtectedRoute>
        <DefaultLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: 'users',
        element: <div />,
      },
      {
        path: 'user/:id',
        element: <div />,
      },
      {
        path: 'operations',
        element: <div />,
      },
      {
        path: 'operation/id',
        element: <div />,
      },
      {
        path: 'clients',
        element: <div />,
      },
      {
        path: 'client/:id',
        element: <div />,
      },
    ],
  },
  {
    path: 'login',
    element: <LoginPage />,
  },
]);

const App: FC = () => {
  return <RouterProvider router={router} />;
};

export default App;
