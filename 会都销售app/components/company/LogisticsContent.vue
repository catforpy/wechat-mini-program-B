<template>
  <view class="logistics-content">
    <!-- 快捷服务入口 - 最核心功能 -->
    <view class="content-section">
      <view class="section-title">
        <text class="title-text">🚚 快捷服务</text>
        <view class="title-line"></view>
      </view>

      <view class="quick-services">
        <view class="service-btn" v-for="(service, index) in quickServices" :key="index" @tap="handleService(service.action)">
          <text class="service-icon">{{ service.icon }}</text>
          <text class="service-name">{{ service.name }}</text>
        </view>
      </view>
    </view>

    <!-- 时效查询 - 表格形式 -->
    <view class="content-section">
      <view class="section-title">
        <text class="title-text">⏰ 时效查询</text>
        <view class="title-line"></view>
        <text class="section-tip">不同线路的送达时间</text>
      </view>

      <view class="table-card">
        <view class="table-header">
          <text class="table-cell route">线路</text>
          <text class="table-cell time">时效</text>
          <text class="table-cell price">首重价格</text>
        </view>
        <view class="table-row" v-for="(item, index) in deliveryTable" :key="index">
          <text class="table-cell route">{{ item.route }}</text>
          <text class="table-cell time highlight">{{ item.time }}</text>
          <text class="table-cell price">¥{{ item.price }}</text>
        </view>
        <view class="table-note">
          <text class="note-text">* 具体时效以实际为准，偏远地区可能延迟</text>
        </view>
      </view>
    </view>

    <!-- 运价表 - 表格形式 -->
    <view class="content-section">
      <view class="section-title">
        <text class="title-text">💰 运价表</text>
        <view class="title-line"></view>
        <text class="section-tip">根据重量和距离计算运费</text>
      </view>

      <view class="table-card">
        <view class="table-header">
          <text class="table-cell weight">重量范围</text>
          <text class="table-cell zone">省内</text>
          <text class="table-cell zone">跨省</text>
          <text class="table-cell zone">偏远</text>
        </view>
        <view class="table-row" v-for="(item, index) in priceTable" :key="index">
          <text class="table-cell weight">{{ item.weight }}</text>
          <text class="table-cell zone">¥{{ item.province }}</text>
          <text class="table-cell zone">¥{{ item.country }}</text>
          <text class="table-cell zone">¥{{ item.remote }}</text>
        </view>
        <view class="table-note">
          <text class="note-text">* 续重每公斤加收相应费用</text>
        </view>
      </view>
    </view>

    <!-- 增值服务 -->
    <view class="content-section">
      <view class="section-title">
        <text class="title-text">✨ 增值服务</text>
        <view class="title-line"></view>
      </view>

      <view class="value-services">
        <view class="value-item" v-for="(service, index) in valueServices" :key="index">
          <view class="value-header">
            <text class="value-icon">{{ service.icon }}</text>
            <view class="value-info">
              <text class="value-name">{{ service.name }}</text>
              <text class="value-price" v-if="service.price">¥{{ service.price }}</text>
            </view>
            <view class="value-switch" :class="{ active: service.included }">
              <text class="switch-text">{{ service.included ? '已含' : '另费' }}</text>
            </view>
          </view>
          <text class="value-desc">{{ service.desc }}</text>
        </view>
      </view>
    </view>

    <!-- 服务网点 -->
    <view class="content-section">
      <view class="section-title">
        <text class="title-text">📍 附近网点</text>
        <view class="title-line"></view>
        <view class="section-action" @tap="viewAllStores">
          <text>查看全部</text>
          <text class="arrow">→</text>
        </view>
      </view>

      <view class="stores-card">
        <view class="store-item" v-for="(store, index) in nearbyStores" :key="index" @tap="goToStore(store)">
          <view class="store-header">
            <text class="store-name">{{ store.name }}</text>
            <text class="store-distance">{{ store.distance }}</text>
          </view>
          <text class="store-address">{{ store.address }}</text>
          <view class="store-footer">
            <text class="store-phone">📞 {{ store.phone }}</text>
            <text class="store-time">⏰ {{ store.hours }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 物流追踪 - 实时状态演示 -->
    <view class="content-section">
      <view class="section-title">
        <text class="title-text">📍 物流追踪</text>
        <view class="title-line"></view>
        <text class="section-tip">实时掌握货物位置</text>
      </view>

      <view class="tracking-card">
        <view class="tracking-input">
          <input class="tracking-input-field" placeholder="输入运单号查询" v-model="trackingNumber" />
          <button class="tracking-btn" @tap="handleTrack">查询</button>
        </view>

        <view class="tracking-demo" v-if="trackingSteps.length">
          <view class="tracking-step" v-for="(step, index) in trackingSteps" :key="index">
            <view class="step-dot" :class="{ active: index === 0, done: index < 2 }"></view>
            <view class="step-content">
              <text class="step-status" :class="{ current: index === 0 }">{{ step.status }}</text>
              <text class="step-time">{{ step.time }}</text>
              <text class="step-location" v-if="step.location">{{ step.location }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 运力展示 - 体现企业实力 -->
    <view class="content-section">
      <view class="section-title">
        <text class="title-text">🚛 运力展示</text>
        <view class="title-line"></view>
      </view>

      <view class="fleet-card">
        <view class="fleet-stats">
          <view class="stat-item">
            <text class="stat-value">{{ logisticsInfo?.fleet?.totalVehicles || 0 }}</text>
            <text class="stat-label">车辆总数</text>
          </view>
          <view class="stat-item">
            <text class="stat-value">{{ logisticsInfo?.serviceArea?.coverageCities || 0 }}</text>
            <text class="stat-label">覆盖城市</text>
          </view>
          <view class="stat-item">
            <text class="stat-value">50万+</text>
            <text class="stat-label">物流人员</text>
          </view>
        </view>

        <scroll-view class="vehicle-scroll" scroll-x show-scrollbar>
          <view class="vehicle-item" v-for="(vehicle, index) in vehicleTypes" :key="index">
            <image :src="vehicle.image" mode="aspectFill" class="vehicle-image" />
            <text class="vehicle-type">{{ vehicle.type }}</text>
            <text class="vehicle-count">{{ vehicle.count }}辆</text>
          </view>
        </scroll-view>
      </view>
    </view>

    <!-- 服务保障 -->
    <view class="content-section">
      <view class="section-title">
        <text class="title-text">🛡️ 服务保障</text>
        <view class="title-line"></view>
      </view>

      <view class="guarantee-card">
        <view class="guarantee-item" v-for="(item, index) in guarantees" :key="index">
          <text class="guarantee-icon">{{ item.icon }}</text>
          <view class="guarantee-info">
            <text class="guarantee-title">{{ item.title }}</text>
            <text class="guarantee-desc">{{ item.desc }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 合作客户 -->
    <view class="content-section" v-if="logisticsInfo?.cases?.length">
      <view class="section-title">
        <text class="title-text">🤝 合作客户</text>
        <view class="title-line"></view>
      </view>

      <view class="partners-card">
        <scroll-view class="partners-scroll" scroll-x show-scrollbar>
          <view class="partner-item" v-for="(partner, index) in logisticsInfo.cases" :key="index">
            <image :src="partner.logo" mode="aspectFit" class="partner-logo" />
            <text class="partner-name">{{ partner.name }}</text>
          </view>
        </scroll-view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  logisticsInfo?: any
}

const props = defineProps<Props>()

const trackingNumber = ref('')

// 快捷服务
const quickServices = ref([
  { name: '上门取件', icon: '📦', action: 'pickup' },
  { name: '运费查询', icon: '💰', action: 'price' },
  { name: '物流追踪', icon: '📍', action: 'track' },
  { name: '网点查询', icon: '🏪', action: 'store' },
  { name: '在线客服', icon: '💬', action: 'chat' },
  { name: '价格计算', icon: '🧮', action: 'calculate' }
])

// 时效表
const deliveryTable = ref([
  { route: '同城快递', time: '当日达', price: '12起' },
  { route: '省内快递', time: '次日达', price: '18起' },
  { route: '跨省快递', time: '2-3天', price: '23起' },
  { route: '偏远地区', time: '3-5天', price: '35起' }
])

// 运价表
const priceTable = ref([
  { weight: '1kg内', province: '12', country: '23', remote: '35' },
  { weight: '1-3kg', province: '18', country: '28', remote: '45' },
  { weight: '3-5kg', province: '25', country: '35', remote: '55' },
  { weight: '5-10kg', province: '35', country: '48', remote: '70' },
  { weight: '10-20kg', province: '50', country: '68', remote: '95' }
])

// 增值服务
const valueServices = ref([
  { name: '保价服务', icon: '🛡️', price: '5‰', desc: '货物损坏全额赔付', included: false },
  { name: '代包装', icon: '📦', price: '5元', desc: '专业包装保护', included: false },
  { name: '签收回单', icon: '✍️', price: '3元', desc: '返回签收底单', included: false },
  { name: ' overnight', icon: '🌙', price: '0', desc: '夜间配送服务', included: false },
  { name: '上门取件', icon: '🚚', price: '0', desc: '1小时上门响应', included: true },
  { name: '全程追踪', icon: '📍', price: '0', desc: 'GPS实时定位', included: true }
])

// 附近网点
const nearbyStores = ref([
  { name: '顺丰速运-营业部', distance: '500m', address: '中山路88号', phone: '95338', hours: '8:00-20:00' },
  { name: '顺丰速运-服务点', distance: '1.2km', address: '解放路123号', phone: '95338', hours: '8:00-22:00' },
  { name: '顺丰速运-代理点', distance: '2.5km', address: '建设路456号', phone: '95338', hours: '9:00-21:00' }
])

// 物流追踪演示数据
const trackingSteps = ref([
  { status: '派件中', time: '今天 14:30', location: '北京市朝阳区营业部' },
  { status: '运输中', time: '今天 08:00', location: '北京转运中心' },
  { status: '运输中', time: '昨天 22:00', location: '石家庄转运中心' },
  { status: '已揽收', time: '昨天 16:30', location: '石家庄营业部' },
  { status: '已下单', time: '昨天 15:00', location: '' }
])

// 车辆类型
const vehicleTypes = ref([
  { type: '9.6米货车', count: 8000, image: 'https://via.placeholder.com/300' },
  { type: '冷链车', count: 3000, image: 'https://via.placeholder.com/300' },
  { type: '电动车', count: 12000, image: 'https://via.placeholder.com/300' },
  { type: '货车', count: 5000, image: 'https://via.placeholder.com/300' }
])

// 服务保障
const guarantees = ref([
  { icon: '⚡', title: '准时送达', desc: '承诺时效，延误必赔' },
  { icon: '🛡️', title: '安全保障', desc: '全程保险，损坏包赔' },
  { icon: '📍', title: '实时追踪', desc: 'GPS定位，随时掌握' },
  { icon: '💬', title: '7x24客服', desc: '全天在线，快速响应' },
  { icon: '🔄', title: '免费退换', desc: '7天无理由退货' },
  { icon: '✅', title: '验货签收', desc: '先验货再签收' }
])

// 处理快捷服务
const handleService = (action: string) => {
  uni.showToast({
    title: '打开服务：' + action,
    icon: 'success'
  })
}

// 物流追踪
const handleTrack = () => {
  if (!trackingNumber.value) {
    uni.showToast({
      title: '请输入运单号',
      icon: 'none'
    })
    return
  }
  uni.showToast({
    title: '查询中...',
    icon: 'loading'
  })
}

// 查看全部网点
const viewAllStores = () => {
  uni.showToast({
    title: '打开地图',
    icon: 'success'
  })
}

// 去网点
const goToStore = (store: any) => {
  uni.openLocation({
    latitude: 0,
    longitude: 0,
    name: store.name,
    address: store.address
  })
}
</script>

<style scoped lang="scss">
.logistics-content {
  padding-bottom: 20rpx;
}

.content-section {
  margin-bottom: 20rpx;
}

.section-title {
  padding: 30rpx 20rpx 20rpx;
  position: relative;

  .title-text {
    font-size: 36rpx;
    font-weight: 600;
    color: #333;
  }

  .title-line {
    width: 60rpx;
    height: 6rpx;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 3rpx;
    margin-top: 16rpx;
  }

  .section-tip {
    position: absolute;
    right: 20rpx;
    top: 30rpx;
    font-size: 24rpx;
    color: #999;
  }

  .section-action {
    position: absolute;
    right: 20rpx;
    top: 30rpx;
    display: flex;
    align-items: center;
    font-size: 24rpx;
    color: #667eea;

    .arrow {
      margin-left: 8rpx;
    }
  }
}

// 快捷服务
.quick-services {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20rpx;
  padding: 0 20rpx;

  .service-btn {
    background: #fff;
    border-radius: 16rpx;
    padding: 30rpx 20rpx;
    text-align: center;
    box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.06);

    .service-icon {
      display: block;
      font-size: 48rpx;
      margin-bottom: 12rpx;
    }

    .service-name {
      font-size: 26rpx;
      color: #333;
    }
  }
}

// 表格卡片
.table-card {
  margin: 0 20rpx;
  background: #fff;
  border-radius: 20rpx;
  overflow: hidden;

  .table-header {
    display: flex;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 20rpx;

    .table-cell {
      flex: 1;
      text-align: center;
      font-size: 26rpx;
      font-weight: 600;
      color: #fff;
    }
  }

  .table-row {
    display: flex;
    padding: 24rpx 20rpx;
    border-bottom: 1rpx solid #f0f0f0;

    &:last-child {
      border-bottom: none;
    }

    .table-cell {
      flex: 1;
      text-align: center;
      font-size: 26rpx;
      color: #666;

      &.highlight {
        color: #ff5252;
        font-weight: 600;
      }

      &.route {
        text-align: left;
        color: #333;
        font-weight: 500;
      }
    }
  }

  .table-note {
    padding: 16rpx 20rpx;
    background: #fff9f9;
    border-top: 1rpx solid #f0f0f0;

    .note-text {
      font-size: 22rpx;
      color: #999;
    }
  }
}

// 增值服务
.value-services {
  margin: 0 20rpx;
  background: #fff;
  border-radius: 20rpx;
  padding: 30rpx;

  .value-item {
    margin-bottom: 24rpx;

    &:last-child {
      margin-bottom: 0;
    }

    .value-header {
      display: flex;
      align-items: center;
      margin-bottom: 12rpx;

      .value-icon {
        font-size: 36rpx;
        margin-right: 16rpx;
      }

      .value-info {
        flex: 1;

        .value-name {
          display: block;
          font-size: 28rpx;
          font-weight: 600;
          color: #333;
          margin-bottom: 4rpx;
        }

        .value-price {
          font-size: 24rpx;
          color: #ff5252;
        }
      }

      .value-switch {
        padding: 6rpx 16rpx;
        border-radius: 20rpx;
        font-size: 22rpx;

        &.active {
          background: #e8f5e9;
          color: #4caf50;
        }

        &:not(.active) {
          background: #fff5f5;
          color: #ff5252;
        }
      }
    }

    .value-desc {
      font-size: 24rpx;
      color: #999;
      padding-left: 52rpx;
    }
  }
}

// 服务网点
.stores-card {
  margin: 0 20rpx;
  background: #fff;
  border-radius: 20rpx;
  padding: 30rpx;

  .store-item {
    padding: 20rpx;
    background: #f8f9fa;
    border-radius: 12rpx;
    margin-bottom: 16rpx;

    &:last-child {
      margin-bottom: 0;
    }

    .store-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12rpx;

      .store-name {
        font-size: 28rpx;
        font-weight: 600;
        color: #333;
      }

      .store-distance {
        font-size: 24rpx;
        color: #667eea;
      }
    }

    .store-address {
      display: block;
      font-size: 24rpx;
      color: #666;
      margin-bottom: 12rpx;
    }

    .store-footer {
      display: flex;
      gap: 24rpx;

      .store-phone,
      .store-time {
        font-size: 22rpx;
        color: #999;
      }
    }
  }
}

