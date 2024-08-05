import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import App1 from './App1.tsx'
import './index.css'

const isTest = false
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {isTest ? <App1 /> : <App />}
  </React.StrictMode>
)
