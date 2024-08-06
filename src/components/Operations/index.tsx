import cx from 'classnames'
import { Button, Popover } from 'antd'
import styles from './style.module.scss'
import { useContext } from 'react'
import { GameContext } from '../../AppUI'

const map = {
  [styles.R]: '红色',
  [styles.G]: '绿色',
  [styles.B]: '蓝色',
  [styles.Y]: '黄色',
} as any
const content = (
  <div>
    {Object.keys(map).map((key) => {
      return (
        <Button shape="circle" className={cx(styles.ColorBtn, key)}>
          {map[key]}
        </Button>
      )
    })}
  </div>
)

export default function Operations() {
  const { currentCard } = useContext(GameContext)

  return (
    <div className={styles.Operations}>
      <Button>抓牌</Button>
      {currentCard?.type === 'king' ? (
        <Popover content={content} title="选择颜色" trigger="click">
          <Button>出牌</Button>
        </Popover>
      ) : (
        <Button>出牌</Button>
      )}
    </div>
  )
}
