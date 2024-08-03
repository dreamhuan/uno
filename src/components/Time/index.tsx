import styles from './style.module.scss'
import { useCountDown } from './useCountDown'

export default function Time() {
  const time = useCountDown(10, () => {
    console.log('end')
  })
  console.log('time', time)
  return <div className={styles.Time}>{time}</div>
}
