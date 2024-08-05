import { useState } from 'react'
import cx from 'classnames'
import { Button, Popover } from 'antd'
import styles from './style.module.scss'

const content = (
  <div>
    <Button shape="circle" className={cx(styles.ColorBtn, styles.RedBtn)}>
      红色
    </Button>
    <Button shape="circle" className={cx(styles.ColorBtn, styles.BlueBtn)}>
      篮色
    </Button>
    <Button shape="circle" className={cx(styles.ColorBtn, styles.GreenBtn)}>
      绿色
    </Button>
    <Button shape="circle" className={cx(styles.ColorBtn, styles.YellowBtn)}>
      黄色
    </Button>
  </div>
)

export default function Operations() {
  const [open, setOpen] = useState(false)

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
  }

  return (
    <div className={styles.Operations}>
      <Button>抓牌</Button>
      <Popover
        content={content}
        title="选择颜色"
        trigger="click"
        open={open}
        onOpenChange={handleOpenChange}
      >
        <Button>出牌</Button>
      </Popover>
    </div>
  )
}
