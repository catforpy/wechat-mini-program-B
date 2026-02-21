<template>
  <picker mode="multiSelector" :range="provinceCityRange" :value="selectedLocationIndex" @change="onLocationChange">
    <view class="city-selector">
      <text class="location-icon">📍</text>
      <text class="location-text">{{ selectedCityText }}</text>
      <text class="location-arrow">▼</text>
    </view>
  </picker>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const emit = defineEmits<{
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

// 位置改变
const onLocationChange = (e: any) => {
  const index = e.detail.value
  selectedLocationIndex.value = index

  const provinceIndex = index[0]
  const cityIndex = index[1]
  const province = provinceCityData[provinceIndex]
  const city = province?.cities[cityIndex] || '全国'

  // 通知父组件城市已改变
  emit('cityChange', city)
}
</script>

<style scoped lang="scss">
.city-selector {
  display: flex;
  align-items: center;
  padding: 8rpx 20rpx;
  border-radius: 20rpx;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(8rpx);

  .location-icon {
    font-size: 24rpx;
    margin-right: 6rpx;
  }

  .location-text {
    font-size: 24rpx;
    color: #fff;
    margin-right: 6rpx;
    max-width: 160rpx;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .location-arrow {
    font-size: 18rpx;
    color: rgba(255, 255, 255, 0.8);
  }

  &:active {
    opacity: 0.8;
    transform: scale(0.95);
  }
}
</style>
