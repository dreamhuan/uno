import { EColor } from './core/entity/common.ts'

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
export const WS_SERVER_HOST = `${location.hostname}:${window.location.protocol === 'https:' ? 443 : WS_SERVER_DEV_PORT}`;

/**
 * 带协议头的地址
 */
export const WS_SERVER_URL = `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${WS_SERVER_HOST}`;
