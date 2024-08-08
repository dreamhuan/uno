import * as path from 'node:path'
import * as http from 'node:http'
import * as Koa from 'koa'
import * as KoaStatic from 'koa-static'
import { WebSocket } from 'ws'
import { router } from './router'
import { Game } from '../src/core/entity/Game'
import { User } from '../src/core/entity/User'
import { AvatarImgList } from '../src/components/UserInfo/AvatarImgList'

const app = new Koa()
app
  .use(KoaStatic(path.join(__dirname, 'public')))
  .use(router.routes())
  .use(router.allowedMethods())

const server = http.createServer(app.callback())
const wss = new WebSocket.Server({ server })

const userList = [] as string[]
const userMap = {} as Record<string, any>

let globalGame: Game
const startGame = () => {
  const GAME = new Game(4, 7)
  Object.keys(userMap).forEach((key) => {
    const userConf = userMap[key]
    const imgIdx = Math.floor(Math.random() * 400)
    const user = new User(userConf.id, userConf.name, AvatarImgList[imgIdx])
    GAME.addUser(user)
  })
  GAME.init()
  console.log('start game')
  globalGame = GAME
  return GAME
}

const getGameDataByUserId = (game?: Game, userId?: string) => {
  const user = game?.users.find((user) => user.id === userId)
  if (!user) return null
  let prevUser
  if (game?.prevUser) {
    prevUser = {
      id: game.prevUser.id,
      name: game.prevUser.name,
      icon: game.prevUser.icon,
      cards: game.prevUser.cards,
    }
  }
  return {
    userId: user.id,
    userList,
    cardList: user.cards,
    currentTurn: game?.currentTurn,
    currentColor: game?.currentColor,
    currentPattern: game?.currentPattern,
    currentNum: game?.currentNum,
    currentUserIdx: game?.currentUserIdx,
    currentUserId: game?.users[game?.currentUserIdx].id,
    prevCard: game?.prevCard,
    needAddCardNum: game?.needAddCardNum,
    users: game?.users.map((u) => {
      return {
        id: u.id,
        name: u.name,
        icon: u.icon,
        cards:u.cards.map((card) => u.id === user.id ? card : 0),
        // cards: u.cards,
      }
    }),
    alreadyCards: game?.alreadyCards,
    prevUser,
    isGetCard: game?.isGetCard,
  }
}
type S = WebSocket & { id: string }
wss.on('connection', (ws: S) => {
  console.log('A new client connected!')

  ws.on('message', (buffer) => {
    const message = buffer.toString()
    console.log('Received:', message)
    const data = JSON.parse(message)
    let game: Game
    switch (data.type) {
      case 'open': {
        const id = data.id
        ws.id = id
        if (!userList.includes(id)) {
          userList.push(id)
          userMap[ws.id] = {
            id,
            client: ws,
            idx: userList.length - 1,
          }
        } else {
          userMap[ws.id].client = ws
        }
        if (userList.length === 4) {
          game = globalGame || startGame()
          game.users.forEach((user) => {
            userMap[user.id].client.send(
              JSON.stringify({
                type: 'start',
                data: getGameDataByUserId(game, user.id),
              })
            )
          })
        }
        break
      }
      case 'init':
        userMap[ws.id].name = data.name
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(
              JSON.stringify({
                type: 'init',
                data: {
                  userIdList: userList,
                },
              })
            )
          }
        })
        break
      case 'action': {
        console.log(data)
        const { userId, cardIdx, curColor } = data.data
        const curUser = globalGame.users[globalGame.currentUserIdx]
        if (curUser.id === userId) {
          globalGame.nextTurn(cardIdx, curColor)
          globalGame.users.forEach((user) => {
            userMap[user.id].client.send(
              JSON.stringify({
                type: 'start',
                data: getGameDataByUserId(globalGame, user.id),
              })
            )
          })
        }
        break
      }
      case 'user': {
        console.log(data)
        const { id, name, icon } = data.data
        const curUser = globalGame.users.find((u) => u.id === id)
        if (!curUser) break
        curUser.name = name
        globalGame.users.forEach((user) => {
          userMap[user.id].client.send(
            JSON.stringify({
              type: 'start',
              data: getGameDataByUserId(globalGame, user.id),
            })
          )
        })
        break
      }
      case 'restart': {
        game = startGame()
        globalGame = game
        game.users.forEach((user) => {
          userMap[user.id].client.send(
            JSON.stringify({
              type: 'start',
              data: getGameDataByUserId(game, user.id),
            })
          )
        })
        break
      }
    }

    // console.log(userMap)
    // console.log(userList)
  })

  ws.on('close', () => {
    console.log('Client disconnected')
  })
})

const port = 3000
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})
