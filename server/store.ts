import { WebSocket } from 'ws'
import { Game } from '../src/core/entity/Game'
import { User } from '../src/core/entity/User'
import { AvatarImgList } from '../src/components/UserInfo/AvatarImgList'
import { EColor } from '../src/core/entity/common'

type StoreRoom = {
  id: string
  userIdList: string[]
  game: Game
  userCount: number
}
type StoreUser = {
  id: string
  user: User
  client?: WebSocket
}
class Store {
  roomIdList = [] as string[]
  roomMap = {} as Record<string, StoreRoom>
  userIdList = [] as string[]
  userMap = {} as Record<string, StoreUser>

  private static instance: Store
  private constructor() {}
  public static getInstance(): Store {
    if (!this.instance) {
      this.instance = new Store()
    }
    return this.instance
  }

  storeData() {
    // 返回给前端的数据，过滤掉循环引用
    return {
      roomIdList: this.roomIdList,
      roomMap: Object.keys(this.roomMap).reduce((acc, cur) => {
        const storeRoom = this.roomMap[cur]
        acc[cur] = {
          id: storeRoom.id,
          userIdList: storeRoom.userIdList,
          userCount: storeRoom.userCount,
          game: {
            ...storeRoom.game,
            users: storeRoom.game?.users.map((u) => {
              return {
                id: u.id,
                name: u.name,
                icon: u.icon,
                cards: u.cards,
              }
            }),
          },
        }
        return acc
      }, {}),
      userIdList: this.userIdList,
      userMap: Object.keys(this.userMap).reduce((acc, cur) => {
        const storeUser = this.userMap[cur]
        const user = storeUser.user
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { game, ...others } = user
        acc[cur] = {
          id: storeUser.id,
          user: {
            ...others,
          },
        }
        return acc
      }, {}),
    }
  }

  createUser(userId: string, game: Game) {
    if (!this.userIdList.includes(userId)) {
      const imgIdx = Math.floor(Math.random() * AvatarImgList.length)
      const userName = 'user' + imgIdx
      const user = new User(userId, userName, AvatarImgList[imgIdx])
      user.game = game
      this.userIdList.push(userId)
      this.userMap[userId] = {
        id: userId,
        user,
      }
    }
  }

  createRoom(userId: string, userCount: number) {
    let roomId = Math.floor(100000 + Math.random() * 900000).toString()
    while (this.roomIdList.includes(roomId)) {
      roomId = Math.floor(100000 + Math.random() * 900000).toString()
    }
    this.roomIdList.push(roomId)
    const game = new Game(userCount)
    this.roomMap[roomId] = {
      id: roomId,
      userIdList: [userId],
      game,
      userCount,
    }
    this.createUser(userId, game)
    return roomId
  }

  joinRoom(userId: string, roomId: string) {
    if (!this.roomMap[roomId]) {
      return false
    }
    const room = this.roomMap[roomId]
    const game = room.game
    this.createUser(userId, game)
    if (!room.userIdList.includes(userId)) {
      room.userIdList.push(userId)
    }
    return roomId
  }

  startGame(roomId: string) {
    const room = this.roomMap[roomId]
    if (room.userIdList.length < room.userCount) {
      return false
    }
    const game = room.game
    if (game.isStarted) {
      return game
    }
    room.userIdList.forEach((key) => {
      const user = this.userMap[key].user
      game.addUser(user)
    })
    game.init()
    game.isStarted = true
    console.log('start game roomId', roomId)
    return game
  }

  pushGameInfo(roomId: string) {
    const room = this.roomMap[roomId]
    const game = room.game
    game.users.forEach((user) => {
      this.userMap[user.id]?.client?.send(
        JSON.stringify({
          type: 'start',
          data: this.getGameDataByUserId(game, user.id),
        })
      )
    })
  }

  getGameDataByUserId(game: Game | null, userId?: string) {
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
  gameOpen(data: { userId: string; roomId: string; client: WebSocket }) {
    const { userId, roomId, client } = data
    if (
      !this.userIdList.includes(userId) ||
      !this.roomIdList.includes(roomId)
    ) {
      return
    }
    this.userMap[userId].client = client

    const isStart = this.startGame(roomId)
    if (isStart) {
      this.pushGameInfo(roomId)
    }
  }
  gameAction(data: { userId: string; cardIdx: number; curColor: EColor }) {
    const { userId, cardIdx, curColor } = data
    const user = this.userMap[userId].user
    const game = user?.game
    if (!game) return
    const curUser = game.users[game.currentUserIdx]
    // -2 抢，-3 过
    if (curUser.id === userId || [-2, -3].includes(cardIdx)) {
      switch (cardIdx) {
        case -2:
          game.playFirst(userId)
          break
        case -3:
          game.skipPlayFirst()
          break
        default:
          game.nextTurn(cardIdx, curColor)
      }
      this.pushGameInfo(game.roomId)
    }
  }
  gameUser(data: { userId: string; name: string }) {
    const { userId, name } = data
    const user = this.userMap[userId].user
    const game = user?.game
    if (!game) return
    user.name = name
    this.pushGameInfo(game.roomId)
  }
  gameRestart(data: { userId: string }) {
    const { userId } = data
    const user = this.userMap[userId].user
    const game = user?.game
    if (!game) return
    const roomId = game.roomId
    game.reset()
    this.startGame(roomId)
    this.pushGameInfo(roomId)
  }
  gameReset() {
    this.roomIdList = []
    this.roomMap = {}
    this.userIdList = []
    this.userMap = {}
  }
}

export const store = Store.getInstance()