// 物流追踪
.tracking-card {
  margin: 0 20rpx;
  background: #fff;
  border-radius: 20rpx;
  padding: 30rpx;

  .tracking-input {
    display: flex;
    gap: 16rpx;
    margin-bottom: 30rpx;

    .tracking-input-field {
      flex: 1;
      height: 72rpx;
      padding: 0 24rpx;
      background: #f5f5f5;
      border-radius: 36rpx;
      font-size: 26rpx;
    }

    .tracking-btn {
      height: 72rpx;
      padding: 0 32rpx;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: #fff;
      font-size: 26rpx;
      border-radius: 36rpx;
      border: none;
    }
  }

  .tracking-demo {
    .tracking-step {
      display: flex;
      margin-bottom: 30rpx;

      &:last-child {
        margin-bottom: 0;
      }

      .step-dot {
        width: 24rpx;
        height: 24rpx;
        border-radius: 50%;
        background: #e5e5e5;
        margin-right: 20rpx;
        flex-shrink: 0;
        position: relative;

        &::after {
          content: '';
          position: absolute;
          top: 24rpx;
          left: 11rpx;
          width: 2rpx;
          height: 60rpx;
          background: #e5e5e5;
        }

        &:last-child::after {
          display: none;
        }

        &.active {
          background: #667eea;

          &::after {
            background: #667eea;
          }
        }

        &.done {
          background: #4caf50;

          &::after {
            background: #4caf50;
          }
        }
      }

      .step-content {
        flex: 1;
        padding-top: 2rpx;

        .step-status {
          display: block;
          font-size: 26rpx;
          color: #999;
          margin-bottom: 8rpx;

          &.current {
            color: #667eea;
            font-weight: 600;
          }
        }

        .step-time {
          display: block;
          font-size: 24rpx;
          color: #999;
          margin-bottom: 4rpx;
        }

        .step-location {
          font-size: 24rpx;
          color: #666;
        }
      }
    }
  }
}

