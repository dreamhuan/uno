import { Card } from '../entity/Card'
import { ECardType, EColor, ENumber, EPattern } from '../entity/common'
import { Game } from '../entity/Game'
import { User } from '../entity/User'
import { traverseEnum } from '../utils'

/**
 * 生成一副牌
 */
export function genAGroupOfCard() {
  const cards: Card[] = []
  // 4种颜色
  traverseEnum(EColor, (color) => {
    if (color === EColor.A) {
      return
    }
    // 数字牌
    traverseEnum(ENumber, (number) => {
      cards.push(new Card(ECardType.Num, color, number))
      if (number !== ENumber._0) {
        // 除了0之外其他数字牌都有两张
        cards.push(new Card(ECardType.Num, color, number))
      }
    })
    // 功能牌
    traverseEnum(EPattern, (pattern) => {
      if (pattern === EPattern.Change || pattern === EPattern.Four) {
        return
      }
      // 每种功能牌有2张
      cards.push(new Card(ECardType.Func, color, undefined, pattern))
      cards.push(new Card(ECardType.Func, color, undefined, pattern))
    })
  })
  // 万能牌每种各4张
  for (let i = 0; i < 4; i++) {
    cards.push(new Card(ECardType.King, EColor.A, undefined, EPattern.Change))
    cards.push(new Card(ECardType.King, EColor.A, undefined, EPattern.Four))
  }
  return cards
}

/**
 * 洗牌
 */
export function shuffleCard(cards: Card[]) {
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[cards[i], cards[j]] = [cards[j], cards[i]]
  }
}

/**
 * 手牌排序
 */
export function sortCard(cards: Card[]) {
  const colorOrder = {
    [EColor.A]: 0,
    [EColor.R]: 1,
    [EColor.G]: 2,
    [EColor.B]: 3,
    [EColor.Y]: 4,
  }
  const typeOrder = {
    [ECardType.King]: 0,
    [ECardType.Func]: 1,
    [ECardType.Num]: 2,
  }
  const patternOrder = {
    [EPattern.Two]: 0,
    [EPattern.Skip]: 1,
    [EPattern.Turn]: 2,
    [EPattern.Four]: 3,
    [EPattern.Change]: 4,
  }
  cards.sort((a, b) => {
    if (a.color === b.color) {
      if (a.type === b.type) {
        if (a.type === ECardType.Num) {
          return Number(a.num) - Number(b.num)
        }
        return patternOrder[a.pattern!] - patternOrder[b.pattern!]
      }
      return typeOrder[a.type] - typeOrder[b.type]
    }
    return colorOrder[a.color] - colorOrder[b.color]
  })
}

/**
 * 检查是否可以出牌
 */
export function checkSendCard(game: Game, card: Card): boolean {
  // 第一次出牌，还没有设置颜色和图案，只能出数字牌
  if (!game.currentColor && !game.currentNum && !game.currentPattern) {
    return card.type === ECardType.Num
  }
  // 之前是+4，并且需要加牌
  if (game.prevCard?.pattern === EPattern.Four && game.needAddCardNum) {
    return card.pattern === EPattern.Four
  }
  // 之前是+2，并且需要加牌
  if (game.prevCard?.pattern === EPattern.Two && game.needAddCardNum) {
    return card.pattern === EPattern.Two || card.pattern === EPattern.Four
  }
  // 万能牌
  if (card.type === ECardType.King) {
    return true
  }
  // 之前是其他功能牌 或 数字牌 或 已经加过牌了
  return (
    card.color === game.currentColor ||
    (card.num !== undefined && card.num === game.currentNum) ||
    (card.pattern !== undefined && card.pattern === game.currentPattern)
  )
}

/**
 * 检查是否UNO以及获胜
 */
export function checkUno(user: User) {
  if (user.cards.length === 1) {
    return 'UNO'
  }
  if (user.cards.length === 0) {
    return 'WIN'
  }
  return false
}
