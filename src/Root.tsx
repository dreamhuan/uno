import { Button, Input, message, Modal, Segmented } from 'antd'
import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { WS_SERVER_HOST } from './const.ts'
import styles from './App.module.scss'
import cx from 'classnames'

export default function Root() {
  const navigate = useNavigate()
  const ref = useRef<any>()
  const [type, setType] = useState('create')

  console.log('render',type);
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
            const resp = await fetch(`//${WS_SERVER_HOST}/api/userCount`)
            const res = await resp.json()
            console.log(res)
            if (res?.data?.value) {
              navigate('/remote')
              return
            }

            Modal.confirm({
              content: (
                <div>
                  <Input placeholder="请输入人数" ref={ref} />
                </div>
              ),
              onOk: async () => {
                const value = ref.current?.input?.value
                if (!(Number(value) && value >= 4 && value <= 8)) {
                  message.error('人数必须为4-8的数字（包含4,8）')
                  return
                }
                const resp = await fetch(`//${WS_SERVER_HOST}/api/userCount`, {
                  method: 'POST',
                  body: JSON.stringify({ userCount: value || 4 }),
                })
                const res = await resp.json()
                console.log(res)
                navigate('/remote')
              },
            })
          }}
        >
          联机模式
        </Button>
        <Button
          onClick={() => {
            navigate('/admin')
          }}
        >
          超管页面
        </Button>
      </div>
    </div>
  )
}