// 运力展示
.fleet-card {
  margin: 0 20rpx;
  background: #fff;
  border-radius: 20rpx;
  padding: 30rpx;

  .fleet-stats {
    display: flex;
    justify-content: space-around;
    margin-bottom: 30rpx;

    .stat-item {
      text-align: center;

      .stat-value {
        display: block;
        font-size: 36rpx;
        font-weight: 600;
        color: #667eea;
        margin-bottom: 8rpx;
      }

      .stat-label {
        font-size: 24rpx;
        color: #999;
      }
    }
  }

  .vehicle-scroll {
    white-space: nowrap;

    .vehicle-item {
      display: inline-block;
      width: 200rpx;
      margin-right: 20rpx;
      text-align: center;

      &:last-child {
        margin-right: 0;
      }

      .vehicle-image {
        width: 200rpx;
        height: 150rpx;
        border-radius: 12rpx;
        margin-bottom: 12rpx;
      }

      .vehicle-type {
        display: block;
        font-size: 24rpx;
        color: #333;
        margin-bottom: 8rpx;
      }

      .vehicle-count {
        font-size: 22rpx;
        color: #667eea;
      }
    }
  }
}

// 服务保障
.guarantee-card {
  margin: 0 20rpx;
  background: #fff;
  border-radius: 20rpx;
  padding: 30rpx;

  .guarantee-item {
    display: flex;
    align-items: center;
    margin-bottom: 24rpx;

    &:last-child {
      margin-bottom: 0;
    }

    .guarantee-icon {
      font-size: 48rpx;
      margin-right: 20rpx;
    }

    .guarantee-info {
      flex: 1;

      .guarantee-title {
        display: block;
        font-size: 28rpx;
        font-weight: 600;
        color: #333;
        margin-bottom: 8rpx;
      }

      .guarantee-desc {
        font-size: 24rpx;
        color: #999;
      }
    }
  }
}

// 合作客户
.partners-card {
  margin: 0 20rpx;
  background: #fff;
  border-radius: 20rpx;
  padding: 30rpx;

  .partners-scroll {
    white-space: nowrap;

    .partner-item {
      display: inline-block;
      width: 150rpx;
      margin-right: 20rpx;
      text-align: center;

      &:last-child {
        margin-right: 0;
      }

      .partner-logo {
        width: 100rpx;
        height: 100rpx;
        margin-bottom: 12rpx;
      }

      .partner-name {
        display: block;
        font-size: 24rpx;
        color: #666;
      }
    }
  }
}
</style>
