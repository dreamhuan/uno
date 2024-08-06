import { useContext, useState } from 'react'
import { User } from '../../core/entity/User'
import CardItem from '../CardItem'
import styles from './style.module.scss'
import { GameContext } from '../../AppUI'

type TProps = {
  user: User
}
export default function CardList({ user }: TProps) {
  const { setCurrentCard, currentCardIdx, setCurrentCardIdx } =
    useContext(GameContext)

  return (
    <div className={styles.CardList}>
      {user.cards.map((card, index) => (
        <CardItem
          className={currentCardIdx === index ? styles.Active : ''}
          card={card}
          onClick={() => {
            setCurrentCard(card)
            setCurrentCardIdx(index)
          }}
        />
      ))}
    </div>
  )
}
