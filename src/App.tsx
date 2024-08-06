import { useState } from 'react'
import cx from 'classnames'
import { Button, message } from 'antd'
import Time from './components/Time'
import CardList from './components/CardList'
import CardItem from './components/CardItem'
import { Game } from './core/entity/Game'
import { User } from './core/entity/User'
import styles from './App.module.scss'

const game = new Game(4, 3)
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
      <Time />
      <Button
        onClick={() => {
          const status = game.nextTurn()
          forceRender((prev) => prev + 1)
          if (status) {
            message.success(status)
          }
        }}
      >
        下一轮
      </Button>
      {game.users.map((user) => (
        <div>
          <div
            style={{
              color:
                user.id === game.users[game.currentUserIdx].id
                  ? 'red'
                  : 'black',
            }}
          >
            {user.name}
          </div>
          <CardList key={user.id} user={user} />
        </div>
      ))}
      <div>当前用户出牌：{game.users[game.currentUserIdx].name}</div>
      <div>上一家出牌：</div>
      {game.prevCard && <CardItem card={game.prevCard} />}
      <div>已出牌列表：</div>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {game.alreadyCards &&
          game.alreadyCards.map((card) => <CardItem card={card} />)}
      </div>
    </div>
  )
}

export default App
