/**
 * 时间格式化工具函数
 * 用于统一处理时间显示逻辑
 */

/**
 * 格式化时间显示
 * @param timestamp 时间戳或日期字符串
 * @returns 格式化后的时间字符串
 */
export const formatTimeDisplay = (timestamp: string | number | Date): string => {
  if (!timestamp) return ''

  const date = typeof timestamp === 'number'
    ? new Date(timestamp)
    : new Date(timestamp)

  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const targetDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())

  // 计算时间差（天数）
  const diffTime = today.getTime() - targetDate.getTime()
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

  // 获取时分
  const hours = date.getHours()
  const minutes = date.getMinutes().toString().padStart(2, '0')
  const timeStr = `${hours}:${minutes}`

  // 判断时间段
  const hour = date.getHours()
  let period = ''
  if (hour >= 5 && hour < 12) {
    period = '上午'
  } else if (hour >= 12 && hour < 18) {
    period = '下午'
  } else if (hour >= 18 && hour < 22) {
    period = '晚上'
  } else {
    period = '凌晨'
  }

  // 今天
  if (diffDays === 0) {
    return `${period} ${timeStr}`
  }

  // 昨天
  if (diffDays === 1) {
    return `昨天 ${timeStr}`
  }

  // 本周内（不是今天、昨天）
  if (diffDays > 1 && diffDays < 7) {
    const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
    const weekday = weekdays[date.getDay()]
    return `${weekday} ${timeStr}`
  }

  // 本月内但超过一周
  if (diffDays >= 7 && diffDays <= 30) {
    const month = date.getMonth() + 1
    const day = date.getDate()
    return `${month}月${day}日 ${timeStr}`
  }

  // 超过一个月
  if (diffDays > 30) {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    return `${year}年${month}月${day}日 ${timeStr}`
  }

  return timeStr
}

/**
 * 格式化日期为 MM月DD日
 */
export const formatDate = (timestamp: string | number | Date): string => {
  if (!timestamp) return ''

  const date = typeof timestamp === 'number'
    ? new Date(timestamp)
    : new Date(timestamp)

  const month = date.getMonth() + 1
  const day = date.getDate()
  return `${month}月${day}日`
}
