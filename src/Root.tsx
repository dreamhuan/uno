import { Button, Input, message, Modal } from 'antd'
import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { WEB_SOCKS_PORT } from './const'

export default function Root() {
  const navigate = useNavigate()
  const ref = useRef<any>()

  const currentURL = new URL(window.origin)
  const prefix = `//${currentURL.hostname}:${WEB_SOCKS_PORT}`

  return (
    <div>
      <h1>Infinite UNO</h1>
      <Button
        onClick={() => {
          navigate('/local')
        }}
      >
        单机模式
      </Button>
      <Button
        onClick={async () => {
          const resp = await fetch(`${prefix}/api/userCount`)
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
              const resp = await fetch(`${prefix}/api/userCount`, {
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
  )
}
