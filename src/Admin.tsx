import React, { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { Button, Input, message, Modal } from 'antd'
import { WS_SERVER_HOST, WS_SERVER_URL } from './const.ts'

const ReactJson = lazy(() => import('react-json-view'))

export default function Admin() {
  const [game, setGame] = useState<any>()
  const [remoteData, setRemoteData] = useState<any>()
  const refNum = useRef<any>()
  const refId = useRef<any>()
  const refRoomId = useRef<any>()

  useEffect(() => {
    async function main() {
      const ws = new WebSocket(WS_SERVER_URL)
      ws.onopen = function () {
        console.log('ws onopen')
        window.socketSend = (data) => {
          const str = JSON.stringify(data)
          ws.send(str)
        }

        let randomId = sessionStorage.getItem('randomId')
        if (!randomId) {
          randomId = Math.random().toString(36).substring(2, 15)
          sessionStorage.setItem('randomId', randomId)
        }
        const roomId = sessionStorage.getItem('sessionRoomId')
        if (roomId) {
          window.socketSend({
            type: 'open',
            data: { userId: randomId, roomId },
          })
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

      const resp = await fetch(`//${WS_SERVER_HOST}/api/storeData`)
      const res = await resp.json()
      console.log(res)
      setRemoteData(res.data)
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
            data: {
              userId: sessionStorage.getItem('randomId') || '',
            },
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
              if (!(Number(value) && value >= 2 && value <= 8)) {
                message.error('人数必须为2-8的数字（包含2,8）')
                return
              }
              const resp = await fetch(`//${WS_SERVER_HOST}/api/userCount`, {
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
      <Button
        size="large"
        onClick={async () => {
          Modal.confirm({
            content: (
              <div>
                <Input placeholder="id" ref={refRoomId} />
              </div>
            ),
            onOk: async () => {
              const value = refRoomId.current?.input?.value
              sessionStorage.setItem('sessionRoomId', value)
            },
          })
        }}
      >
        设置用户roomId
      </Button>
      <div>
        <div>内部数据</div>
        <div>当前用户id: {sessionStorage.getItem('randomId')}</div>
        <div>
          game 内部数据
          <Suspense fallback={<div>加载中...</div>}>
            <ReactJson src={game} />
          </Suspense>
        </div>
        <div>
          remote store 所有数据
          <Suspense fallback={<div>加载中...</div>}>
            <ReactJson src={remoteData} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
