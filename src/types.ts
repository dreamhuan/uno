import { EColor } from './core/entity/common'

declare global {
  interface Window {
    socketSend: (data: TMessageSendData) => void
  }
}

type TMessageSendData = {
  type: 'open' | 'action' | 'user' | 'restart' | 'reset'
  data: {
    userId?: string
    roomId?: string
    name?: string
    icon?: string
    cardIdx?: number // -1表示抽排
    curColor?: EColor
  }
}
