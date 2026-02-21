// 点击注册卡片
const handleCardClick = (card: Card, section: string) => {
  console.log('=== 点击注册卡片 ===')
  console.log('card:', card)
  console.log('section:', section)

  // 所有注册类型都跳转到add-company页面
  // 根据选择的主体类型确定 entityType
  let entityType = 'overseas' // 默认境外主体
  if (section === '我的公司' || section === '企业注册' || section === '店铺注册' || section === '电子商务注册') {
    entityType = 'company'
  } else if (section === '个人主体' || section === '个体工商户注册') {
    entityType = 'individual'
  }

  console.log('entityType:', entityType)

  // 跳转到add-company页面，只传递entityType参数
  const url = `/pages/profile/add-company?entityType=${entityType}`
  console.log('跳转URL:', url)

  // 跳转到企业注册页面
  uni.navigateTo({
    url: url,
    success: () => {
      console.log('跳转成功')
    },
    fail: (err) => {
      console.log('跳转失败:', err)
      uni.showToast({
        title: '页面跳转失败',
        icon: 'none'
      })
    }
  })
}
