import { useEffect, useState } from 'react'
import cx from 'classnames'
import { RedoOutlined, UndoOutlined } from '@ant-design/icons'
import CardList from './components/CardList'
import CardItem from './components/CardItem'
import Operations from './components/Operations'
import UserInfo from './components/UserInfo'
import { User } from './core/entity/User'
import styles from './App.module.scss'
import { EColor, ETurn } from './core/entity/common'
import { Card } from './core/entity/Card'
import { GameContext } from './AppUI'
import { COLOR_MAP, WS_SERVER_URL } from './const.ts'
import { Game } from './core/entity/Game.ts'

function App() {
  const [_, fRender] = useState(0)
  const forceRender = () => fRender((prev) => prev + 1)
  const [game, setGame] = useState<Game>()
  const [nextTurn, setNextTurn] = useState<any>()
  const [currentCard, setCurrentCard] = useState<Card | undefined>()
  const [currentCardIdx, setCurrentCardIdx] = useState<number>(-1)

  useEffect(() => {
    async function main() {
      const ws = new WebSocket(WS_SERVER_URL)
      ws.onopen = function () {
        console.log('ws onopen')
        let randomId = sessionStorage.getItem('randomId')
        if (!randomId) {
          randomId = Math.random().toString(36).substring(2, 15)
          sessionStorage.setItem('randomId', randomId)
        }
        ws.send(JSON.stringify({ type: 'open', id: randomId }))
        window.socketSend = (data) => {
          const str = JSON.stringify(data)
          ws.send(str)
        }
      }
      ws.onmessage = function (e) {
        console.log('ws onmessage')
        const data = JSON.parse(e.data)
        console.log(data)
        const nextTurn = (cardIdx?: number, curColor: EColor = EColor.R) => {
          ws.send(
            JSON.stringify({
              type: 'action',
              data: {
                userId: sessionStorage.getItem('randomId'),
                cardIdx,
                curColor,
              },
            })
          )
        }
        if (data.type === 'start') {
          setGame?.(data.data)
          setNextTurn(() => nextTurn)
        }
      }
    }
    main()
  }, [])

  console.log('game', game)
  if (!game) {
    return <div>waiting...</div>
  }

  const colorBgStyle = game.currentColor
    ? { backgroundColor: COLOR_MAP[game.currentColor as EColor] }
    : undefined
  const curUserIndex = game.users.findIndex((u: User) => u.id === game.userId)

  const userNum = game.users.length
  // 屏幕右上左三方的用户下标
  let userPartArr = [] as any
  switch (userNum) {
    case 4:
      userPartArr = [[1], [2], [3]]
      break
    case 5:
      userPartArr = [[1], [2, 3], [4]]
      break
    case 6:
      userPartArr = [[1, 2], [3, 4], [5]]
      break
    case 7:
      userPartArr = [
        [1, 2],
        [3, 4],
        [5, 6],
      ]
      break
    case 8:
      userPartArr = [
        [1, 2],
        [3, 4, 5],
        [6, 7],
      ]
      break
  }
  userPartArr.forEach((arr: any) => {
    arr.forEach((item: number, i: number) => {
      arr[i] = (item + curUserIndex) % userNum
    })
  })

  console.log({
    userNum,
    userPartArr,
  })

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
      <div className={cx(styles.Game, styles.Container)}>
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
          {/* <UserInfo
            placement="right"
            imgSrc={game.users[(curUserIndex + 2) % 4].icon}
            isTurn={game.currentUserIdx === (curUserIndex + 2) % 4}
            user={game.users[(curUserIndex + 2) % 4]}
          ></UserInfo> */}
          {userPartArr[1].reverse().map((userIdx: number) => (
            <UserInfo
              placement="right"
              imgSrc={game.users[userIdx].icon}
              isTurn={game.currentUserIdx === userIdx}
              user={game.users[userIdx]}
            ></UserInfo>
          ))}
        </div>
        <div className={styles.leftUser}>
          {/* <UserInfo
            placement="right"
            imgSrc={game.users[(curUserIndex + 3) % 4].icon}
            isTurn={game.currentUserIdx === (curUserIndex + 3) % 4}
            user={game.users[(curUserIndex + 3) % 4]}
          ></UserInfo> */}
          {userPartArr[2].map((userIdx: number) => (
            <UserInfo
              placement="right"
              imgSrc={game.users[userIdx].icon}
              isTurn={game.currentUserIdx === userIdx}
              user={game.users[userIdx]}
            ></UserInfo>
          ))}
        </div>
        <div className={styles.rightUser}>
          {/* <UserInfo
            placement="left"
            imgSrc={game.users[(curUserIndex + 1) % 4].icon}
            isTurn={game.currentUserIdx === (curUserIndex + 1) % 4}
            user={game.users[(curUserIndex + 1) % 4]}
          ></UserInfo> */}
          {userPartArr[0].reverse().map((userIdx: number) => (
            <UserInfo
              placement="right"
              imgSrc={game.users[userIdx].icon}
              isTurn={game.currentUserIdx === userIdx}
              user={game.users[userIdx]}
            ></UserInfo>
          ))}
        </div>
        <div className={styles.CurrentCard}>
          <div>已出牌</div>
          {game.prevCard ? (
            <div className={styles.AlreadyCards}>
              {game.alreadyCards?.slice(-4)?.map((card: Card) => (
                <CardItem key={card.id} card={card} />
              ))}
            </div>
          ) : (
            <div className={styles.EmptyCard}></div>
          )}
          <div>
            <span>累计惩罚抓牌数：{game.needAddCardNum}</span>
          </div>
        </div>

        <div className={styles.OperateBtns}>
          <Operations hiddenNextTurn />
        </div>

        <div className={styles.UserCardInfo}>
          <div className={styles.MyUser}>
            <UserInfo
              imgSrc={game.users[curUserIndex].icon}
              isTurn={game.currentUserIdx === curUserIndex}
              user={game.users[curUserIndex]}
            ></UserInfo>
          </div>
          <div className={styles.MyCardList}>
            <CardList user={game.users[curUserIndex]} />
          </div>
        </div>
      </div>

      {/* {game.users.map((user: User) => (
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
      <div>已出牌列表：</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: 20 }}>
        {game.alreadyCards &&
          game.alreadyCards.map((card: Card) => (
            <CardItem key={card.id} card={card} />
          ))}
      </div>
    </GameContext.Provider>
  )
}

export default App
