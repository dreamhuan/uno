import { EColor, ETurn, EPattern, ECardType, ENumber } from '../entity/common'
import { checkUno, genAGroupOfCard, shuffleCard } from '../service'
import { Card } from './Card'
import { User } from './User'

export class Game {
  roomId!: string // 房间号，仅联机用到
  isStarted = false // 游戏是否开始，仅联机用到
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
  currentUserId = '' // 当前出牌用户id，仅联机用到
  userId = '' // 当前游戏用户id，仅联机用到
  prevUser?: User // 上一个出牌用户
  prevCard?: Card // 上一个出牌
  needAddCardList: Card[] = [] // 累计的+2+4
  needAddCardNum = 0 // 累计的惩罚抽牌数
  isGetCard?: boolean // 是否抽牌
  playFirstId = '' // 可以抢出牌的用户id，仅联机用到
  playFirstCardId = '' // 可以抢出牌的牌的id，仅联机用到

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

  reset() {
    this.isStarted = false
    this.users = []
    this.cards = []
    this.alreadyCards = []
    this.currentTurn = ETurn.CCW
    this.currentColor = undefined
    this.currentPattern = undefined
    this.currentNum = undefined
    this.currentUserIdx = 0
    this.currentUserId = ''
    this.userId = ''
    this.prevUser = undefined
    this.prevCard = undefined
    this.needAddCardList = []
    this.needAddCardNum = 0
    this.isGetCard = false
    this.playFirstId = ''
    this.playFirstCardId = ''
    for (let i = 0; i < this.cardGroupNum; i++) {
      this.cards.push(...genAGroupOfCard())
    }
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
    this.isGetCard = true
    const currentUser = this.users[this.currentUserIdx]
    while (--num >= 0) {
      const card = this.cards.pop()
      if (!card) {
        // 牌不够了，重新洗牌
        shuffleCard(this.alreadyCards)
        this.cards.push(...this.alreadyCards)
        const card = this.cards.pop()
        currentUser.addCard(card!)
        continue
      }
      currentUser.addCard(card)
    }
    this.needAddCardNum = 0
    this.needAddCardList = []
  }

  // 抢牌逻辑
  checkPlayFirst(card: Card) {
    this.playFirstId = ''
    this.playFirstCardId = ''
    if (card.type === ECardType.Num) {
      this.users.some((user) => {
        const theSameCard = user.cards.find(
          (c) => c.num === card.num && c.color === card.color
        )
        if (theSameCard) {
          this.playFirstId = user.id
          this.playFirstCardId = theSameCard.id
          return true
        }
      })
    }
  }

  playFirst(userId: string) {
    if (this.playFirstId !== userId) {
      return
    }
    let currentUser: User | undefined
    let currentUserIdx: number | undefined
    let cardIdx: number | undefined
    this.users.forEach((user, i) => {
      if (user.id === userId) {
        currentUser = user
        currentUserIdx = i
        user.cards.forEach((card, j) => {
          if (card.id === this.playFirstCardId) {
            cardIdx = j
          }
        })
      }
    })
    this.playFirstId = ''
    this.playFirstCardId = ''
    console.log('playFirst', currentUser, currentUserIdx, cardIdx)
    if (
      currentUser === undefined ||
      currentUserIdx === undefined ||
      cardIdx === undefined
    ) {
      return
    }
    this.currentUserIdx = currentUserIdx
    this.currentUserId = currentUser.id
    console.log('game============', {
      currentTurn: this.currentTurn,
      currentColor: this.currentColor,
      currentPattern: this.currentPattern,
      currentNum: this.currentNum,
      currentUserIdx: this.currentUserIdx,
      prevCard: this.prevCard,
      needAddCardNum: this.needAddCardNum,
    })
    const card = currentUser.sendCard(cardIdx)
    console.log('card', card)
    if (card) {
      this.isGetCard = false
      this.alreadyCards.push(card)
      this.prevCard = card
      this.currentColor = card.color
      this.currentPattern = card.pattern
      this.currentNum = card.num

      const unoStatus = checkUno(currentUser)
      this.prevUser = this.users[this.currentUserIdx]
      if (unoStatus === 'WIN') {
        if (card.type === ECardType.Num) {
          return 'WIN'
        } else {
          // 最后一张不是数字牌要再抓一张
          this.userGetCard(1)
          return 'UNO'
        }
      } else {
        // 更换出牌用户下标
        this.currentUserIdx =
          this.currentTurn === ETurn.CCW
            ? (this.currentUserIdx + 1) % this.userNum
            : (this.currentUserIdx - 1 + this.userNum) % this.userNum
        return unoStatus
      }
    }
  }

  skipPlayFirst() {
    this.playFirstId = ''
    this.playFirstCardId = ''
  }

  // cardIdx -1 则直接抽牌 ，否则出牌，颜色表示王牌选的色
  nextTurn(cardIdx?: number, curColor: EColor = EColor.R) {
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
    const card = cardIdx === -1 ? null : currentUser.sendCard(cardIdx)
    console.log('card', card)
    if (card) {
      this.isGetCard = false
      this.alreadyCards.push(card)
      this.prevCard = card
      this.currentColor = card.color
      this.currentPattern = card.pattern
      this.currentNum = card.num
      if (card.color === EColor.A) {
        this.currentColor = curColor
        this.currentPattern = undefined
        this.currentNum = undefined
      }
      let skipUser = null
      // 如果是+2，+4，需要累加抽牌
      if (card.pattern === EPattern.Two) {
        this.needAddCardNum += 2
        this.needAddCardList.push(card)
      } else if (card.pattern === EPattern.Four) {
        this.needAddCardNum += 4
        this.needAddCardList.push(card)
      } else if (card.pattern === EPattern.Turn) {
        // 换向
        this.currentTurn = this.currentTurn === ETurn.CCW ? ETurn.CW : ETurn.CCW
      } else if (card.pattern === EPattern.Skip) {
        // 跳过
        skipUser = this.users[this.currentUserIdx]
        this.currentUserIdx =
          this.currentTurn === ETurn.CCW
            ? (this.currentUserIdx + 1) % this.userNum
            : (this.currentUserIdx - 1 + this.userNum) % this.userNum
      }
      // 抢牌逻辑判断
      this.checkPlayFirst(card)
      const unoStatus = checkUno(currentUser)
      if (unoStatus === 'WIN') {
        this.prevUser = this.users[this.currentUserIdx]
        if (card.type === ECardType.Num) {
          return 'WIN'
        } else {
          // 最后一张不是数字牌要再抓一张
          const card = this.cards.pop()
          if (!card) {
            // 牌不够了，重新洗牌
            shuffleCard(this.alreadyCards)
            this.cards.push(...this.alreadyCards)
            const card = this.cards.pop()
            currentUser.addCard(card!)
          } else {
            currentUser.addCard(card)
          }
          return 'UNO'
        }
      } else {
        // 更换出牌用户下标
        this.prevUser = skipUser ? skipUser : this.users[this.currentUserIdx]
        this.currentUserIdx =
          this.currentTurn === ETurn.CCW
            ? (this.currentUserIdx + 1) % this.userNum
            : (this.currentUserIdx - 1 + this.userNum) % this.userNum
        return unoStatus
      }
    } else {
      this.userGetCard(this.needAddCardNum || 1)
      this.prevUser = this.users[this.currentUserIdx]
      this.currentUserIdx =
        this.currentTurn === ETurn.CCW
          ? (this.currentUserIdx + 1) % this.userNum
          : (this.currentUserIdx - 1 + this.userNum) % this.userNum
      return false
    }
  }
}
