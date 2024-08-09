import * as path from 'node:path'
import * as http from 'node:http'
import * as Koa from 'koa'
import * as KoaStatic from 'koa-static'
import * as cors from 'koa2-cors'
import { koaBody } from 'koa-body'
import * as Router from '@koa/router'
import { WebSocket } from 'ws'
import { historyApiFallback } from 'koa2-connect-history-api-fallback'
import { Game } from '../src/core/entity/Game'
import { User } from '../src/core/entity/User'
import { AvatarImgList } from '../src/components/UserInfo/AvatarImgList'

const DEFAULT_COUNT = 4
let userCount = 0

const router = new Router({
  prefix: '/api',
})
router.get('/userCount', (ctx) => {
  ctx.body = {
    status: 0,
    data: {
      value: userCount,
    },
    msg: 'success',
  }
})
router.post('/userCount', (ctx: any) => {
  let body = {} as any
  try {
    body = JSON.parse(ctx.request.body)
  } catch (e) {
    console.error(e)
  }
  userCount = Number(body?.userCount) || DEFAULT_COUNT
  console.log('/userCount', { body, userCount })
  ctx.body = {
    status: 0,
    data: {
      value: userCount,
    },
    msg: 'success',
  }
})

const app = new Koa()
app
  .use(cors())
  .use(historyApiFallback({ whiteList: ['/api'] }))
  .use(KoaStatic(path.join(__dirname, 'public')))
  .use(koaBody())
  .use(router.routes())
  .use(router.allowedMethods())

const server = http.createServer(app.callback())
const wss = new WebSocket.Server({ server })

let userList = [] as string[]
let userMap = {} as Record<string, any>

let globalGame: Game | null = null
const startGame = () => {
  const GAME = new Game(userCount || DEFAULT_COUNT, 7)
  Object.keys(userMap).forEach((key) => {
    const userConf = userMap[key]
    const imgIdx = Math.floor(Math.random() * AvatarImgList.length)
    const user = new User(userConf.id, userConf.name, AvatarImgList[imgIdx])
    GAME.addUser(user)
  })
  GAME.init()
  console.log('start game')
  globalGame = GAME
  return GAME
}

const getGameDataByUserId = (game: Game | null, userId?: string) => {
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
    ...game,
    userId: user.id,
    currentUserId: game?.users[game?.currentUserIdx].id,
    prevUser,
    users: game?.users.map((u) => {
      return {
        id: u.id,
        name: u.name,
        icon: u.icon,
        cards: u.cards.map((card) => (u.id === user.id ? card : 0)),
        // cards: u.cards,
      }
    }),
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
        if (userList.length >= (userCount || DEFAULT_COUNT)) {
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
      case 'action': {
        console.log(data)
        if (!globalGame) break
        const { userId, cardIdx, curColor } = data.data
        const curUser = globalGame.users[globalGame.currentUserIdx]
        // -2 抢，-3 过
        if (curUser.id === userId || [-2, -3].includes(cardIdx)) {
          if (cardIdx === -2) {
            globalGame.playFirst(userId)
          } else if (cardIdx === -3) {
            globalGame.skipPlayFirst()
          } else {
            globalGame.nextTurn(cardIdx, curColor)
          }
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
        if (!globalGame) break
        const { id, name } = data.data
        const curUser = globalGame.users.find((u) => u.id === id)
        if (!curUser) break
        curUser.name = name
        userMap[id].name = name
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
        if (userList.length >= (userCount || DEFAULT_COUNT)) {
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
        }
        break
      }
      case 'reset': {
        userList = []
        userMap = {}
        globalGame = null
        userCount = 0
        break
      }
    }

    // console.log(userMap)
    console.log(userList)
  })

  ws.on('close', () => {
    console.log('Client disconnected')
  })
})

export const SERVER_PORT = 3000
server.listen(SERVER_PORT, () => {
  console.log(`Server is running on http://localhost:${SERVER_PORT}`)
})
