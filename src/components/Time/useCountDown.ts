import { useEffect, useState } from 'react'

export function useCountDown(initialTime: number, cb?: () => void) {
  const [time, setTime] = useState(initialTime)

  useEffect(() => {
    const timeoutFn = () => {
      let timeId = setTimeout(() => {
        setTime((prevTime) => {
          clearTimeout(timeId)
          const curTime = prevTime - 1
          if (curTime > 0) {
            timeId = timeoutFn()
          } else if (curTime === 0) {
            setTimeout(() => {
              cb?.()
            }, 0)
          }
          return curTime
        })
      }, 1000)
      return timeId
    }

    const timeId = timeoutFn()
    return () => clearTimeout(timeId)
  }, [])

  return time
}
