import styles from './App.module.scss'
import cx from 'classnames'
import Time from './components/Time'
import { Game } from './core/entity/Game'
import { User } from './core/entity/User'
import CardList from './components/CardList'

const game = new Game(4, 24)
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
  return (
    <div className={cx(styles.Game, styles.Container)}>
      <div>123</div>
      <CardList user={game.users[0]} />
      <Time />
    </div>
  )
}

export default App
