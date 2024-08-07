import React from 'react'
import ReactDOM from 'react-dom/client'
import AppUI from './AppUI.tsx'
import App from './App.tsx'
import './index.css'

const isRemote = location.search === '?remote=1'
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>{isRemote ? <App /> : <AppUI />}</React.StrictMode>
)
