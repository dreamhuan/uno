import { useContext, useState } from 'react'
import { User } from '../../core/entity/User'
import CardItem from '../CardItem'
import styles from './style.module.scss'
import { GameContext } from '../../AppUI'

type TProps = {
  user: User
}
export default function CardList({ user }: TProps) {
  const { setCurrentCard } = useContext(GameContext)
  const [activeIndex, setActiveIndex] = useState(-1);


  return (
    <div className={styles.CardList}>
      {user.cards.map((card, index) => (
        <CardItem
          className={activeIndex === index ? styles.Active : ''}
          card={card}
          onClick={() => {
            setCurrentCard(card)
            setActiveIndex(index)
          }}
        />
      ))}
    </div>
  )
}
