import React, { forwardRef } from 'react'
import cx from 'classnames'
import styles from './style.module.scss'

interface TProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'large'
  shape?: 'circle'
}
export default forwardRef(function Button(
  props: TProps,
  ref: React.Ref<HTMLButtonElement>
) {
  const styleSize = props.size === 'large' ? styles.large : undefined
  const styleShape = props.shape === 'circle' ? styles.circle : undefined
  return (
    <button
      className={cx(styles.Button, styleSize, styleShape)}
      ref={ref}
      {...props}
    >
      {props.children}
    </button>
  )
})
