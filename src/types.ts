import { Card } from './core/entity/Card'
import { EColor, ENumber, EPattern, ETurn } from './core/entity/common'

declare global {
  interface Window {
    socketSend: (data: TMessageSendData) => void
  }
}

type TMessageSendData = {
  type: 'open' | 'action' | 'user' | 'restart'
  data: {
    id?: string
    name?: string
    icon?: string
    cardIdx?: number // -1表示抽排
    curColor?: EColor
  }
}
