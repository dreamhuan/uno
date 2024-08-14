import { EColor, EPattern } from '../../core/entity/common'
import cx from 'classnames'
import styles from './style.module.scss'
import { ColorMapBgc } from './constant'

function Skip({ color, isCenter }: { color: EColor; isCenter?: boolean }) {
  return (
    <div className={cx(styles.Skip, isCenter && ColorMapBgc[color])}>
      <div className={cx(styles.Circle, !isCenter && ColorMapBgc[color])}></div>
      <div className={cx(styles.Line, isCenter && ColorMapBgc[color])}></div>
    </div>
  )
}
function Turn({ color, isCenter }: { color: EColor; isCenter?: boolean }) {
  const map = {
    [EColor.R]: styles.TriR,
    [EColor.G]: styles.TriG,
    [EColor.B]: styles.TriB,
    [EColor.Y]: styles.TriY,
    [EColor.A]: null,
  }
  return (
    <div className={styles.Turn}>
      <div className={styles.Arrow}>
        <div className={cx(styles.Tri, isCenter && map[color])}></div>
        <div className={cx(styles.Line, isCenter && ColorMapBgc[color])}></div>
      </div>
      <div className={styles.Arrow}>
        <div className={cx(styles.Tri, isCenter && map[color])}></div>
        <div className={cx(styles.Line, isCenter && ColorMapBgc[color])}></div>
      </div>
    </div>
  )
}
function Change() {
  return (
    <div className={styles.Change}>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  )
}
function AddNum({ num }: { num: 2 | 4 }) {
  return (
    <div className={styles.AddNum}>
      <span className={styles.AddNumIcon}>+</span>
      {num}
    </div>
  )
}
function AddNumCard({ color }: { color: EColor }) {
  return (
    <div className={styles.AddNumCard}>
      <div className={cx(styles.AddNumCardInner, ColorMapBgc[color])}></div>
    </div>
  )
}
function AddNumCardTwo({ color }: { color: EColor }) {
  return (
    <div className={styles.AddNumCardWrap}>
      <AddNumCard color={color} />
      <AddNumCard color={color} />
    </div>
  )
}
function AddNumCardFour() {
  return (
    <div className={styles.AddNumCardWrap}>
      <AddNumCard color={EColor.R} />
      <AddNumCard color={EColor.G} />
      <AddNumCard color={EColor.B} />
      <AddNumCard color={EColor.Y} />
    </div>
  )
}

type TProps = {
  color: EColor
  pattern: EPattern
}
export function PatternTop(props: TProps) {
  const { color, pattern } = props

  switch (pattern) {
    case EPattern.Skip:
      return <Skip color={color} />
    case EPattern.Turn:
      return <Turn color={color} />
    case EPattern.Change:
      return <Change />
    case EPattern.Two:
      return <AddNum num={2} />
    case EPattern.Four:
      return <AddNum num={4} />
    default:
      return null
  }
}

export function PatternCenter(props: TProps) {
  const { color, pattern } = props

  switch (pattern) {
    case EPattern.Skip:
      return (
        <div className={styles.Big}>
          <Skip color={color} isCenter />
        </div>
      )
    case EPattern.Turn:
      return (
        <div className={styles.Big}>
          <Turn color={color} isCenter />
        </div>
      )

    case EPattern.Change:
      return (
        <div className={cx(styles.Big, styles.ChangeCenter)}>
          <Change />
        </div>
      )
    case EPattern.Two:
      return <AddNumCardTwo color={color} />
    case EPattern.Four:
      return <AddNumCardFour />
    default:
      return null
  }
}
