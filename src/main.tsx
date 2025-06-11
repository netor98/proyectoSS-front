import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter as Router } from 'react-router-dom'
import React from 'react'
// const router = createBrowserRouter([
//   { path: '/', element: <App /> },
//   { path: '/auth/login', element: <Login /> },
//   { path: '/auth/register', element: <Register /> }
// ]);




createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <App />
    </Router>
  </StrictMode>,
)
