import React, { useEffect, useState } from 'react'
import { Button } from 'antd'
import { WEB_SOCKS_PORT } from './const'

export default function Admin() {
  const [game, setGame] = useState<any>()
  useEffect(() => {
    async function main() {
      const currentURL = new URL(window.origin)
      const ws = new WebSocket(`ws://${currentURL.hostname}:${WEB_SOCKS_PORT}`)
      ws.onopen = function () {
        console.log('ws onopen')
        let randomId = sessionStorage.getItem('randomId')
        if (!randomId) {
          randomId = Math.random().toString(36).substring(2, 15)
          sessionStorage.setItem('randomId', randomId)
        }
        ws.send(JSON.stringify({ type: 'open', id: randomId }))
        window.socketSend = (data) => {
          const str = JSON.stringify(data)
          ws.send(str)
        }
      }
      ws.onmessage = function (e) {
        console.log('ws onmessage')
        const data = JSON.parse(e.data)
        console.log(data)
        if (data.type === 'start') {
          setGame?.(data.data)
        }
      }
    }
    main()
  }, [])

  return (
    <div>
      <h1>Admin</h1>
      <Button
        size="large"
        onClick={() => {
          window.socketSend({
            type: 'restart',
            data: {},
          })
        }}
      >
        重开本局
      </Button>
      <Button
        size="large"
        onClick={() => {
          window.socketSend({ type: 'reset', data: {} })
        }}
      >
        重置数据
      </Button>
      {/* <Button size="large" onClick={() => {}}>
        设置用户id
      </Button> */}
      <div>
        <div>内部数据</div>
        <div>当前用户id: {sessionStorage.getItem('randomId')}</div>
        <div>
          game 内部数据
          <pre>{JSON.stringify(game, null, 2)}</pre>
        </div>
      </div>
    </div>
  )
}
