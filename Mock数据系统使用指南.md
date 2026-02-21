# Mock 数据系统使用指南

> 本文档详细说明如何使用 Mock 数据系统进行前端开发

**最后更新**: 2026-02-07

---

## 📚 目录

- [一、系统概述](#一系统概述)
- [二、快速开始](#二快速开始)
- [三、Mock 数据管理](#三mock-数据管理)
- [四、API 接口调用](#四api-接口调用)
- [五、环境切换](#五环境切换)
- [六、完整示例](#六完整示例)

---

## 一、系统概述

### 1.1 什么是 Mock 数据系统？

Mock 数据系统是一个虚拟数据管理方案，让你可以在后端 API 还未开发好的情况下，先使用虚拟数据进行前端开发。等后端 API 开发完成后，只需一行代码即可切换到真实 API。

### 1.2 核心特性

✅ **自动生成数据** - 自动生成用户、订单、商品等虚拟数据
✅ **数据持久化** - 使用本地存储保存数据，重启不丢失
✅ **分页支持** - 完整的分页、过滤、搜索功能
✅ **延迟模拟** - 可配置网络延迟，模拟真实场景
✅ **错误模拟** - 可配置错误率，测试错误处理
✅ **一键切换** - 方便在 Mock 和真实 API 之间切换
✅ **类型安全** - 完整的 TypeScript 类型支持

### 1.3 系统架构

```
┌─────────────────────────────────────┐
│         前端组件/页面               │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│         API 接口层                   │
│    (src/api/*)                     │
│    - authApi                       │
│    - productApi                    │
│    - orderApi                      │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│      API 适配器 (apiAdapter)        │
│    - 自动切换 Mock/真实 API         │
└─────────┬───────────────┬───────────┘
          │               │
    ┌─────▼─────┐   ┌───▼─────────┐
    │ Mock API  │   │ 真实 HTTP   │
    │(虚拟数据)  │   │  (后端API)   │
    └───────────┘   └─────────────┘
```

---

## 二、快速开始

### 2.1 默认配置

开发环境默认启用 Mock 数据：

```typescript
// src/config/mock.ts
export const mockConfig = {
  enabled: isDev(), // 开发环境自动启用
  delay: 300,        // 模拟 300ms 延迟
  errorRate: 0,      // 错误率 0%
  showLog: true      // 显示日志
}
```

### 2.2 首次运行

应用首次启动时会自动生成初始数据：

- 10 个用户
- 50 个商品
- 100 个订单
- 30 个客户

数据会自动保存到本地存储，下次启动直接加载。

### 2.3 测试账号

生成的测试账号：
- 账号: `user1`
- 密码: `123456`

---

## 三、Mock 数据管理

### 3.1 数据类型

| 类型 | 说明 | 数据量 |
|------|------|--------|
| `user` | 用户数据 | 10 条 |
| `product` | 商品数据 | 50 条 |
| `order` | 订单数据 | 100 条 |
| `customer` | 客户数据 | 30 条 |

### 3.2 获取数据

```typescript
import mockDataManager from '@/mock/manager'

// 获取所有数据
const users = mockDataManager.getData('user')

// 根据 ID 获取
const user = mockDataManager.getDataById('user', 1)

// 分页获取
const { list, total } = mockDataManager.getDataByPage('product', 1, 20, {
  category: '电子产品'
})
```

### 3.3 操作数据

```typescript
// 添加数据
const newUser = mockDataManager.addData('user', {
  username: 'newuser',
  nickname: '新用户'
})

// 更新数据
mockDataManager.updateData('user', 1, {
  nickname: '新昵称'
})

// 删除数据
mockDataManager.deleteData('user', 1)
```

### 3.4 重置数据

```typescript
// 清空所有数据
await mockDataManager.clear()

// 重置为初始数据
await mockDataManager.reset()
```

---

## 四、API 接口调用

所有 API 调用都是统一的，使用适配器会自动切换 Mock/真实 API。

### 4.1 认证相关

```typescript
import { authApi } from '@/api'

// 用户登录
const result = await authApi.login({
  username: 'user1',
  password: '123456'
})
// 返回: { token, refreshToken, userInfo, expire }

// 用户退出
await authApi.logout()
```

### 4.2 商品相关

```typescript
import { productApi } from '@/api'

// 获取商品列表（分页）
const { list, total } = await productApi.getList({
  page: 1,
  pageSize: 20,
  keyword: '手机',    // 可选：搜索关键词
  category: '电子产品', // 可选：分类
  status: 'online'     // 可选：状态
})

// 获取商品详情
const product = await productApi.getDetail(1)

// 创建商品
const newProduct = await productApi.create({
  name: '新商品',
  price: 99.99,
  stock: 100
})

// 更新商品
await productApi.update(1, {
  name: '更新后的商品名'
})

// 删除商品
await productApi.delete(1)
```

### 4.3 订单相关

```typescript
import { orderApi } from '@/api'

// 获取订单列表
const { list, total } = await orderApi.getList({
  page: 1,
  pageSize: 20,
  status: 'pending', // pending/paid/shipped/completed/cancelled
  keyword: 'ORD123'
})

// 获取订单详情
const order = await orderApi.getDetail(1)

// 创建订单
const newOrder = await orderApi.create({
  productId: 1,
  quantity: 2,
  amount: 199.98
})

// 更新订单状态
await orderApi.updateStatus(1, 'paid')

// 取消订单
await orderApi.cancel(1)
```

### 4.4 客户相关

```typescript
import { customerApi } from '@/api'

// 获取客户列表
const { list, total } = await customerApi.getList({
  page: 1,
  pageSize: 20,
  keyword: '客户',
  industry: '互联网',
  level: 3
})

// 获取客户详情
const customer = await customerApi.getDetail(1)

// 创建客户
await customerApi.create({
  name: '新客户公司',
  contact: '张三',
  phone: '13900000000'
})
```

### 4.5 统计相关

```typescript
import { statisticsApi } from '@/api'

// 获取统计数据
const stats = await statisticsApi.getStatistics()
// 返回: { today, week, month, total }

// 获取订单统计（按日期）
const orderStats = await statisticsApi.getOrderStats({
  startDate: '2026-01-01',
  endDate: '2026-01-31'
})

// 获取商品销售排行
const ranking = await statisticsApi.getProductRanking({ limit: 10 })
```

---

## 五、环境切换

### 5.1 切换到真实 API

当后端 API 开发完成后，只需修改配置：

```typescript
// src/config/mock.ts
export const mockConfig = {
  enabled: false, // ← 改为 false
  delay: 300,
  errorRate: 0,
  showLog: true
}
```

### 5.2 运行时切换

也可以在代码中动态切换：

```typescript
import { setMockEnabled } from '@/config/mock'

// 禁用 Mock，使用真实 API
setMockEnabled(false)

// 启用 Mock
setMockEnabled(true)
```

### 5.3 调试配置

```typescript
import { setMockDelay, setMockErrorRate } from '@/config/mock'

// 设置延迟（模拟慢网络）
setMockDelay(1000) // 1秒延迟

// 设置错误率（测试错误处理）
setMockErrorRate(0.1) // 10% 错误率
```

---

## 六、完整示例

### 6.1 登录页面示例

```vue
<template>
  <view class="login-page">
    <x-input v-model="formData.username" label="账号" />
    <x-input v-model="formData.password" type="password" label="密码" />
    <x-button type="primary" :loading="loading" @click="handleLogin">
      登录
    </x-button>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { authApi } from '@/api'
import { useAuth } from '@/composables'
import { useForm, formRules } from '@/composables'

const { login } = useAuth()
const loading = ref(false)

const { formData, errors, handleSubmit } = useForm(
  { username: '', password: '' },
  {
    username: [formRules.required('请输入账号')],
    password: [formRules.required('请输入密码')]
  }
)

const handleLogin = async () => {
  await handleSubmit(async () => {
    loading.value = true
    try {
      // 调用 API（自动使用 Mock 或真实 API）
      const result = await authApi.login({
        username: formData.username,
        password: formData.password
      })

      // 保存用户信息
      await login(result.userInfo)

      // 跳转首页
      uni.reLaunch({ url: '/pages/index/index' })
    } finally {
      loading.value = false
    }
  })
}
</script>
```

### 6.2 商品列表示例

```vue
<template>
  <view class="product-list-page">
    <navbar title="商品列表" />

    <view class="content">
      <card v-for="item in list" :key="item.id" @click="handleDetail(item)">
        <image :src="item.images[0]" class="product-image" />
        <view class="product-info">
          <text class="product-name">{{ item.name }}</text>
          <text class="product-price">¥{{ item.price }}</text>
        </view>
      </card>
    </view>

    <x-loading :visible="loading" />
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { productApi } from '@/api'
import { useList } from '@/composables'
import type { ProductInfo } from '@/types'

const { list, loading, loadData, refresh } = useList<ProductInfo>()

// 加载数据
loadData(async (page, pageSize) => {
  return await productApi.getList({ page, pageSize })
})

// 下拉刷新
onPullDownRefresh(async () => {
  await refresh(() => productApi.getList({ page: 1, pageSize: 20 }))
  uni.stopPullDownRefresh()
})

// 查看详情
const handleDetail = (product: ProductInfo) => {
  uni.navigateTo({
    url: `/pages/product/detail/index?id=${product.id}`
  })
}
</script>
```

### 6.3 订单创建示例

```vue
<template>
  <view class="order-create-page">
    <navbar title="创建订单" />

    <view class="content">
      <card title="商品信息">
        <view class="product-detail">
          <text>{{ productInfo.name }}</text>
          <text>¥{{ productInfo.price }}</text>
        </view>
      </card>

      <view class="quantity-control">
        <text>数量:</text>
        <x-input
          v-model="quantity"
          type="number"
          placeholder="请输入数量"
        />
      </view>

      <x-button type="primary" @click="handleCreate">
        创建订单
      </x-button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { orderApi } from '@/api'
import { useRequest } from '@/composables'

const productInfo = ref({
  id: 1,
  name: '商品名称',
  price: 99.99
})

const quantity = ref(1)

const { loading } = useRequest()

const handleCreate = async () => {
  if (quantity.value < 1) {
    showErrorToast('数量必须大于0')
    return
  }

  try {
    const order = await orderApi.create({
      productId: productInfo.value.id,
      quantity: quantity.value,
      amount: (productInfo.value.price * quantity.value).toFixed(2)
    })

    showSuccess('订单创建成功')

    // 跳转到订单详情
    uni.navigateTo({
      url: `/pages/order/detail/index?id=${order.id}`
    })
  } catch (error) {
    showErrorToast('订单创建失败')
  }
}
</script>
```

---

## 七、高级功能

### 7.1 自定义 Mock 数据

你可以修改 `src/mock/manager.ts` 来自定义生成的数据：

```typescript
private generateUsers(count: number) {
  const users = []
  for (let i = 0; i < count; i++) {
    users.push({
      id: i + 1,
      username: `myuser${i + 1}`,  // ← 自定义用户名
      // ... 其他字段
    })
  }
  return users
}
```

### 7.2 添加新的 Mock 数据

```typescript
// 1. 在 generateInitialData 中添加
this.data.set('myNewType', this.generateMyNewData(50))

// 2. 添加生成方法
private generateMyNewData(count: number) {
  const data = []
  for (let i = 0; i < count; i++) {
    data.push({
      id: i + 1,
      name: `数据${i + 1}`,
      // ... 其他字段
    })
  }
  return data
}

// 3. 在 Mock API 中添加接口
async getMyNewData() {
  return this.request(async () => {
    return mockDataManager.getData('myNewType')
  })
}
```

### 7.3 数据导入导出

```typescript
// 导出 Mock 数据为 JSON
const data = mockDataManager.getData('user')
const json = JSON.stringify(data, null, 2)
console.log(json)

// 从 JSON 导入数据
const importedData = JSON.parse(json)
// 然后使用 addData 逐条添加
```

---

## 八、最佳实践

### 8.1 开发流程

1. **前期开发** - 使用 Mock 数据，专注于 UI 和交互
2. **联调阶段** - 切换到真实 API，进行接口对接
3. **测试阶段** - 可使用 Mock 数据模拟各种场景

### 8.2 团队协作

- 前端开发者：使用 Mock 数据并行开发
- 后端开发者：按照接口文档开发真实 API
- 测试人员：使用 Mock 数据测试边界情况

### 8.3 数据一致性

建议在团队中维护一份标准的 Mock 数据结构，确保前后端数据格式一致：

```typescript
// types/user.ts - 团队共享的类型定义
export interface User {
  id: number
  username: string
  nickname: string
  // ...
}
```

---

## 九、常见问题

### Q1: Mock 数据不生效？

检查配置：
```typescript
// src/config/mock.ts
export const mockConfig = {
  enabled: true, // ← 确保为 true
  // ...
}
```

### Q2: 如何重新生成数据？

```typescript
import mockDataManager from '@/mock/manager'

// 方式 1: 重置为初始数据
await mockDataManager.reset()

// 方式 2: 清空后重新初始化
await mockDataManager.clear()
await mockDataManager.init()
```

### Q3: 如何模拟错误？

```typescript
import { setMockErrorRate } from '@/config/mock'

// 设置 10% 的错误率
setMockErrorRate(0.1)

// 测试完成后记得关闭
setMockErrorRate(0)
```

### Q4: 数据持久化在哪里？

Mock 数据保存在 `uni.storage` 中，key 为 `mock_data`。

---

## 十、参考文档

- [公共模块使用指南.md](./公共模块使用指南.md)
- [Uniapp开发手册-架构与最佳实践.md](./Uniapp开发手册-架构与最佳实践.md)
- [基础设施使用指南.md](./基础设施使用指南.md)

---

**文档维护**: 随着项目发展及时更新本文档

**相关文件**:
- [src/mock/manager.ts](src/mock/manager.ts) - Mock 数据管理器
- [src/mock/api.ts](src/mock/api.ts) - Mock API 接口
- [src/config/mock.ts](src/config/mock.ts) - Mock 配置
- [src/api/adapter.ts](src/api/adapter.ts) - API 适配器
