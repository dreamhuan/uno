import { ECardType, EColor, ENumber, EPattern } from './common'

export class Card {
  type!: ECardType
  color!: EColor
  num?: ENumber
  pattern?: EPattern
  constructor(
    type: ECardType,
    color: EColor,
    num?: ENumber,
    pattern?: EPattern
  ) {
    this.type = type
    this.color = color
    this.num = num
    this.pattern = pattern
  }
}

