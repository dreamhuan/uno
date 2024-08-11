import React, { lazy, Suspense, useEffect, useState } from 'react'
import Root from './Root.tsx'
import './index.css'

const AppUI = lazy(() => import('./AppUI.tsx'))
const App = lazy(() => import('./App.tsx'))
const Admin = lazy(() => import('./Admin.tsx'))

const routerMap = {
  '/': {
    path: '/',
    element: <Root />,
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
  const [_, reRender] = useState(0)
  forceRender = () => reRender((prev) => prev + 1)
  const path = location.pathname
  useEffect(() => {
    // 监听路由变化
    window.addEventListener('popstate', forceRender)
    return () => window.removeEventListener('popstate', forceRender)
  }, [])
  return routerMap[path]?.element || '404'
}
