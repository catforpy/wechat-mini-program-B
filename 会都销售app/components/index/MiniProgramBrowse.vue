<template>
  <view class="mini-program-browse">
    <view class="browse-header">
      <text class="browse-title">小程序</text>
      <view class="right-actions">
        <picker mode="multiSelector" :range="provinceCityRange" :value="selectedLocationIndex" @change="onLocationChange">
          <view class="location-selector">
            <text class="location-icon">📍</text>
            <text class="location-text">{{ selectedCityText }}</text>
            <text class="location-arrow">▼</text>
          </view>
        </picker>
        <view class="browse-btn" @tap="handleBrowse">
          <text class="browse-text">浏览</text>
          <text class="browse-arrow">›</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const emit = defineEmits<{
  'browse': []
  'cityChange': [city: string]
}>()

// 省市数据
const provinceCityData = [
  { name: '全国', cities: ['全国'] },
  { name: '北京市', cities: ['北京市'] },
  { name: '上海市', cities: ['上海市'] },
  { name: '广东省', cities: ['广州市', '深圳市', '东莞市', '佛山市', '珠海市', '惠州市', '中山市', '江门市'] },
  { name: '浙江省', cities: ['杭州市', '宁波市', '温州市', '嘉兴市', '湖州市', '绍兴市', '金华市', '衢州市', '舟山市', '台州市'] },
  { name: '江苏省', cities: ['南京市', '无锡市', '徐州市', '常州市', '苏州市', '南通市', '连云港市', '淮安市', '盐城市', '扬州市', '镇江市'] },
  { name: '四川省', cities: ['成都市', '绵阳市', '自贡市', '攀枝花市', '泸州市', '德阳市', '广元市', '遂宁市', '内江市', '乐山市', '南充市', '眉山市', '宜宾市', '广安市', '达州市', '雅安市', '巴中市', '资阳市'] },
  { name: '湖北省', cities: ['武汉市', '黄石市', '十堰市', '宜昌市', '襄阳市', '鄂州市', '荆门市', '孝感市', '荆州市', '黄冈市', '咸宁市', '随州市'] },
  { name: '福建省', cities: ['福州市', '厦门市', '莆田市', '三明市', '泉州市', '漳州市', '南平市', '龙岩市', '宁德市'] },
  { name: '湖南省', cities: ['长沙市', '株洲市', '湘潭市', '衡阳市', '邵阳市', '岳阳市', '常德市', '张家界市', '益阳市', '郴州市', '永州市', '怀化市', '娄底市'] },
  { name: '河南省', cities: ['郑州市', '开封市', '洛阳市', '平顶山市', '安阳市', '鹤壁市', '新乡市', '焦作市', '濮阳市', '许昌市', '漯河市', '三门峡市', '南阳市', '商丘市', '信阳市', '周口市', '驻马店市'] }
]

// 选择的位置索引 [省份索引, 城市索引]
const selectedLocationIndex = ref([0, 0])

// 省份列表
const provinceList = computed(() => provinceCityData.map(p => p.name))

// 城市列表
const cityList = computed(() => {
  const provinceIndex = selectedLocationIndex.value[0]
  return provinceCityData[provinceIndex]?.cities || []
})

// picker 的 range（两列：省份、城市）
const provinceCityRange = computed(() => [provinceList.value, cityList.value])

// 选择的省份数据
const selectedProvince = computed(() => {
  const provinceIndex = selectedLocationIndex.value[0]
  return provinceCityData[provinceIndex]
})

// 选择的城市文本
const selectedCityText = computed(() => {
  const provinceName = selectedProvince.value?.name || '全国'
  const cityIndex = selectedLocationIndex.value[1]
  const cityName = selectedProvince.value?.cities[cityIndex] || '全国'

  if (provinceName === '全国') {
    return '全国'
  }
  return cityName
})

// 当前选择的城市名称（用于 emit）
const selectedCity = ref('全国')

// 位置改变
const onLocationChange = (e: any) => {
  const index = e.detail.value
  selectedLocationIndex.value = index

  const provinceIndex = index[0]
  const cityIndex = index[1]
  const province = provinceCityData[provinceIndex]
  const city = province?.cities[cityIndex] || '全国'

  selectedCity.value = city

  // 通知父组件城市已改变
  emit('cityChange', city)
}

const handleBrowse = () => {
  emit('browse')
}
</script>

<style scoped lang="scss">
.mini-program-browse {
  background-color: #ffffff;
  padding: 24rpx 30rpx;
  border-bottom: 1rpx solid #f0f0f0;

  .browse-header {
    display: flex;
    align-items: center;
    gap: 16rpx;
  }

  .browse-title {
    font-size: 32rpx;
    font-weight: 600;
    color: #333;
  }

  .right-actions {
    display: flex;
    align-items: center;
    gap: 12rpx;
    margin-left: auto;
  }

  .location-selector {
    display: flex;
    align-items: center;
    padding: 8rpx 20rpx;
    border-radius: 20rpx;
    background: #f0f0f0;
    flex-shrink: 0;

    .location-icon {
      font-size: 24rpx;
      margin-right: 6rpx;
    }

    .location-text {
      font-size: 24rpx;
      color: #666;
      margin-right: 6rpx;
      max-width: 160rpx;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .location-arrow {
      font-size: 18rpx;
      color: #999;
    }

    &:active {
      opacity: 0.8;
      transform: scale(0.95);
    }
  }

  .browse-btn {
    display: flex;
    align-items: center;
    padding: 8rpx 20rpx;
    border-radius: 20rpx;
    background: linear-gradient(135deg, #ff9500 0%, #ff6a00 100%);
    flex-shrink: 0;

    .browse-text {
      font-size: 26rpx;
      color: #ffffff;
      margin-right: 6rpx;
    }

    .browse-arrow {
      font-size: 28rpx;
      color: #ffffff;
      font-weight: bold;
    }

    &:active {
      opacity: 0.8;
      transform: scale(0.95);
    }
  }
}
</style>
