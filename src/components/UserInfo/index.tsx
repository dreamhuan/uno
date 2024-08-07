import styles from './style.module.scss'
import { User } from '../../core/entity/User'
import cx from 'classnames'
import { Popover } from 'antd'
import { useContext } from 'react'
import { GameContext } from '../../AppUI'
import { ECardType, EColor, EPattern } from '../../core/entity/common'

type UProps = {
  user: User
  isTurn: boolean
  imgSrc: any
  placement?: any
}

export default function UserInfo({ user, isTurn, imgSrc, placement }: UProps) {
  const { game } = useContext(GameContext)

  const curUser = game.prevUser

  const currentCardInfoFunc = (playCard: any, isGetCard: any) => {
    let currentColorText = ''
    const mapColor = {
      [EColor.R]: '红',
      [EColor.G]: '绿',
      [EColor.B]: '蓝',
      [EColor.Y]: '黄',
    } as any

    if (game.currentColor) {
      currentColorText = mapColor[game.currentColor]
    }
    const mapPattern = {
      [EPattern.Change]: '换' + currentColorText + '色',
      [EPattern.Skip]: '禁',
      [EPattern.Turn]: currentColorText + '转',
      [EPattern.Four]: '+4，换' + currentColorText + '色',
      [EPattern.Two]: '+2',
    } as any

    if (isGetCard) {
      return '抽牌'
    }
    if (playCard) {
      const { type, pattern, color, num } = playCard
      if (type === ECardType.Num) {
        return mapColor[color] + num
      } else {
        return mapPattern[pattern]
      }
    }
  }

  return (
    <Popover
      placement={placement}
      content={<div>{currentCardInfoFunc(game.prevCard, game.isGetCard)}</div>}
      open={curUser?.id === user.id}
    >
      <div className={cx(styles.UserInfo, isTurn ? styles.playTurnBg : '')}>
        <div className={styles.InfoBox}>
          <div className={styles.headImgInfo}>
            <img src={imgSrc} alt="" />
            <div>{user.name}</div>
          </div>
          <div>剩余牌数： {user.cards.length}</div>
        </div>
      </div>
    </Popover>
  )
}
