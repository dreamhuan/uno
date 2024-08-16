import { createContext } from 'react'
import { EColor } from './core/entity/common.ts'
import { Game } from './core/entity/Game.ts'
import { Card } from './core/entity/Card.ts'

export const COLOR_MAP: Record<EColor, string> = {
  [EColor.A]: '#000',
  [EColor.R]: 'red',
  [EColor.Y]: '#ffc107',
  [EColor.B]: '#2156f3',
  [EColor.G]: 'green',
}

const WS_SERVER_DEV_PORT = 3000

/**
 * @description HTTPS 默认当作线上反代环境，先当作固定 443 端口
 */
export const WS_SERVER_HOST = `${location.hostname}:${
  window.location.protocol === 'https:' ? 443 : WS_SERVER_DEV_PORT
}`

/**
 * 带协议头的地址
 */
export const WS_SERVER_URL = `${
  window.location.protocol === 'https:' ? 'wss:' : 'ws:'
}//${WS_SERVER_HOST}`

export const GameContext = createContext<{
  game: Game
  currentCard?: Card
  setCurrentCard: (card?: Card) => void
  currentCardIdx?: number
  setCurrentCardIdx: (idx: number) => void
  forceRender: () => void
  nextTurn: (cardIdx?: number, curColor?: EColor) => false | 'WIN' | 'UNO'
}>({} as any)

export const isDev =
  location.hostname === 'localhost' || location.hostname === '127.0.0.1'

export class MyStorage {
  static setItem = (key: string, value: string) => {
    if (isDev) {
      sessionStorage.setItem(key, value)
    } else {
      localStorage.setItem(key, value)
    }
  }

  static getItem = (key: string) => {
    if (isDev) {
      return sessionStorage.getItem(key)
    } else {
      return localStorage.getItem(key)
    }
  }
}
