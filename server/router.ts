import * as Router from '@koa/router'
import { store } from './store'

export const router = new Router({
  prefix: '/api',
})

router.post('/createRoom', (ctx: any) => {
  let body = {} as { userId: string; userCount: number }
  try {
    body = JSON.parse(ctx.request.body) as any
  } catch (e) {
    console.error(e)
  }
  const roomId = store.createRoom(body.userId, body.userCount)
  ctx.body = {
    status: 0,
    data: {
      roomId,
    },
    msg: 'success',
  }
})

router.post('/joinRoom', (ctx: any) => {
  let body = {} as { userId: string; roomId: string }
  try {
    body = JSON.parse(ctx.request.body) as any
  } catch (e) {
    console.error(e)
  }
  const roomId = store.joinRoom(body.userId, body.roomId)
  ctx.body = {
    status: 0,
    data: {
      roomId,
    },
    msg: 'success',
  }
})

router.get('/storeData', (ctx: any) => {
  const data = store.storeData()
  ctx.body = {
    status: 0,
    data,
    msg: 'success',
  }
})
