import { sortCard } from '../service'
import { getRandomStr } from '../utils'
import { Card } from './Card'

export class User {
  id: string
  name: string
  icon: string
  cards: Card[] = []

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
}
