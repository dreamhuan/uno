import Input from './components/Input'
import { Button, message, Modal } from 'antd'
import { useEffect, useRef } from 'react'
import { WS_SERVER_HOST } from './const.ts'
import styles from './App.module.scss'
import cx from 'classnames'
import { navigate } from './Router.tsx'

export default function Root() {
  const userCountRef = useRef<any>()
  const roomIdRef = useRef<any>()

  useEffect(() => {
    let randomId = sessionStorage.getItem('randomId')
    if (!randomId) {
      randomId = Math.random().toString(36).substring(2, 15)
      sessionStorage.setItem('randomId', randomId)
    }
  }, [])

  return (
    <div className={cx(styles.Game, styles.Container)}>
      <h1 className={styles.Title}>Welcome to play UNO.</h1>
      <div className={styles.ButtonGroup}>
        <Button
          onClick={() => {
            navigate('/local')
          }}
        >
          单机模式
        </Button>
        <Button
          onClick={async () => {
            Modal.confirm({
              content: (
                <div>
                  <Input placeholder="请输入人数" ref={userCountRef} />
                </div>
              ),
              onOk: async () => {
                const valueStr = userCountRef.current?.value
                const value = Number(valueStr)
                if (!(value >= 2 && value <= 8)) {
                  message.error('仅支持2-8人参与游戏')
                  return
                }
                const resp = await fetch(`//${WS_SERVER_HOST}/api/createRoom`, {
                  method: 'POST',
                  body: JSON.stringify({
                    userId: sessionStorage.getItem('randomId'),
                    userCount: value,
                  }),
                })
                const res = await resp.json()
                console.log(res)
                const roomId = res.data.roomId
                if (roomId) {
                  sessionStorage.setItem('sessionRoomId', roomId)
                  navigate('/remote')
                } else {
                  message.error('创建房间失败')
                }
              },
            })
          }}
        >
          创建房间
        </Button>
        <Button
          onClick={async () => {
            Modal.confirm({
              content: (
                <div>
                  <Input placeholder="请输入6位房间号" ref={roomIdRef} />
                </div>
              ),
              onOk: async () => {
                const value = roomIdRef.current?.value
                if (!/^\d{6}$/.test(value)) {
                  message.error('房间号为6位数字')
                  return
                }
                const resp = await fetch(`//${WS_SERVER_HOST}/api/joinRoom`, {
                  method: 'POST',
                  body: JSON.stringify({
                    userId: sessionStorage.getItem('randomId'),
                    roomId: value,
                  }),
                })
                const res = await resp.json()
                console.log(res)
                const roomId = res.data.roomId
                if (roomId) {
                  sessionStorage.setItem('sessionRoomId', roomId)
                  navigate('/remote')
                } else {
                  message.error('房间不存在')
                }
              },
            })
          }}
        >
          加入房间
        </Button>
        {/* <Button
          onClick={() => {
            navigate('/admin')
          }}
        >
          超管页面
        </Button> */}
      </div>
    </div>
  )
}
