import React, { lazy, Suspense, useEffect } from 'react'
import Home from './pages/Home.tsx'
import './index.css'
import { useForceRender } from './hooks/useForceRender.ts'
import My from './pages/My.tsx'

const AppUI = lazy(() => import('./pages/AppUI.tsx'))
const App = lazy(() => import('./pages/App.tsx'))
const Admin = lazy(() => import('./pages/Admin.tsx'))
const Rule = lazy(() => import('./pages/Rule.tsx'))

const routerMap = {
  '/': {
    path: '/',
    element: <Home />,
  },
  '/local': {
    path: '/local',
    element: (
      <Suspense fallback={<div>加载中...</div>}>
        <AppUI />
      </Suspense>
    ),
  },
  '/remote': {
    path: '/remote',
    element: (
      <Suspense fallback={<div>加载中...</div>}>
        <App />
      </Suspense>
    ),
  },
  '/rule': {
    path: '/rule',
    element: (
      <Suspense fallback={<div>加载中...</div>}>
        <Rule />
      </Suspense>
    ),
  },
  '/my': {
    path: '/my',
    element: (
      <Suspense fallback={<div>加载中...</div>}>
        <My />
      </Suspense>
    ),
  },
  '/admin': {
    path: '/admin',
    element: (
      <Suspense fallback={<div>加载中...</div>}>
        <Admin />
      </Suspense>
    ),
  },
} as any

let forceRender: any
export const navigate = (path: string) => {
  history.pushState(null, '', path)
  forceRender?.()
}

export const Router = () => {
  forceRender = useForceRender()
  const path = location.pathname
  useEffect(() => {
    // 监听路由变化
    window.addEventListener('popstate', forceRender)
    return () => window.removeEventListener('popstate', forceRender)
  }, [])
  return routerMap[path]?.element || '404'
}
