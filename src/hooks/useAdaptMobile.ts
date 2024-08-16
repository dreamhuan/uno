import { useLayoutEffect, useState } from 'react'
import { MyStorage } from '../common'

export function useAdaptMobile(WIDTH = 1000, HEIGHT = 550) {
  const [scale, setScale] = useState(1)
  const [rotate, setRotate] = useState(0)
  const [left, setLeft] = useState(0)
  const [top, setTop] = useState(0)

  useLayoutEffect(() => {
    const isAdapt = MyStorage.getItem('isAdapt') === '1'
    console.log('userAgent', navigator.userAgent)
    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    if (isMobile && isAdapt) {
      console.log('mobile')
      const boxW = WIDTH
      const boxH = HEIGHT
      const boxAspectRatio = boxW / boxH
      // 手机横过来，w h要交换，默认长方形盒子横为长竖为宽
      const pageW = window.innerHeight || document.documentElement.clientHeight
      const pageH = window.innerWidth || document.documentElement.clientWidth

      const pageAspectRatio = pageW / pageH
      let scaleRatio = 1
      if (boxAspectRatio >= pageAspectRatio) {
        console.log('www')
        // 盒子宽高比大说明盒子比屏幕宽，以宽度来缩放，上下留白
        scaleRatio = pageW / boxW
        setLeft(boxH * scaleRatio + (pageH - boxH * scaleRatio) / 2)
      } else {
        console.log('hhh')
        // 否则以高度来缩放，左右留白
        scaleRatio = pageH / boxH
        setLeft(pageH)
        setTop((pageW - boxW * scaleRatio) / 2)
      }
      console.log({ pageW, pageH })
      setScale(scaleRatio)
      setRotate(90)
    } else {
      setLeft(10)
      setTop(10)
    }
  }, [])

  return {
    scale,
    rotate,
    left,
    top,
    adaptStyle: {
      transformOrigin: '0 0',
      transform: `scale(${scale}) rotate(${rotate}deg)`,
      top,
      left,
    },
  }
}
