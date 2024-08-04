import { Card } from '../entity/Card'
import { ECardType, EColor, ENumber, EPattern } from '../entity/common'
import { traverseEnum } from '../utils'

export function genAGroupOfCard() {
  //生成一副牌
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

export function shuffleCard(cards: Card[]) {
  // 洗牌
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[cards[i], cards[j]] = [cards[j], cards[i]]
  }
}

// 手牌排序
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

export function checkSendCard() {}
export function checkGetCard() {}
export function checkUno() {}
