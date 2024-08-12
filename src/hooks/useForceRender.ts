import { useState } from 'react'

export function useForceRender() {
  const [, setState] = useState(0)

  const forceRender = () => {
    setState((prev) => prev + 1)
  }

  return forceRender
}
