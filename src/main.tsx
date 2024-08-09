import React from 'react'
import ReactDOM from 'react-dom/client'
import AppUI from './AppUI.tsx'
import App from './App.tsx'
import './index.css'

import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import Root from './Root.tsx'
import Admin from './Admin.tsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
  },
  {
    path: '/local',
    element: <AppUI />,
  },
  {
    path: '/remote',
    element: <App />,
  },
  {
    path: '/admin',
    element: <Admin />,
  },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
