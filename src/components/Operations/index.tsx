import cx from 'classnames'
import { Button, message, Popover } from 'antd'
import styles from './style.module.scss'
import { useContext, useState } from 'react'
import { GameContext, MyStorage } from '../../common'
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

export default function Operations({
  hiddenNextTurn,
}: {
  hiddenNextTurn?: boolean
}) {
  const isLocal = location.pathname === '/local'
  const {
    currentCard,
    currentCardIdx,
    setCurrentCard,
    setCurrentCardIdx,
    game,
    forceRender,
    nextTurn,
  } = useContext(GameContext)
  const [open, setOpen] = useState(false)
  const palyFunc = () => {
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
      const status = nextTurn(currentCardIdx)
      setCurrentCardIdx(-1)
      setCurrentCard(undefined)
      if (status) {
        message.success(status)
      }
      forceRender()
    }
  }

  console.log('currentCard', currentCard)
  const isFinished = game.users.some((p) => p.cards.length === 0) // 游戏结束
  const isNoGrab = isLocal ? true : game.playFirstId === '' //是否无抢牌人
  const isMyTurn = game.currentUserId === game.userId // 是否轮到我出牌
  const isCanDraw = isMyTurn && isNoGrab && !isFinished // 是否可以抓牌(轮到且无人抢且游戏未结束)
  let isCanPlay = false
  if (currentCard) {
    const canPlay = checkSendCard(game, currentCard)
    isCanPlay = isCanDraw && canPlay // 是否可以出牌(轮到且无人抢且选中的牌可出且游戏未结束)
  }
  let isShowGrab = false
  if (game.playFirstCardId && game.userId) {
    isShowGrab = game.playFirstId === game.userId && !isFinished // 是否显示抢牌按钮(游戏未结束)
  }

  return (
    <div className={styles.Operations}>
      {!isShowGrab && (
        <div className={styles.Operations}>
          <Button
            size="large"
            disabled={!isCanDraw}
            onClick={() => {
              nextTurn(-1)
              setCurrentCardIdx(-1)
              setCurrentCard(undefined)
              forceRender()
            }}
          >
            抓牌
          </Button>
          <Popover
            content={
              <div>
                {Object.keys(map).map((key) => {
                  const { cls, color } = map[key]
                  return (
                    <Button
                      key={color}
                      shape="circle"
                      className={cx(styles.ColorBtn, cls)}
                      onClick={() => {
                        const status = nextTurn(currentCardIdx, key as EColor)
                        if (status) {
                          message.success(status)
                        }
                        setOpen(false)
                        setCurrentCardIdx(-1)
                        setCurrentCard(undefined)
                        forceRender()
                      }}
                    >
                      {color}
                    </Button>
                  )
                })}
              </div>
            }
            title="选择颜色"
            open={open}
          >
            <Button size="large" onClick={palyFunc} disabled={!isCanPlay}>
              出牌
            </Button>
          </Popover>
          {isFinished && (
            <Button
              size="large"
              onClick={() => {
                window.socketSend({
                  type: 'restart',
                  data: {
                    userId: MyStorage.getItem('randomId') || '',
                  },
                })
              }}
            >
              重开
            </Button>
          )}
          {isFinished && (
            <Button
              size="large"
              onClick={() => {
                window.socketSend({
                  type: 'restart',
                  data: {
                    userId: MyStorage.getItem('randomId') || '',
                    changeSeats: true,
                  },
                })
              }}
            >
              换座位
            </Button>
          )}
          {!hiddenNextTurn && (
            <Button
              size="large"
              onClick={() => {
                const status = nextTurn()
                forceRender()
                if (status) {
                  message.success(status)
                }
              }}
            >
              下一轮
            </Button>
          )}
        </div>
      )}

      {isMyTurn && !isNoGrab && !isShowGrab && !isFinished && (
        <div style={{ width: '100%' }}>存在他人可抢牌情况 请稍候</div>
      )}

      {isShowGrab && (
        <div className={styles.Operations}>
          <Button
            size="large"
            onClick={() => {
              nextTurn(-2)
              setCurrentCardIdx(-1)
              setCurrentCard(undefined)
              forceRender()
            }}
          >
            抢牌
          </Button>
          <Button
            size="large"
            onClick={() => {
              nextTurn(-3)
              setCurrentCardIdx(-1)
              setCurrentCard(undefined)
              forceRender()
            }}
          >
            取消
          </Button>
        </div>
      )}
    </div>
  )
}
