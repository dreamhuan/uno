import Input from './components/Input'
import { Button, message, Modal } from 'antd'
import { useEffect, useRef } from 'react'
import { WS_SERVER_HOST } from './const.ts'
import styles from './App.module.scss'
import cx from 'classnames'
import { navigate } from './Router.tsx'
import CardItem from './components/CardItem/index.tsx'
import { Card } from './core/entity/Card.ts'
import { ECardType, EColor, ENumber, EPattern } from './core/entity/common.ts'

export default function Root() {
  const userCountRef = useRef<any>()
  const roomIdRef = useRef<any>()

  useEffect(() => {
    let randomId = localStorage.getItem('randomId')
    if (!randomId) {
      randomId = Math.random().toString(36).substring(2, 15)
      localStorage.setItem('randomId', randomId)
    }
  }, [])

  return (
    <div className={cx(styles.Game, styles.Container)}>
      <h1 className={styles.Title}>
        Infinite UNO
        <div style={{ fontSize: 12 }}>为保证游戏体验，请将手机开启横屏</div>
      </h1>
      <div className={styles.Content}>
        <div className={styles.Cards}>
          <CardItem
            card={new Card(ECardType.Num, EColor.B, ENumber._0, undefined)}
          />
          <CardItem
            card={new Card(ECardType.Func, EColor.R, undefined, EPattern.Two)}
          />
          <CardItem
            card={new Card(ECardType.King, EColor.A, undefined, EPattern.Four)}
          />
        </div>
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
                  const resp = await fetch(
                    `//${WS_SERVER_HOST}/api/createRoom`,
                    {
                      method: 'POST',
                      body: JSON.stringify({
                        userId: localStorage.getItem('randomId'),
                        userCount: value,
                      }),
                    }
                  )
                  const res = await resp.json()
                  console.log(res)
                  const roomId = res.data.roomId
                  if (roomId) {
                    localStorage.setItem('sessionRoomId', roomId)
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
                      userId: localStorage.getItem('randomId'),
                      roomId: value,
                    }),
                  })
                  const res = await resp.json()
                  console.log(res)
                  const roomId = res.data.roomId
                  if (roomId) {
                    localStorage.setItem('sessionRoomId', roomId)
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
          <Button
            onClick={() => {
              navigate('/rule')
            }}
          >
            查看规则
          </Button>
        </div>
      </div>
    </div>
  )
}
