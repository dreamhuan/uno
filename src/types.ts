import { Card } from './core/entity/Card'
import { EColor, ENumber, EPattern, ETurn } from './core/entity/common'

declare global {
  interface Window {
    socketSend: (data: TMessageSendData) => void
  }
}

type TMessageSendData = {
  type: 'open' | 'init' | 'action'
  data: {
    id?: string
    name?: string
    cardIdx?: number // -1表示抽排
    curColor?: EColor
  }
}

type TMessageReceiveData = {
  type: 'init' | 'start'
  data: {
    cardList?: Card[]
    currentTurn: ETurn // 当前出牌顺序
    currentColor?: EColor // 当前出牌颜色
    currentPattern?: EPattern // 当前出牌图案
    currentNum?: ENumber // 当前出牌数字
    userIdList?: number[] // 出牌顺序
    currentUserId: number // 当前出牌用户id
    prevCard?: Card // 上一个出牌
    needAddCardNum: number // 累计的惩罚抽牌数
  }
}
