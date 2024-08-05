import { EColor, ETurn, EPattern, ECardType, ENumber } from '../entity/common'
import { checkUno, genAGroupOfCard, shuffleCard } from '../service'
import { Card } from './Card'
import { User } from './User'

export class Game {
  userNum!: number // 玩家数量
  cardGroupNum = 1 // 用几组牌，一组108张
  beginNum = 7 // 每个玩家初始手牌数量

  users: User[] = []
  cards: Card[] = []
  alreadyCards: Card[] = []

  currentTurn = ETurn.CCW // 当前出牌顺序
  currentColor?: EColor // 当前出牌颜色
  currentPattern?: EPattern // 当前出牌图案
  currentNum?: ENumber // 当前出牌数字
  currentUserIdx = 0 // 当前出牌用户下标
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

  // 抽牌，返回还需要抽几张牌（可能剩余不够了）
  userGetCard(num: number) {
    const currentUser = this.users[this.currentUserIdx]
    while (--num >= 0) {
      const card = this.cards.pop()
      if (!card) {
        return num + 1
      }
      currentUser.addCard(card)
    }
    this.needAddCardNum = 0
    return 0
  }

  nextTurn() {
    console.log('game============', {
      currentTurn: this.currentTurn,
      currentColor: this.currentColor,
      currentPattern: this.currentPattern,
      currentNum: this.currentNum,
      currentUserIdx: this.currentUserIdx,
      prevCard: this.prevCard,
      needAddCardNum: this.needAddCardNum,
    })
    const currentUser = this.users[this.currentUserIdx]
    const card = currentUser.sendCard(0)
    console.log('card', card)
    if (card) {
      this.alreadyCards.push(card)
      this.prevCard = card
      this.currentColor = card.color
      this.currentPattern = card.pattern
      this.currentNum = card.num
      // TODO： 黑色的牌暂定都换色为红
      if (card.color === EColor.A) {
        this.currentColor = EColor.R
        this.currentPattern = undefined
        this.currentNum = undefined
      }
      // 如果是+2，+4，需要累加抽牌
      if (card.pattern === EPattern.Two) {
        this.needAddCardNum += 2
      } else if (card.pattern === EPattern.Four) {
        this.needAddCardNum += 4
      } else if (card.pattern === EPattern.Turn) {
        // 换向
        this.currentTurn = this.currentTurn === ETurn.CCW ? ETurn.CW : ETurn.CCW
      } else if (card.pattern === EPattern.Skip) {
        // 跳过
        this.currentUserIdx =
          this.currentTurn === ETurn.CCW
            ? (this.currentUserIdx + 1) % this.userNum
            : (this.currentUserIdx - 1 + this.userNum) % this.userNum
      }
      const unoStatus = checkUno(currentUser)
      if (unoStatus === 'WIN') {
        return 'WIN'
      } else {
        // 更换出牌用户下标
        this.currentUserIdx =
          this.currentTurn === ETurn.CCW
            ? (this.currentUserIdx + 1) % this.userNum
            : (this.currentUserIdx - 1 + this.userNum) % this.userNum
        return unoStatus
      }
    } else {
      this.userGetCard(this.needAddCardNum || 1)
      this.currentUserIdx =
        this.currentTurn === ETurn.CCW
          ? (this.currentUserIdx + 1) % this.userNum
          : (this.currentUserIdx - 1 + this.userNum) % this.userNum
    }
  }
}
