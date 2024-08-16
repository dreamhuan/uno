import React from 'react'
import ReactMarkdown from 'react-markdown'
import CardItem from '../components/CardItem'
import { Card } from '../core/entity/Card'
import cx from 'classnames'
import styles from './style.module.scss'
import { ECardType, EColor, ENumber, EPattern } from '../core/entity/common'
import { useAdaptMobile } from '../hooks/useAdaptMobile'
const contentA = `
# UNO

## 概述

UNO 是一个看谁把牌先出完并且**让其他人疯狂抓牌**的友尽游戏。

共分三类牌，合计 108 张：

- 数字牌（76 张），红黄蓝绿
- 功能牌（24 张），红黄蓝绿
- 万能牌（8 张） ，仅黑色

## 牌介绍
`
const contentB = `
### 数字牌(4×(9×2+1)=76)

最基础的牌，除了数字"0" 4 色各 1 张外，数字"1-9" 4 色各 2 张

### 功能牌(4×3×2=24)

有 3 种，也是 4 色各 2 张

1. 禁：跳过下家操作
2. 转：改变出牌顺序
3. +2：下家需要抽 2 张

### 万能牌(2×4=8)

有 2 种，每种各 4 张

1. 变色：重设当前出牌颜色，并且取消图案设置
2. +4：下家需要抽 4 张，并重设出牌颜色与取消图案设置

## 出牌规则

1. 基础规则

   - 牌均有颜色和图案两种属性(图案包括数字、功能，比如“红色 5”或者“蓝色转”)。
   - 每次出牌均会设置当前能出的颜色和图案，后续必须出和当前设置的颜色或图案一致的牌，第一位玩家必须出数字牌。
   - 下一个玩家则可以出**同色的其他牌(数字、功能)**或者**其他色的同数字牌**或者**万能牌**。

1. 万能牌（变色、加 4）

   - 可以在任何正常出牌回合打出（加牌、跳等为异常回合）
   - 出牌后，当前出牌颜色和图案会被重设，并且取消图案设置。

1. 惩罚回合

   - 功能牌的+2 和万能牌的+4 为惩罚牌，一个玩家出+2 后下一个玩家只能出+2 或者+4，出+4 后下一个玩家只能出+4
   - 如没有对应的牌则需要进行摸牌，摸牌数为这一轮加的总和，摸完后无法出牌
   - 再下一个玩家此时按出牌规则可以出同颜色的牌或者其他颜色的“+2”，如果最终为+4 的话，以+4 玩家设置的颜色为准。

1. 其他功能牌(转、禁)
   - 这两张功能牌的功能有最高优先级，(如果能打出的话)打出后立马执行,在功能完成后的后续出牌规则同基础规则
   - **(你问我为啥+2 这个功能牌要搞特殊？因为 uno 官方设定的+2 也是立马执行功能不能继续跟牌的，但是 uno 官方他懂什么 uno，全国各地规则千千万就这一条惊人地一致，+2 后面可以一直+2！)**

## 特殊规则

1. 当自己手上只有一张牌时需要喊出 uno，若没喊出被别人抓住需要抽一张牌（本游戏不涉及）
1. 最后一张牌不是数字牌的话打出后需要再抽一张
1. 如果自己手上有和当时出牌一样的同色数字牌，可以喊出“抢”并打出那张一样的牌，然后下一个出牌玩家换成“抢”的下家。抢优先于正常出牌！

## 获胜规则

初始会每人发 7 张牌，然后按出牌规则逆时针顺次出牌，无法出牌的人则抓牌，先出完则获胜，获胜后本局结束。

`

export default function Rule() {
  const { adaptStyle } = useAdaptMobile()
  return (
    <div
      className={cx(styles.Game, styles.Container)}
      style={{ ...adaptStyle, overflow: 'scroll' }}
    >
      <ReactMarkdown>{contentA}</ReactMarkdown>
      <div style={{ transform: 'scale(0.8)', margin: '10px', display: 'flex' }}>
        <CardItem
          card={new Card(ECardType.Num, EColor.R, ENumber._7, undefined)}
        />
        <CardItem
          card={new Card(ECardType.Func, EColor.B, undefined, EPattern.Skip)}
        />
        <CardItem
          card={new Card(ECardType.Func, EColor.G, undefined, EPattern.Turn)}
        />
        <CardItem
          card={new Card(ECardType.Func, EColor.Y, undefined, EPattern.Two)}
        />
        <CardItem
          card={new Card(ECardType.King, EColor.A, undefined, EPattern.Change)}
        />
        <CardItem
          card={new Card(ECardType.King, EColor.A, undefined, EPattern.Four)}
        />
      </div>
      <ReactMarkdown>{contentB}</ReactMarkdown>
    </div>
  )
}
