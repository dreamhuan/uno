import { EColor, EOrder, EPattern } from '../entity/common'
import { genAGroupOfCard, shuffleCard } from '../service'
import { Card } from './Card'
import { User } from './User'

export class Game {
  userNum!: number // 玩家数量
  cardNum = 1 // 用几组牌，一组108张
  startNum = 7 // 每个玩家初始手牌数量
  order = EOrder.CCW
  currentColor?: EColor
  currentPattern?: EPattern
  prevCard?: Card
  users: User[] = []
  cards: Card[] = []
  usedCards: Card[] = []

  constructor(userNum: number, cardNum: number, startNum: number) {
    this.userNum = userNum
    this.cardNum = cardNum
    this.startNum = startNum
    for (let i = 0; i < cardNum; i++) {
      this.cards.push(...genAGroupOfCard())
    }
  }

  addUser(user: User) {
    this.users.push(user)
  }

  init() {
    // 洗牌
    shuffleCard(this.cards)
    // 发牌
    for (let i = 0; i < this.startNum; i++) {
      for (let j = 0; j < this.userNum; j++) {
        this.users[j].addCard(this.cards.pop()!)
      }
    }
    // 排序
    this.users.forEach((user) => user.sortCards())
  }
}
