import React, { FC } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import FilesPage from './components/Files';
import HomePage from './components/Home';
import DefaultLayout from './components/Layout';
import LoginPage from './components/Login';

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
    path: 'login',
    element: <LoginPage />,
  },
]);

const App: FC = () => {
  return <RouterProvider router={router} />;
};

export default App;
