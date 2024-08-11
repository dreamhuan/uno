import { Button, Input, message, Modal } from 'antd'
import { useRef } from 'react'
import { WS_SERVER_HOST } from './const.ts'
import styles from './App.module.scss'
import cx from 'classnames'
import { navigate } from './Router.tsx'

export default function Root() {
  const ref = useRef<any>()

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
                if (!(Number(value) && value >= 2 && value <= 8)) {
                  message.error('人数必须为2-8的数字（包含2,8）')
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
