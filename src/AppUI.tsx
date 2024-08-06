import { createContext, useState } from 'react'
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
import { Card } from './core/entity/Card'

const GAME = new Game(4, 7)
const user1 = new User('user1', 'xxx')
const user2 = new User('user2', 'xxx')
const user3 = new User('user3', 'xxx')
const user4 = new User('user4', 'xxx')
GAME.addUser(user1)
GAME.addUser(user2)
GAME.addUser(user3)
GAME.addUser(user4)
GAME.init()
console.log(GAME)

export const GameContext = createContext<{
  game: Game
  setGame: (game: Game) => void
  currentCard?: Card
  setCurrentCard: (card?: Card) => void
  currentCardIdx?: number
  setCurrentCardIdx: (idx: number) => void
  forceRender: () => void
}>({} as any)

function App() {
  const [_, fRender] = useState(0)
  const forceRender = () => fRender((prev) => prev + 1)
  const [game, setGame] = useState(GAME)
  const [currentCard, setCurrentCard] = useState<Card | undefined>()
  const [currentCardIdx, setCurrentCardIdx] = useState<number>(-1)
  return (
    <GameContext.Provider
      value={{
        game,
        setGame,
        currentCard,
        setCurrentCard,
        currentCardIdx,
        setCurrentCardIdx,
        forceRender,
      }}
    >
      <div className={cx(styles.Game, styles.Container)}>
        <div className={styles.GameTips}>
          <div className={styles.CardsOrder}>
            <span>出牌顺序</span>
            {game.currentTurn === ETurn.CCW ? (
              <UndoOutlined />
            ) : (
              <RedoOutlined />
            )}
            <div>颜色: {game.currentColor}</div>
            <div>当前用户：{game.users[game.currentUserIdx].name}</div>
          </div>
          <div>
            <span>倒计时</span>
            <Time />
          </div>
        </div>
        <div className={styles.topUser}></div>
        <div className={styles.CurrentCard}>
          <div>当前出牌</div>
          {game.prevCard && <CardItem card={game.prevCard} />}
          <div>
            <span>累计惩罚抓牌数：</span>
          </div>
        </div>

        <div className={styles.OperateBtns}>
          <Operations />
        </div>

        <div className={styles.UserCardList}>
          <CardList user={game.users[0]} />
        </div>
      </div>

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
      <div>已出牌列表：</div>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {game.alreadyCards &&
          game.alreadyCards.map((card) => <CardItem card={card} />)}
      </div>
    </GameContext.Provider>
  )
}

export default App
