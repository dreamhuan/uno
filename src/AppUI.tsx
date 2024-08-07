import { createContext, useCallback, useMemo, useState } from 'react'
import cx from 'classnames'
import { RedoOutlined, UndoOutlined } from '@ant-design/icons'
import Time from './components/Time'
import CardList from './components/CardList'
import CardItem from './components/CardItem'
import Operations from './components/Operations'
import UserInfo from './components/UserInfo'
import { Game } from './core/entity/Game'
import { User } from './core/entity/User'
import styles from './App.module.scss'
import { EColor, ETurn } from './core/entity/common'
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

const COLOR_MAP: Record<EColor, string> = {
  [EColor.A]: '#000',
  [EColor.R]: 'red',
  [EColor.Y]: '#ffc107',
  [EColor.B]: '#2156f3',
  [EColor.G]: 'green',
}

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
  const currentColorBlockStyle = useMemo(() => {
    if (game.currentColor) {
      return { backgroundColor: COLOR_MAP[game.currentColor] };
    }

    return undefined;
  }, [game.currentColor])

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
            <div>当前颜色: <span className={styles.currentColorBlock} style={currentColorBlockStyle}>{game.currentColor}</span></div>
            <div>当前用户：{game.users[game.currentUserIdx].name}</div>
          </div>
          {/* <div>
            <span>倒计时</span>
            <Time />
          </div> */}
        </div>
        <div className={styles.topUser}>
          <UserInfo imgIndex={2} isTurn={game.currentUserIdx === 2} user={game.users[2]}></UserInfo>
        </div>
        <div className={styles.leftUser}>
          <UserInfo imgIndex={3} isTurn={game.currentUserIdx === 3} user={game.users[3]}></UserInfo>
        </div>
        <div className={styles.rightUser}>
          <UserInfo imgIndex={1} isTurn={game.currentUserIdx === 1} user={game.users[1]}></UserInfo>
        </div>
        <div className={styles.CurrentCard}>
          <div>上一轮出牌</div>
          {game.prevCard ? <CardItem card={game.prevCard} /> : <div className={styles.EmptyCard}></div>}
          <div>
            <span>累计惩罚抓牌数：{game.needAddCardNum}</span>
          </div>
        </div>

        <div className={styles.OperateBtns}>
          <Operations />
        </div>

        <div className={styles.UserCardInfo}>
          <div className={styles.MyUser}>
            <UserInfo imgIndex={0} isTurn={game.currentUserIdx === 0} user={game.users[0]}></UserInfo>
          </div>
          <div className={styles.MyCardList}>
            <CardList user={game.users[0]} />
          </div>
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
