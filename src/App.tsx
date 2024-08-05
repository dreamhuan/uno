import { useState } from 'react'
import cx from 'classnames'
import { RedoOutlined, UndoOutlined } from '@ant-design/icons'
import Time from './components/Time'
import CardList from './components/CardList'
import CardItem from './components/CardItem'
import Operations from './components/Operations'
import { Game } from './core/entity/Game'
import { User } from './core/entity/User'
import styles from './App.module.scss'
import { ETurn } from './core/entity/common'

const game = new Game(4, 7)
const user1 = new User('user1', 'xxx')
const user2 = new User('user2', 'xxx')
const user3 = new User('user3', 'xxx')
const user4 = new User('user4', 'xxx')
game.addUser(user1)
game.addUser(user2)
game.addUser(user3)
game.addUser(user4)
game.init()
console.log(game)
function App() {
  const [_, forceRender] = useState(0)
  return (
    <div className={cx(styles.Game, styles.Container)}>
      <div className={styles.GameTips}>
        <div className={styles.CardsOrder}>
          <span>出牌顺序</span>
          {game.currentTurn === ETurn.CCW ? <UndoOutlined /> : <RedoOutlined />}
        </div>
      </div>
      <div className={styles.topUser}></div>
      <div className={styles.CurrentCard}>
        <div>当前出牌</div>
        <CardItem card={game.users[0].cards[0]} />
        <div>
          <span>倒计时</span>
          <Time />
        </div>
      </div>

      <div className={styles.OperateBtns}>
        <Operations />
      </div>

      <div className={styles.UserCardList}>
        <CardList user={game.users[0]} />
      </div>
    </div>
  )
}

export default App
