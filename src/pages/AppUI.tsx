import { useState } from 'react'
import cx from 'classnames'
import { RedoOutlined, UndoOutlined } from '@ant-design/icons'
import CardList from '../components/CardList'
import CardItem from '../components/CardItem'
import Operations from '../components/Operations'
import UserInfo from '../components/UserInfo'
import { Game } from '../core/entity/Game'
import { User } from '../core/entity/User'
import styles from './style.module.scss'
import { EColor, ETurn } from '../core/entity/common'
import { Card } from '../core/entity/Card'
import user1Img from '../assets/user1.jpg'
import user2Img from '../assets/user2.jpg'
import user3Img from '../assets/user3.jpg'
import user4Img from '../assets/user4.jpg'
import { COLOR_MAP, GameContext } from '../common.ts'
import { useForceRender } from '../hooks/useForceRender.ts'
import { useAdaptMobile } from '../hooks/useAdaptMobile.ts'

const GAME = new Game(4, 7)
const user1 = new User('', '花什么树', user1Img)
const user2 = new User('', 'RiverTree', user2Img)
const user3 = new User('', 'health', user3Img)
const user4 = new User('', 'dream', user4Img)

GAME.addUser(user1)
GAME.addUser(user2)
GAME.addUser(user3)
GAME.addUser(user4)
GAME.init()
console.log(GAME)

function App() {
  const forceRender = useForceRender()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [game, setGame] = useState(GAME)
  const [currentCard, setCurrentCard] = useState<Card | undefined>()
  const [currentCardIdx, setCurrentCardIdx] = useState<number>(-1)
  const { adaptStyle } = useAdaptMobile()

  const nextTurn = (cardIdx?: number, curColor?: EColor) => {
    const res = game.nextTurn(cardIdx, curColor)
    return res
  }
  const colorBgStyle = game.currentColor
    ? { backgroundColor: COLOR_MAP[game.currentColor] }
    : undefined

  return (
    <GameContext.Provider
      value={{
        game,
        currentCard,
        setCurrentCard,
        currentCardIdx,
        setCurrentCardIdx,
        forceRender,
        nextTurn,
      }}
    >
      <div className={cx(styles.Game, styles.Container)} style={adaptStyle}>
        <div className={styles.GameTips}>
          <div className={styles.CardsOrder}>
            <span>出牌顺序</span>
            {game.currentTurn === ETurn.CCW ? (
              <UndoOutlined />
            ) : (
              <RedoOutlined />
            )}
            <div>
              当前颜色:{' '}
              <span className={styles.currentColorBlock} style={colorBgStyle}>
                {game.currentColor}
              </span>
            </div>
            <div>当前用户：{game.users[game.currentUserIdx].name}</div>
          </div>
          {/* <div>
            <span>倒计时</span>
            <Time />
          </div> */}
        </div>
        <div className={styles.topUser}>
          <UserInfo
            placement="right"
            imgSrc={user3Img}
            isTurn={game.currentUserIdx === 2}
            user={game.users[2]}
          ></UserInfo>
        </div>
        <div className={styles.leftUser}>
          <UserInfo
            placement="right"
            imgSrc={user4Img}
            isTurn={game.currentUserIdx === 3}
            user={game.users[3]}
          ></UserInfo>
        </div>
        <div className={styles.rightUser}>
          <UserInfo
            placement="left"
            imgSrc={user2Img}
            isTurn={game.currentUserIdx === 1}
            user={game.users[1]}
          ></UserInfo>
        </div>
        <div className={styles.CurrentCard}>
          <div>已出牌</div>
          {game.prevCard ? (
            <div className={styles.AlreadyCards}>
              {game.alreadyCards &&
                game.alreadyCards
                  .map((card) => <CardItem key={card.id} card={card} />)
                  .slice(-4)}
            </div>
          ) : (
            <div className={styles.EmptyCard}></div>
          )}
          <div>
            <span>累计惩罚抓牌数：{game.needAddCardNum}</span>
          </div>
        </div>

        <div className={styles.OperateBtns}>
          <Operations />
        </div>

        <div className={styles.UserCardInfo}>
          <div className={styles.MyUser}>
            <UserInfo
              imgSrc={user1Img}
              isTurn={game.currentUserIdx === 0}
              user={game.users[0]}
            ></UserInfo>
          </div>
          <div className={styles.MyCardList}>
            <CardList user={game.users[0]} />
          </div>
        </div>
      </div>

      {/* {game.users.map((user) => (
        <div key={user.id}>
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
      ))} */}
      {/* <div>已出牌列表：</div>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {game.alreadyCards &&
          game.alreadyCards.map((card) => (
            <CardItem key={card.id} card={card} />
          ))}
      </div> */}
    </GameContext.Provider>
  )
}

export default App
