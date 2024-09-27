import { useLayoutEffect, useState } from 'react'
import { MyStorage } from '../common'

export function useAdaptMobile(WIDTH = 1000, HEIGHT = 550) {
  const [scale, setScale] = useState(1)
  const [rotate, setRotate] = useState(0)
  const [left, setLeft] = useState(0)
  const [top, setTop] = useState(0)

  const onResize = () => {
    const isAdapt = MyStorage.getItem('isAdapt') === '1'
    console.log('userAgent', navigator.userAgent)
    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )

    setScale(1)
    setRotate(0)
    setLeft(0)
    setTop(0)
    if (isMobile) {
      console.log('mobile')
      const boxW = WIDTH
      const boxH = HEIGHT
      const boxAspectRatio = boxW / boxH

      let pageW = window.innerWidth || document.documentElement.clientWidth
      let pageH = window.innerHeight || document.documentElement.clientHeight
      console.log('pageW', pageW, 'pageH', pageH)
      if (isAdapt) {
        setRotate(90)
        // 手机横过来，w h要交换，默认长方形盒子横为长竖为宽
        // eslint-disable-next-line no-extra-semi
        ;[pageW, pageH] = [pageH, pageW]

        const pageAspectRatio = pageW / pageH
        let scaleRatio = 1
        if (boxAspectRatio >= pageAspectRatio) {
          console.log('www')
          // 盒子宽高比大说明盒子比屏幕宽，以宽度来缩放，上下留白
          scaleRatio = pageW / boxW
          // 旋转90后变成left了，又因为以(0,0)转会转到屏幕外，要再加一段
          setLeft(boxH * scaleRatio + (pageH - boxH * scaleRatio) / 2)
        } else {
          console.log('hhh')
          // 否则以高度来缩放，左右留白
          scaleRatio = pageH / boxH
          // 旋转90后变成left了
          setTop((pageW - boxW * scaleRatio) / 2)
          // 转到屏幕外了挪进来
          setLeft(pageH)
        }
        console.log({ pageW, pageH })
        setScale(scaleRatio)
      } else {
        const pageAspectRatio = pageW / pageH
        let scaleRatio = 1
        if (boxAspectRatio >= pageAspectRatio) {
          console.log('www')
          // 盒子宽高比大说明盒子比屏幕宽，以宽度来缩放，上下留白
          scaleRatio = pageW / boxW
          setTop((pageH - boxH * scaleRatio) / 2)
        } else {
          console.log('hhh')
          // 否则以高度来缩放，左右留白
          scaleRatio = pageH / boxH
          setLeft((pageW - boxW * scaleRatio) / 2)
        }
        console.log({ pageW, pageH })
        setScale(scaleRatio)
      }
    } else {
      setLeft(10)
      setTop(10)
    }
  }

  useLayoutEffect(() => {
    window.addEventListener('resize', onResize)
    onResize()
    return () => {
      window.removeEventListener('resize', onResize)
    }
  }, [])

  console.log({
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
  })
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
