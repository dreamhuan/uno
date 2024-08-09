import { Button } from 'antd'
import { useNavigate } from 'react-router-dom'

export default function Root() {
  const navigate = useNavigate()

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
        onClick={() => {
          navigate('/remote')
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
