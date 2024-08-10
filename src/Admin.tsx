import React, { useEffect, useRef, useState } from 'react'
import { Button, Input, message, Modal } from 'antd'
import ReactJson from 'react-json-view'
import { WEB_SOCKS_PORT } from './const'

export default function Admin() {
  const [game, setGame] = useState<any>()
  const refNum = useRef<any>()
  const refId = useRef<any>()

  const currentURL = new URL(window.origin)
  const prefix = `//${currentURL.hostname}:${WEB_SOCKS_PORT}`

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
      <Button
        size="large"
        onClick={async () => {
          Modal.confirm({
            content: (
              <div>
                <Input placeholder="请输入人数" ref={refNum} />
              </div>
            ),
            onOk: async () => {
              const value = refNum.current?.input?.value
              if (!(Number(value) && value >= 4 && value <= 8)) {
                message.error('人数必须为4-8的数字（包含4,8）')
                return
              }
              const resp = await fetch(`${prefix}/api/userCount`, {
                method: 'POST',
                body: JSON.stringify({ userCount: value }),
              })
              const res = await resp.json()
              console.log(res)
            },
          })
        }}
      >
        设置人数
      </Button>
      <Button
        size="large"
        onClick={async () => {
          Modal.confirm({
            content: (
              <div>
                <Input placeholder="id" ref={refId} />
              </div>
            ),
            onOk: async () => {
              const value = refId.current?.input?.value
              sessionStorage.setItem('randomId', value)
            },
          })
        }}
      >
        设置用户id
      </Button>
      <div>
        <div>内部数据</div>
        <div>当前用户id: {sessionStorage.getItem('randomId')}</div>
        <div>
          game 内部数据
          <ReactJson src={game} />
        </div>
      </div>
    </div>
  )
}
