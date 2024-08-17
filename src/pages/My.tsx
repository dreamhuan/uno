/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useRef, useState } from 'react'
import Input from '../components/Input/index.tsx'
import { Button, Modal, Switch } from 'antd'
import { MyStorage, WS_SERVER_HOST, WS_SERVER_URL } from '../common.ts'
import { useForceRender } from '../hooks/useForceRender.ts'

export default function My() {
  const [game, setGame] = useState<any>()
  const [remoteData, setRemoteData] = useState<any>()
  const forceRender = useForceRender()
  const refId = useRef<any>()
  const refRoomId = useRef<any>()
  const [isAdapt, setIsAdapt] = useState(false)

  useEffect(() => {
    const isAdapt = MyStorage.getItem('isAdapt') === '1'
    setIsAdapt(isAdapt)
    async function main() {
      const ws = new WebSocket(WS_SERVER_URL)
      ws.onopen = function () {
        console.log('ws onopen')
        window.socketSend = (data) => {
          const str = JSON.stringify(data)
          ws.send(str)
        }

        let randomId = MyStorage.getItem('randomId')
        if (!randomId) {
          randomId = Math.random().toString(36).substring(2, 15)
          MyStorage.setItem('randomId', randomId)
        }
        const roomId = MyStorage.getItem('sessionRoomId')
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
      <div>
        <div>
          当前用户id: {MyStorage.getItem('randomId')}{' '}
          <Button
            onClick={async () => {
              Modal.confirm({
                content: (
                  <div>
                    <Input placeholder="id" ref={refId} />
                  </div>
                ),
                onOk: async () => {
                  const value = refId.current?.value
                  MyStorage.setItem('randomId', value)
                  forceRender()
                },
              })
            }}
          >
            设置用户id
          </Button>
        </div>
        <div>
          当前房间id: {MyStorage.getItem('sessionRoomId')}{' '}
          <Button
            onClick={async () => {
              Modal.confirm({
                content: (
                  <div>
                    <Input placeholder="id" ref={refRoomId} />
                  </div>
                ),
                onOk: async () => {
                  const value = refRoomId.current?.value
                  MyStorage.setItem('sessionRoomId', value)
                  forceRender()
                },
              })
            }}
          >
            设置房间id
          </Button>
        </div>
      </div>
      <div>
        <span
          style={{
            color: '#333',
            fontSize: '12px',
          }}
        >
          适配手机旋转：(操作后刷新)
        </span>
        <Switch
          checkedChildren="开启"
          unCheckedChildren="关闭"
          value={isAdapt}
          onChange={(v) => {
            console.log(v)
            MyStorage.setItem('isAdapt', v ? '1' : '0')
            setIsAdapt(v)
          }}
        />
      </div>
    </div>
  )
}
