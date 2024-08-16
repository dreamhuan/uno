import styles from './style.module.scss'
import { useCountDown } from '../../hooks/useCountDown'

export default function Time() {
  const time = useCountDown(10, () => {
    console.log('end')
  })
  console.log('time', time)
  return <span className={styles.Time}>{time}</span>
}
