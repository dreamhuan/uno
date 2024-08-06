import cx from 'classnames'
import { Button, message, Popover } from 'antd'
import styles from './style.module.scss'
import { useContext, useState } from 'react'
import { GameContext } from '../../AppUI'
import { ECardType, EColor } from '../../core/entity/common'
import { checkSendCard } from '../../core/service'

const map = {
  [EColor.R]: {
    cls: styles.Red,
    color: '红色',
  },
  [EColor.G]: {
    cls: styles.Green,
    color: '绿色',
  },
  [EColor.B]: {
    cls: styles.Blue,
    color: '蓝色',
  },
  [EColor.Y]: {
    cls: styles.Yellow,
    color: '黄色',
  },
} as any

export default function Operations() {
  const {
    currentCard,
    currentCardIdx,
    setCurrentCard,
    setCurrentCardIdx,
    game,
    forceRender,
  } = useContext(GameContext)
  const [open, setOpen] = useState(false)

  const content = (
    <div>
      {Object.keys(map).map((key) => {
        const { cls, color } = map[key]
        return (
          <Button
            shape="circle"
            className={cx(styles.ColorBtn, cls)}
            onClick={() => {
              const status = game.nextTurn(currentCardIdx, key as EColor)
              forceRender()
              if (status) {
                message.success(status)
              }
              setOpen(false)
            }}
          >
            {color}
          </Button>
        )
      })}
    </div>
  )

  console.log('currentCard', currentCard)
  return (
    <div className={styles.Operations}>
      <Button
        onClick={() => {
          game.nextTurn(-1)
          setCurrentCardIdx(-1)
          setCurrentCard(undefined)
        }}
      >
        抓牌
      </Button>
      <Popover content={content} title="选择颜色" open={open}>
        <Button
          onClick={() => {
            if (!currentCard) {
              message.error('请选择要出的牌')
              return
            }
            const canSend = checkSendCard(game, currentCard)
            if (!canSend) {
              message.error('不能出这张牌')
              return
            }
            if (currentCard.type === ECardType.King) {
              setOpen(true)
            } else {
              const status = game.nextTurn(currentCardIdx)
              setCurrentCardIdx(-1)
              setCurrentCard(undefined)
              forceRender()
              if (status) {
                message.success(status)
              }
            }
          }}
        >
          出牌
        </Button>
      </Popover>
      <Button
        onClick={() => {
          const status = game.nextTurn()
          forceRender()
          if (status) {
            message.success(status)
          }
        }}
      >
        下一轮
      </Button>
    </div>
  )
}
