import { User } from '../../core/entity/User'
import CardItem from '../CardItem'
import styles from './style.module.scss'

type TProps = {
  user: User
}
export default function CardList({ user }: TProps) {
  return (
    <div className={styles.CardList}>
      {user.cards.map((card) => (
        <CardItem card={card} />
      ))}
    </div>
  )
}
