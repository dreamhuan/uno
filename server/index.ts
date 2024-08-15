import * as path from 'node:path'
import * as http from 'node:http'
import * as Koa from 'koa'
import * as KoaStatic from 'koa-static'
import * as cors from 'koa2-cors'
import { koaBody } from 'koa-body'
import { WebSocket } from 'ws'
import { historyApiFallback } from 'koa2-connect-history-api-fallback'
import { store } from './store'

import { router } from './router'
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
wss.on('connection', (ws: WebSocket) => {
  console.log('A new client connected!')

  ws.on('message', (buffer) => {
    const message = buffer.toString()
    const data = JSON.parse(message)
    console.log('Received:', message, data)
    switch (data.type) {
      case 'open': {
        const { userId, roomId } = data?.data || {}
        if (!userId || !roomId) {
          return
        }
        const flag = store.gameOpen({
          userId,
          roomId,
          client: ws,
        })
        if (!flag) {
          ws.send(
            JSON.stringify({ type: 'error', data: '房间不存在,请退出重进' })
          )
        }
        break
      }
      case 'action': {
        const { userId, cardIdx, curColor } = data?.data || {}
        if (!userId) {
          return
        }
        store.gameAction({
          userId,
          cardIdx,
          curColor,
        })
        break
      }
      case 'user': {
        const { userId, name } = data?.data || {}
        if (!userId) {
          return
        }
        store.gameUser({
          userId,
          name,
        })
        break
      }
      case 'restart': {
        const { userId, changeSeats } = data?.data || {}
        if (!userId) {
          return
        }
        store.gameRestart({
          userId,
          changeSeats,
        })
        break
      }
      case 'reset': {
        store.gameReset()
        break
      }
    }
  })

  ws.on('close', () => {
    console.log('Client disconnected')
  })
})

const SERVER_PORT = 3000
const HOSTNAME = '0.0.0.0'

server.listen(SERVER_PORT, HOSTNAME, () => {
  console.log(`Server is running on http://${HOSTNAME}:${SERVER_PORT}`)
})
