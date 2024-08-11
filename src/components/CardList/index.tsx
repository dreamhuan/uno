import { useContext, useState } from 'react'
import { User } from '../../core/entity/User'
import CardItem from '../CardItem'
import styles from './style.module.scss'
import { GameContext } from '../../AppUI'

type TProps = {
  user: User
}
export default function CardList({ user }: TProps) {
  const { setCurrentCard, currentCard, setCurrentCardIdx } =
    useContext(GameContext)

  const userCards = user.cards
  const userCardsLength = user.cards.length
  const chunkSize = 16
  const chunks = []
  for (let i = 0; i < userCards.length; i += chunkSize) {
    chunks.push(userCards.slice(i, i + chunkSize))
  }

  return (
    <div className={styles.CardList}>
      {chunks.map((chunk, index) => (
        <div className={styles.CardListChunk}>
          {chunk.map((card, index) => (
            <CardItem
              key={card.id}
              className={currentCard?.id === card.id ? styles.Active : ''}
              card={card}
              onClick={() => {
                setCurrentCard(card)
                setCurrentCardIdx(index)
              }}
            />
          ))}
        </div>
      ))}
    </div>
  )
}
