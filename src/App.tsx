import CardItem from './components/CardItem'
import styles from './App.module.scss'
import cx from 'classnames'
import Time from './components/Time'
import { Card } from './core/entity/Card'
import { ECardType, EColor, ENumber, EPattern } from './core/entity/common'

const cards = [
  new Card(ECardType.Num, EColor.R, ENumber._7),
  new Card(ECardType.Func, EColor.Y, undefined, EPattern.Skip),
  new Card(ECardType.Func, EColor.G, undefined, EPattern.Turn),
  new Card(ECardType.Func, EColor.B, undefined, EPattern.Two),
  new Card(ECardType.King, EColor.A, undefined, EPattern.Four),
  new Card(ECardType.King, EColor.A, undefined, EPattern.Change),
]

function App() {
  return (
    <div className={cx(styles.Game, styles.Container)}>
      <div>123</div>
      {cards.map((card, index) => (
        <CardItem key={index} card={card} />
      ))}
      <Time />
    </div>
  )
}

export default App
