import { Card } from '../../core/entity/Card'
import { ECardType, EColor, ENumber } from '../../core/entity/common'
import { PatternCenter, PatternTop } from './Pattern'
import cx from 'classnames'
import styles from './style.module.scss'
import { ColorMapBgc, ColorMapC } from './constant'

type IProps = {
  card: Card
  onClick?: () => void
}
export default function CardItem(props: IProps) {
  const { card } = props
  const { type, color, num, pattern } = card

  return (
    <div className={cx(styles.CardItem, ColorMapBgc[color])} onClick={() => {
      props.onClick?.()
    }}>
      <div className={styles.Top}>
        {type === ECardType.Num ? (
          <div className={styles.Num}>{num}</div>
        ) : (
          <PatternTop pattern={pattern!} color={color} />
        )}
      </div>
      <div className={styles.Center}>
        <div className={cx(styles.Content, ColorMapC[color])}>
          {type === ECardType.Num ? (
            <div className={styles.Num}>{num}</div>
          ) : (
            <PatternCenter pattern={pattern!} color={color} />
          )}
        </div>
      </div>
      <div className={styles.Bottom}>
        {type === ECardType.Num ? (
          <div className={styles.Num}>{num}</div>
        ) : (
          <PatternTop pattern={pattern!} color={color} />
        )}
      </div>
    </div>
  )
}
