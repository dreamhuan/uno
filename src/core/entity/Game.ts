import { EColor, ETurn, EPattern } from '../entity/common'
import { genAGroupOfCard, shuffleCard } from '../service'
import { Card } from './Card'
import { User } from './User'

export class Game {
  userNum!: number // 玩家数量
  cardGroupNum = 1 // 用几组牌，一组108张
  beginNum = 7 // 每个玩家初始手牌数量

  users: User[] = []
  cards: Card[] = []
  usedCards: Card[] = []

  currentTurn = ETurn.CCW // 当前出牌顺序
  currentColor?: EColor // 当前出牌颜色
  currentPattern?: EPattern // 当前出牌图案
  currentUser?: User // 当前出牌用户
  prevCard?: Card // 上一个出牌
  needAddCardNum = 0 // 累计的惩罚抽牌数

  constructor(userNum: number, beginNum?: number, cardGroupNum?: number) {
    this.userNum = userNum
    this.cardGroupNum = cardGroupNum || 1
    this.beginNum = beginNum || 7
    for (let i = 0; i < this.cardGroupNum; i++) {
      this.cards.push(...genAGroupOfCard())
    }
  }

  addUser(user: User) {
    user.game = this
    this.users.push(user)
  }

  init() {
    // 洗牌
    shuffleCard(this.cards)
    // 发牌
    for (let i = 0; i < this.beginNum; i++) {
      for (let j = 0; j < this.userNum; j++) {
        this.users[j].addCard(this.cards.pop()!)
      }
    }
    // 排序
    this.users.forEach((user) => user.sortCards())
  }
}
