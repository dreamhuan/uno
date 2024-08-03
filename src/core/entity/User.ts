import { Card } from './Card'

export class User {
  name: string
  icon: string
  cards?: Card[]

  constructor(name: string, icon: string, cards?: Card[]) {
    this.name = name
    this.icon = icon
    this.cards = cards
  }
}
