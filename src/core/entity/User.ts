import { checkSendCard, sortCard } from '../service'
import { getRandomStr } from '../utils'
import { Card } from './Card'
import { Game } from './Game'

export class User {
  id: string
  name: string
  icon: string
  cards: Card[] = []
  game!: Game

  constructor(name: string, icon: string, cards?: Card[]) {
    this.id = getRandomStr()
    this.name = name
    this.icon = icon
    this.cards = cards || []
  }

  addCard(card: Card) {
    this.cards?.push(card)
  }

  sortCards() {
    sortCard(this.cards)
  }

  sendCard(idx?: number) {
    if (idx) {
      const card = this.cards[idx]
      const canSend = checkSendCard(this.game, card)
      if (!canSend) {
        return false
      }
      this.cards.splice(idx, 1)
      return card
    }
    // 没有指定要出哪张牌，则自动出牌
    for (let i = 0; i < this.cards.length; i++) {
      const card = this.cards[i]
      const canSend = checkSendCard(this.game, card)
      if (canSend) {
        this.cards.splice(i, 1)
        return card
      }
    }
    return false
  }
}
