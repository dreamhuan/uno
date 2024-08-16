import Input from '../components/Input/index.tsx'
import { Button, message, Modal } from 'antd'
import { useEffect, useRef } from 'react'
import { MyStorage, WS_SERVER_HOST } from '../common.ts'
import styles from './style.module.scss'
import cx from 'classnames'
import { navigate } from '../Router.tsx'
import CardItem from '../components/CardItem/index.tsx'
import { Card } from '../core/entity/Card.ts'
import { ECardType, EColor, ENumber, EPattern } from '../core/entity/common.ts'
import { useAdaptMobile } from '../hooks/useAdaptMobile.ts'

export default function Root() {
  const userCountRef = useRef<any>()
  const roomIdRef = useRef<any>()

  const { adaptStyle } = useAdaptMobile()

  useEffect(() => {
    let randomId = MyStorage.getItem('randomId')
    if (!randomId) {
      randomId = Math.random().toString(36).substring(2, 15)
      MyStorage.setItem('randomId', randomId)
    }
    setTimeout(async () => {
      console.log(location.search) // ?roomId=268677
      const roomId = new URLSearchParams(location.search).get('roomId')
      console.log('roomId', roomId)
      history.replaceState(null, '', '/')
      if (roomId) {
        await joinRoom(roomId)
      }
    }, 1000)
  }, [])

  const createRoom = async (valueStr: string) => {
    const value = Number(valueStr)
    if (!(value >= 2 && value <= 8)) {
      message.error('仅支持2-8人参与游戏')
      return
    }
    const resp = await fetch(`//${WS_SERVER_HOST}/api/createRoom`, {
      method: 'POST',
      body: JSON.stringify({
        userId: MyStorage.getItem('randomId'),
        userCount: value,
      }),
    })
    const res = await resp.json()
    console.log(res)
    const roomId = res.data.roomId
    if (roomId) {
      MyStorage.setItem('sessionRoomId', roomId)
      navigate('/remote')
    } else {
      message.error('创建房间失败')
    }
  }

  const joinRoom = async (value: string) => {
    if (!/^\d{6}$/.test(value)) {
      message.error('房间号为6位数字')
      return
    }
    const resp = await fetch(`//${WS_SERVER_HOST}/api/joinRoom`, {
      method: 'POST',
      body: JSON.stringify({
        userId: MyStorage.getItem('randomId'),
        roomId: value,
      }),
    })
    const res = await resp.json()
    console.log(res)
    const roomId = res.data.roomId
    if (roomId) {
      MyStorage.setItem('sessionRoomId', roomId)
      navigate('/remote')
    } else {
      message.error('房间不存在')
    }
  }
  return (
    <div className={cx(styles.Game, styles.Container)} style={adaptStyle}>
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
                  await createRoom(valueStr)
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
                  await joinRoom(value)
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
          <Button
            onClick={() => {
              navigate('/my')
            }}
          >
            个人中心
          </Button>
        </div>
      </div>
    </div>
  )
}
