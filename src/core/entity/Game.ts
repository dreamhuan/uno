import { EColor, EOrder, EPattern } from '../entity/common'
import { Card } from './Card'
import { User } from './User'

export class Game {
  userNum?: number // 玩家数量
  cardNum = 1 // 用几组牌，一组108张
  order = EOrder.CCW
  currentColor?: EColor
  currentPattern?: EPattern
  prevCard?: Card
  cards: Card[] = []
  users: User[] = []

  constructor(userNum: number, cardNum: number) {
    this.userNum = userNum
    this.cardNum = cardNum
  }
}
