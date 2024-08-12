import React, { forwardRef } from 'react'
import styles from './style.module.scss'

interface TProps extends React.InputHTMLAttributes<HTMLInputElement> {}
export default forwardRef(function Input(
  props: TProps,
  ref: React.Ref<HTMLInputElement>
) {
  return <input className={styles.Input} ref={ref} {...props} />
})
