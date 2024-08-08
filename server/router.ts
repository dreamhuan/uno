import * as Router from '@koa/router'

export const router = new Router({
  prefix: '/api',
})
router.get('/text', (ctx) => {
  ctx.body = 'Hello World!'
})
router.get('/json', (ctx) => {
  ctx.body = {
    status: 0,
    data: {
      value: 123,
    },
    msg: 'success',
  }
})
