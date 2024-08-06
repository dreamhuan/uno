import styles from './style.module.scss'
import { User } from '../../core/entity/User'
import cx from 'classnames'
import {AvatarImgList} from './AvatarImgList.ts'

type UProps = {
  user: User
  isTurn: boolean
  imgIndex: number
}

export default function UserInfo({ user, isTurn, imgIndex }: UProps) {
  
  return (
    <div className={cx(styles.UserInfo, isTurn ? styles.playTurnBg : '')}>
      <div className={styles.InfoBox}>
        <div className={styles.headImgInfo}>
          <img src={AvatarImgList[imgIndex]} alt="" />
          <div>{user.name}</div>
        </div>
        <div>剩余牌数： {user.cards.length}</div>
      </div>
    </div>
  )
}
