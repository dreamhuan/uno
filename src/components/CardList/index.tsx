import { useContext } from 'react'
import { User } from '../../core/entity/User'
import CardItem from '../CardItem'
import styles from './style.module.scss'
import { GameContext } from '../../common'

type TProps = {
  user: User
}
export default function CardList({ user }: TProps) {
  const { setCurrentCard, currentCard, setCurrentCardIdx } =
    useContext(GameContext)

  const userCards = user.cards
  const chunkSize = 18
  const chunks = []
  for (let i = 0; i < userCards.length; i += chunkSize) {
    chunks.push(userCards.slice(i, i + chunkSize))
  }

  return (
    <div className={styles.CardList}>
      {chunks.map((chunk, chunkIdx) => (
        <div className={styles.CardListChunk}>
          {chunk.map((card, cardIdx) => (
            <CardItem
              key={card.id}
              className={currentCard?.id === card.id ? styles.Active : ''}
              card={card}
              onClick={() => {
                setCurrentCard(card)
                setCurrentCardIdx(chunkSize * chunkIdx + cardIdx)
              }}
            />
          ))}
        </div>
      ))}
    </div>
  )
}
