import React from 'react'
import ReactDOM from 'react-dom/client'
import AppUI from './AppUI.tsx'
import App from './App.tsx'
import './index.css'

const isTest = false
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {isTest ? <App /> : <AppUI />}
  </React.StrictMode>
)
