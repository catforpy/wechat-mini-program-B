# Uniapp 开发手册 - 架构设计与最佳实践

> 基于 Flutter 开发经验的 Uniapp 项目开发指南
> 如何构建高内聚、低耦合、高性能的 Uniapp 项目

**最后更新**: 2026-02-07

---

## 📋 目录

- [一、Flutter vs Uniapp 核心差异对比](#一flutter-vs-uniapp-核心差异对比)
- [二、项目架构设计](#二项目架构设计)
- [三、开发顺序与最佳实践](#三开发顺序与最佳实践)
- [四、性能优化策略](#四性能优化策略)
- [五、高内聚低耦合实现方案](#五高内聚低耦合实现方案)
- [六、推荐的项目目录结构](#六推荐的项目目录结构)
- [七、开发规范与约定](#七开发规范与约定)

---

## 一、Flutter vs Uniapp 核心差异对比

### 1.1 技术栈对比

| 维度 | Flutter | Uniapp |
|-----|---------|--------|
| **开发语言** | Dart | JavaScript/TypeScript |
| **UI渲染** | 自绘引擎 (Skia) | 混合渲染 (原生+WebView) |
| **状态管理** | Provider/Riverpod/Bloc | Pinia/Vuex |
| **架构模式** | BLoC/Provider | Composition API |
| **编译产物** | 原生代码 | 各平台代码(小程序/H5/App) |
| **热重载** | ✅ 极快 | ✅ 较快 |
| **性能** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |

### 1.2 架构理念差异

**Flutter 的特点:**
- 一切皆 Widget，树状结构
- 强类型、编译时检查
- 自绘渲染，跨平台一致性强
- 适合大型、复杂应用

**Uniapp 的特点:**
- Vue 语法，组件化开发
- 弱类型(JS)或可选强类型(TS)
- 条件编译，平台差异化处理
- 适合快速迭代、中小型应用
- 一次开发，多端发布

### 1.3 迁移建议

**从 Flutter 到 Uniapp 的思维转换:**

```dart
// Flutter: 声明式 UI
Widget build(BuildContext context) {
  return Container(
    child: Text('Hello'),
  );
}
```

```vue
<!-- Uniapp: 模板 + Script + Style -->
<template>
  <view class="container">
    <text>Hello</text>
  </view>
</template>
```

---

## 二、项目架构设计

### 2.1 整体架构分层

```
┌─────────────────────────────────────────┐
│           Presentation Layer            │  ← 页面/组件
│   (Pages/Components/Layouts)            │
├─────────────────────────────────────────┤
│          Business Logic Layer           │  ← 业务逻辑
│   (Composables/Hooks/Stores)            │
├─────────────────────────────────────────┤
│           Data Access Layer             │  ← 数据访问
│   (API/Storage/Cache)                   │
├─────────────────────────────────────────┤
│          Infrastructure Layer           │  ← 基础设施
│   (Utils/Config/Constants)              │
└─────────────────────────────────────────┘
```

### 2.2 核心设计原则

**1. 单一职责原则 (SRP)**
- 每个模块只负责一个功能
- 组件化、模块化开发

**2. 依赖倒置原则 (DIP)**
- 依赖抽象而非具体实现
- 使用接口隔离

**3. 开闭原则 (OCP)**
- 对扩展开放，对修改关闭
- 使用策略模式、工厂模式

### 2.3 推荐的设计模式

**1. 仓储模式 (Repository Pattern)**
```javascript
// 数据访问层抽象
class UserRepository {
  async getUserInfo(id) { }
  async updateUserInfo(data) { }
}
```

**2. 工厂模式 (Factory Pattern)**
```javascript
// 根据平台创建不同实现
class ApiServiceFactory {
  static create() {
    // #ifdef MP-WEIXIN
    return new WechatApiService()
    // #endif
    // #ifdef H5
    return new H5ApiService()
    // #endif
  }
}
```

**3. 观察者模式 (Observer Pattern)**
```javascript
// 使用 Pinia 实现状态管理
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({ }),
  actions: { }
})
```

---

## 三、开发顺序与最佳实践

### 3.1 推荐的开发顺序

**✅ 与 Flutter 相似的开发顺序:**

```
第一阶段：基础设施层 (Infrastructure)
├── 1.1 项目配置搭建
│   ├── TypeScript 配置
│   ├── ESLint/Prettier 配置
│   └── 环境变量配置
├── 1.2 核心工具库开发
│   ├── HTTP 请求封装
│   ├── 存储封装
│   ├── 日志工具
│   └── 常用工具函数
├── 1.3 全局样式与主题
│   ├── CSS 变量定义
│   ├── 主题配置
│   └── 通用样式类

第二阶段：数据访问层 (Data Access)
├── 2.1 API 接口定义
│   ├── 接口类型定义
│   ├── API 方法封装
│   └── 错误处理
├── 2.2 数据存储
│   ├── 本地存储封装
│   ├── 缓存策略
│   └── 数据同步机制
└── 2.3 数据模型
    ├── TypeScript 类型定义
    └── 数据转换工具

第三阶段：业务逻辑层 (Business Logic)
├── 3.1 状态管理
│   ├── Store 设计
│   ├── 状态拆分
│   └── 持久化策略
├── 3.2 业务 Hooks/Composables
│   ├── 用户相关 hooks
│   ├── 订单相关 hooks
│   └── 通用业务 hooks
└── 3.3 业务服务
    ├── 权限服务
    ├── 路由服务
    └── 支付服务

第四阶段：UI 组件层 (Presentation)
├── 4.1 基础组件
│   ├── Button、Input 等基础组件
│   ├── Loading、Toast 等反馈组件
│   └── Picker、Dialog 等选择组件
├── 4.2 业务组件
│   ├── 用户卡片
│   ├── 订单列表项
│   └── 商品卡片
├── 4.3 布局组件
│   ├── 页面容器
│   ├── 导航栏
│   └── TabBar
└── 4.4 页面开发
    ├── 按功能模块开发
    └── 页面组装与集成

第五阶段：优化与测试
├── 5.1 性能优化
├── 5.2 代码重构
└── 5.3 测试与修复
```

### 3.2 各阶段详细说明

#### 第一阶段：基础设施层

**优先级: ⭐⭐⭐⭐⭐ (最高)**

这是项目的基石，类似 Flutter 的 `core` 模块。

**1. HTTP 请求封装**

```typescript
// src/utils/http/request.ts
import type { Interceptor } from '@/types/http'

class HttpRequest {
  private instance: any
  private interceptors: Interceptor = {
    request: [],
    response: []
  }

  constructor(config: RequestConfig) {
    this.instance = uni.request(config)
  }

  // 请求拦截
  request<T>(config: RequestConfig): Promise<T> {
    return this.instance.request(config)
  }

  // 拦截器管理
  setRequestInterceptor(fn: Function) { }
  setResponseInterceptor(fn: Function) { }
}

export default HttpRequest
```

**2. 存储封装**

```typescript
// src/utils/storage/index.ts
class Storage {
  // 设置数据
  static set(key: string, value: any): Promise<boolean> { }

  // 获取数据
  static get(key: string): Promise<any> { }

  // 删除数据
  static remove(key: string): Promise<boolean> { }

  // 清空数据
  static clear(): Promise<boolean> { }
}

export default Storage
```

**3. 环境配置**

```typescript
// src/config/index.ts
interface Config {
  baseURL: string
  apiVersion: string
  timeout: number
}

const config: Config = {
  baseURL: 'https://api.example.com',
  apiVersion: '/v1',
  timeout: 10000
}

export default config
```

#### 第二阶段：数据访问层

**优先级: ⭐⭐⭐⭐**

类似 Flutter 的 Repository 层。

**1. API 接口封装**

```typescript
// src/api/user.ts
import http from '@/utils/http/request'

interface LoginParams {
  username: string
  password: string
}

interface UserInfo {
  id: number
  name: string
  avatar: string
}

export const userApi = {
  // 用户登录
  login(params: LoginParams) {
    return http.post<UserInfo>('/user/login', params)
  },

  // 获取用户信息
  getUserInfo() {
    return http.get<UserInfo>('/user/info')
  }
}
```

**2. 类型定义**

```typescript
// src/types/user.ts
export interface User {
  id: number
  username: string
  nickname: string
  avatar: string
  email?: string
  phone?: string
  createTime: string
}

export interface LoginForm {
  username: string
  password: string
}

export type UserRole = 'admin' | 'user' | 'guest'
```

#### 第三阶段：业务逻辑层

**优先级: ⭐⭐⭐**

类似 Flutter 的 BLoC/Provider。

**1. Pinia Store 设计**

```typescript
// src/stores/user.ts
import { defineStore } from 'pinia'
import { userApi } from '@/api/user'
import type { User } from '@/types/user'

export const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: null as User | null,
    token: ''
  }),

  getters: {
    isLogin: (state) => !!state.token,
    userName: (state) => state.userInfo?.nickname || '游客'
  },

  actions: {
    async login(params: LoginForm) {
      const res = await userApi.login(params)
      this.token = res.token
      this.userInfo = res.userInfo
    },

    async getUserInfo() {
      const res = await userApi.getUserInfo()
      this.userInfo = res
      return res
    },

    logout() {
      this.token = ''
      this.userInfo = null
    }
  },

  // 持久化
  persist: {
    key: 'user-store',
    storage: {
      getItem: uni.getStorageSync,
      setItem: uni.setStorageSync
    }
  }
})
```

**2. Composables 封装**

```typescript
// src/composables/useAuth.ts
import { useUserStore } from '@/stores/user'
import { computed } from 'vue'

export function useAuth() {
  const userStore = useUserStore()

  const isLogin = computed(() => userStore.isLogin)
  const userInfo = computed(() => userStore.userInfo)

  const login = async (params: LoginForm) => {
    return await userStore.login(params)
  }

  const logout = () => {
    userStore.logout()
  }

  return {
    isLogin,
    userInfo,
    login,
    logout
  }
}
```

#### 第四阶段：UI 组件层

**优先级: ⭐⭐⭐**

类似 Flutter 的 Widget。

**1. 基础组件封装**

```vue
<!-- src/components/base/Button.vue -->
<template>
  <button
    :class="['x-button', `x-button--${type}`, `x-button--${size}`]"
    :disabled="disabled || loading"
    @click="handleClick"
  >
    <text v-if="loading">加载中...</text>
    <slot v-else />
  </button>
</template>

<script setup lang="ts">
interface Props {
  type?: 'primary' | 'success' | 'warning' | 'danger'
  size?: 'small' | 'medium' | 'large'
  disabled?: boolean
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'primary',
  size: 'medium',
  disabled: false,
  loading: false
})

const emit = defineEmits<{
  click: []
}>()

const handleClick = () => {
  if (!props.disabled && !props.loading) {
    emit('click')
  }
}
</script>

<style scoped lang="scss">
.x-button {
  // 样式实现
}
</style>
```

**2. 业务组件示例**

```vue
<!-- src/components/business/UserCard.vue -->
<template>
  <view class="user-card" @click="handleClick">
    <image class="user-avatar" :src="user.avatar" mode="aspectFill" />
    <view class="user-info">
      <text class="user-name">{{ user.nickname }}</text>
      <text class="user-desc">{{ user.description }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import type { User } from '@/types/user'

interface Props {
  user: User
}

const props = defineProps<Props>()
const emit = defineEmits<{
  click: [user: User]
}>()

const handleClick = () => {
  emit('click', props.user)
}
</script>
```

**3. 页面开发**

```vue
<!-- src/pages/user/index.vue -->
<template>
  <view class="page">
    <!-- 使用封装好的组件 -->
    <x-navbar title="用户中心" />

    <view class="content">
      <user-card :user="userInfo" @click="handleUserClick" />

      <x-button type="primary" @click="handleLogout">
        退出登录
      </x-button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuth } from '@/composables/useAuth'

const { userInfo, logout } = useAuth()

const handleUserClick = (user: User) => {
  console.log('点击用户:', user)
}

const handleLogout = () => {
  logout()
}
</script>
```

---

## 四、性能优化策略

### 4.1 数据结构与算法优化

**1. 防抖与节流**

```typescript
// src/utils/performance/debounce.ts
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number = 300
): (...args: Parameters<T>) => void {
  let timer: number | null = null

  return function(this: any, ...args: Parameters<T>) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}

// 使用
const handleSearch = debounce((keyword: string) => {
  console.log('搜索:', keyword)
}, 500)
```

**2. 数据缓存**

```typescript
// src/utils/cache/index.ts
class DataCache {
  private cache: Map<string, { data: any; expire: number }> = new Map()

  set(key: string, data: any, ttl: number = 60000) {
    this.cache.set(key, {
      data,
      expire: Date.now() + ttl
    })
  }

  get(key: string) {
    const item = this.cache.get(key)
    if (!item) return null

    if (Date.now() > item.expire) {
      this.cache.delete(key)
      return null
    }

    return item.data
  }
}

export default new DataCache()
```

**3. 虚拟列表**

对于长列表数据，使用虚拟列表减少渲染节点：

```vue
<template>
  <scroll-view
    scroll-y
    :style="{ height: containerHeight }"
    @scroll="handleScroll"
  >
    <view :style="{ height: totalHeight }">
      <view
        v-for="item in visibleData"
        :key="item.id"
        :style="{ transform: `translateY(${item._offset}px)` }"
      >
        {{ item.content }}
      </view>
    </view>
  </scroll-view>
</template>
```

### 4.2 渲染性能优化

**1. 减少不必要的响应式数据**

```typescript
// ❌ 不推荐: 所有数据都是响应式的
const state = reactive({
  list: [],
  config: {},
  constants: {}  // 常量不需要响应式
})

// ✅ 推荐: 只对需要响应的数据使用 reactive/ref
const list = ref([])
const config = ref({})
const constants = { ... }  // 普通对象
```

**2. 使用 computed 缓存计算结果**

```typescript
// ✅ 推荐
const filteredList = computed(() => {
  return list.value.filter(item => item.active)
})

// ❌ 不推荐: 每次渲染都重新计算
const getFilteredList = () => {
  return list.value.filter(item => item.active)
}
```

**3. 合理使用 v-show 和 v-if**

```vue
<!-- ✅ 频繁切换使用 v-show -->
<view v-show="isVisible">内容</view>

<!-- ✅ 条件很少改变使用 v-if -->
<view v-if="isLoaded">加载完成的内容</view>
```

**4. 列表 key 优化**

```vue
<!-- ❌ 不推荐: 使用 index 作为 key -->
<view v-for="(item, index) in list" :key="index">

<!-- ✅ 推荐: 使用唯一 ID -->
<view v-for="item in list" :key="item.id">
```

### 4.3 网络请求优化

**1. 请求合并**

```typescript
// 批量请求合并
class BatchRequest {
  private queue: any[] = []
  private timer: number | null = null

  add(request: any) {
    this.queue.push(request)

    if (!this.timer) {
      this.timer = setTimeout(() => {
        this.execute()
      }, 100)
    }
  }

  async execute() {
    const requests = [...this.queue]
    this.queue = []
    this.timer = null

    // 批量发送请求
    return Promise.all(requests)
  }
}
```

**2. 请求缓存**

```typescript
// 带 TTL 的请求缓存
const apiCache = new Map()

async function getCachedData(url: string, ttl: number = 60000) {
  const cached = apiCache.get(url)

  if (cached && Date.now() - cached.time < ttl) {
    return cached.data
  }

  const data = await http.get(url)
  apiCache.set(url, { data, time: Date.now() })

  return data
}
```

**3. 图片懒加载**

```vue
<template>
  <image
    :src="currentSrc"
    :lazy-load="true"
    @load="handleLoad"
    @error="handleError"
  />
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps<{ src: string }>()
const currentSrc = ref('')
const observer = ref<any>(null)

onMounted(() => {
  // 创建 IntersectionObserver
  observer.value = uni.createIntersectionObserver()
  observer.value.observe('.image-container', (res) => {
    if (res.intersectionRatio > 0) {
      currentSrc.value = props.src
    }
  })
})

onBeforeUnmount(() => {
  observer.value?.disconnect()
})
</script>
```

### 4.4 内存优化

**1. 及时清理定时器和监听**

```typescript
// 组件卸载时清理
onBeforeUnmount(() => {
  // 清理定时器
  if (timer) clearTimeout(timer)

  // 清理事件监听
  uni.offNetworkStatusChange(callback)

  // 清理观察者
  observer.disconnect()
})
```

**2. 避免内存泄漏**

```typescript
// ❌ 不推荐: 闭包持有大对象
function createHandler() {
  const bigData = new Array(1000000).fill(0)
  return () => {
    console.log(bigData.length)
  }
}

// ✅ 推荐: 只保留需要的数据
function createHandler() {
  const bigData = new Array(1000000).fill(0)
  const len = bigData.length  // 只保留需要的值
  return () => {
    console.log(len)
  }
}
```

### 4.5 包体积优化

**1. 按需引入组件**

```typescript
// ❌ 不推荐: 全量引入
import ElementPlus from 'element-plus'

// ✅ 推荐: 按需引入
import { Button, Dialog } from 'element-plus'
```

**2. Tree Shaking**

```javascript
// vite.config.js
export default {
  build: {
    // 启用 tree shaking
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,  // 移除 console
        pure_funcs: ['console.log']
      }
    }
  }
}
```

**3. 分包加载**

```json
// pages.json
{
  "subPackages": [
    {
      "root": "pages/user",
      "pages": [
        {
          "path": "profile",
          "style": { }
        }
      ]
    }
  ]
}
```

---

## 五、高内聚低耦合实现方案

### 5.1 模块化设计

**1. 功能模块划分**

```
src/
├── modules/
│   ├── user/           # 用户模块
│   │   ├── api.ts      # 用户相关 API
│   │   ├── types.ts    # 用户类型定义
│   │   ├── store.ts    # 用户状态管理
│   │   └── composables/ # 用户相关 hooks
│   ├── order/          # 订单模块
│   └── product/        # 商品模块
```

**2. 模块内部高内聚**

```typescript
// modules/user/index.ts - 统一导出
export * from './api'
export * from './types'
export * from './store'
export * from './composables'

// 其他地方使用
import { userApi, useUserStore, type User } from '@/modules/user'
```

### 5.2 依赖注入

**1. 依赖抽象而非具体实现**

```typescript
// types/storage.ts - 定义接口
interface IStorage {
  get<T>(key: string): Promise<T | null>
  set<T>(key: string, value: T): Promise<boolean>
}

// implementations/local-storage.ts - 具体实现
class LocalStorage implements IStorage {
  async get<T>(key: string): Promise<T | null> { }
  async set<T>(key: string, value: T): Promise<boolean> { }
}

// implementations/secure-storage.ts - 另一种实现
class SecureStorage implements IStorage {
  async get<T>(key: string): Promise<T | null> { }
  async set<T>(key: string, value: T): Promise<boolean> { }
}

// 使用依赖注入
class UserRepository {
  constructor(private storage: IStorage) { }

  async getUser() {
    return await this.storage.get<User>('user')
  }
}

// 根据环境注入不同的实现
const storage = process.env.NODE_ENV === 'production'
  ? new SecureStorage()
  : new LocalStorage()

const userRepo = new UserRepository(storage)
```

### 5.3 事件总线解耦

```typescript
// utils/event-bus.ts
class EventBus {
  private events: Map<string, Function[]> = new Map()

  on(event: string, callback: Function) {
    if (!this.events.has(event)) {
      this.events.set(event, [])
    }
    this.events.get(event)!.push(callback)
  }

  emit(event: string, ...args: any[]) {
    const callbacks = this.events.get(event)
    if (callbacks) {
      callbacks.forEach(cb => cb(...args))
    }
  }

  off(event: string, callback?: Function) {
    if (!callback) {
      this.events.delete(event)
    } else {
      const callbacks = this.events.get(event)
      if (callbacks) {
        const index = callbacks.indexOf(callback)
        if (index > -1) {
          callbacks.splice(index, 1)
        }
      }
    }
  }
}

export default new EventBus()

// 使用
eventBus.on('user:login', (user) => {
  console.log('用户登录:', user)
})

eventBus.emit('user:login', { id: 1, name: '张三' })
```

### 5.4 组件通信优化

**1. 单向数据流**

```vue
<!-- 父组件 -->
<template>
  <child-component
    :value="parentValue"
    @update="handleUpdate"
  />
</template>

<script setup>
const parentValue = ref('')

const handleUpdate = (newValue) => {
  parentValue.value = newValue
}
</script>
```

**2. Provide/Inject 跨层级通信**

```typescript
// 父组件
import { provide } from 'vue'

provide('userInfo', {
  name: '张三',
  age: 25
})

// 子组件
import { inject } from 'vue'

const userInfo = inject('userInfo')
```

### 5.5 接口隔离

```typescript
// 定义最小接口
interface ReadOnlyUser {
  id: number
  name: string
}

interface WritableUser {
  updateName(name: string): void
}

// 组件只依赖需要的接口
function UserCard({ user }: { user: ReadOnlyUser }) {
  return <view>{user.name}</view>
}

function UserEditor({ user }: { user: WritableUser }) {
  return <button onClick={() => user.updateName('新名字')}>修改</button>
}
```

---

## 六、推荐的项目目录结构

```
销售app会都/
├── src/                          # 源代码目录
│   ├── api/                      # API 接口层
│   │   ├── index.ts              # 统一导出
│   │   ├── user.ts               # 用户相关接口
│   │   ├── order.ts              # 订单相关接口
│   │   └── product.ts            # 商品相关接口
│   │
│   ├── assets/                   # 静态资源
│   │   ├── images/               # 图片
│   │   ├── icons/                # 图标
│   │   └── fonts/                # 字体
│   │
│   ├── components/               # 组件
│   │   ├── base/                 # 基础组件
│   │   │   ├── Button.vue
│   │   │   ├── Input.vue
│   │   │   ├── Modal.vue
│   │   │   └── index.ts
│   │   │
│   │   └── business/             # 业务组件
│   │       ├── UserCard.vue
│   │       ├── ProductItem.vue
│   │       └── OrderCard.vue
│   │
│   ├── composables/              # 组合式函数
│   │   ├── useAuth.ts            # 认证相关
│   │   ├── useRequest.ts         # 请求封装
│   │   ├── useUpload.ts          # 上传功能
│   │   └── index.ts
│   │
│   ├── config/                   # 配置文件
│   │   ├── index.ts              # 主配置
│   │   ├── env.ts                # 环境配置
│   │   └── constant.ts           # 常量定义
│   │
│   ├── layouts/                  # 布局组件
│   │   ├── DefaultLayout.vue
│   │   ├── EmptyLayout.vue
│   │   └── components/           # 布局相关组件
│   │       ├── Navbar.vue
│   │       ├── Tabbar.vue
│   │       └── Sidebar.vue
│   │
│   ├── pages/                    # 页面
│   │   ├── index/                # 首页
│   │   │   └── index.vue
│   │   ├── user/                 # 用户模块
│   │   │   ├── profile/
│   │   │   ├── settings/
│   │   │   └── login/
│   │   └── order/                # 订单模块
│   │       ├── list/
│   │       └── detail/
│   │
│   ├── stores/                   # 状态管理
│   │   ├── user.ts
│   │   ├── order.ts
│   │   ├── app.ts
│   │   └── index.ts
│   │
│   ├── styles/                   # 样式文件
│   │   ├── index.scss            # 全局样式
│   │   ├── variables.scss        # 变量定义
│   │   ├── mixins.scss           # mixins
│   │   └── themes/               # 主题
│   │       ├── default.scss
│   │       └── dark.scss
│   │
│   ├── types/                    # TypeScript 类型定义
│   │   ├── api.ts                # API 类型
│   │   ├── user.ts               # 用户类型
│   │   ├── order.ts              # 订单类型
│   │   ├── global.d.ts           # 全局类型
│   │   └── index.ts
│   │
│   ├── utils/                    # 工具函数
│   │   ├── http/                 # HTTP 请求
│   │   │   ├── request.ts
│   │   │   ├── interceptors.ts
│   │   │   └── index.ts
│   │   ├── storage/              # 存储封装
│   │   │   ├── index.ts
│   │   │   └── constants.ts
│   │   ├── format.ts             # 格式化工具
│   │   ├── validate.ts           # 验证工具
│   │   ├── performance.ts        # 性能优化
│   │   └── index.ts
│   │
│   ├── App.vue                   # 应用入口
│   ├── main.ts                   # 主入口文件
│   └── manifest.json             # 应用配置
│
├── static/                       # 静态资源 (不会被 webpack 处理)
│   ├── logo.png
│   └── favicon.ico
│
├── uni.scss                      # 全局 SCSS 变量
├── pages.json                    # 页面路由配置
├── package.json                  # 项目依赖
├── tsconfig.json                 # TypeScript 配置
├── vite.config.ts                # Vite 配置
└── .env                          # 环境变量
```

---

## 七、开发规范与约定

### 7.1 命名规范

**1. 文件命名**

```
组件文件:      PascalCase (UserCard.vue)
工具文件:      camelCase (format.ts)
类型文件:      camelCase (user.ts)
常量文件:      camelCase (constant.ts)
样式文件:      kebab-case (user-card.scss)
```

**2. 变量命名**

```typescript
// 常量: UPPER_SNAKE_CASE
const API_BASE_URL = 'https://api.example.com'
const MAX_RETRY_COUNT = 3

// 变量/函数: camelCase
const userName = '张三'
function getUserInfo() { }

// 类/接口/类型: PascalCase
class UserService { }
interface UserInfo { }
type UserRole = 'admin' | 'user'

// 私有变量: 前缀下划线
const _privateData = 'private'
```

**3. 组件命名**

```vue
<!-- 单文件组件: PascalCase -->
<template>
  <UserCard />
  <OrderList />
</template>

<!-- 组件文件名 -->
UserCard.vue
OrderList.vue
```

### 7.2 代码风格

**1. 使用 TypeScript**

```typescript
// ✅ 推荐: 明确类型定义
function getUserInfo(id: number): Promise<User> {
  return http.get<User>(`/user/${id}`)
}

// ❌ 不推荐: 缺少类型
function getUserInfo(id) {
  return http.get(`/user/${id}`)
}
```

**2. 组件 props 定义**

```vue
<script setup lang="ts">
interface Props {
  title: string
  count?: number
  data: User[]
}

// 使用 withDefaults 设置默认值
const props = withDefaults(defineProps<Props>(), {
  count: 0
})
</script>
```

**3. 事件定义**

```vue
<script setup lang="ts">
// 明确事件类型
const emit = defineEmits<{
  submit: [data: FormData]
  cancel: []
  change: [value: string, oldValue: string]
}>()
</script>
```

### 7.3 注释规范

**1. 文件注释**

```typescript
/**
 * 用户服务类
 * 负责用户相关的业务逻辑处理
 *
 * @module services/user
 * @author 作者名
 * @created 2026-02-07
 */
```

**2. 函数注释**

```typescript
/**
 * 获取用户信息
 *
 * @param userId - 用户ID
 * @param includeDetail - 是否包含详细信息
 * @returns 用户信息对象
 * @throws {Error} 当用户不存在时抛出错误
 *
 * @example
 * ```typescript
 * const user = await getUserInfo(123, true)
 * ```
 */
async function getUserInfo(
  userId: number,
  includeDetail: boolean = false
): Promise<User> {
  // 实现
}
```

**3. 复杂逻辑注释**

```typescript
// 使用缓存策略减少网络请求
// 1. 检查本地缓存
// 2. 如果缓存存在且未过期，直接返回
// 3. 否则发起网络请求
const cached = cache.get(key)
if (cached && !isExpired(cached)) {
  return cached.data
}
```

### 7.4 Git 提交规范

**使用 Conventional Commits:**

```
<type>(<scope>): <subject>

<body>

<footer>
```

**类型 (type):**
- `feat`: 新功能
- `fix`: 修复 bug
- `docs`: 文档更新
- `style`: 代码格式(不影响代码运行)
- `refactor`: 重构
- `perf`: 性能优化
- `test`: 测试相关
- `chore`: 构建/工具变动

**示例:**

```
feat(user): 添加用户登录功能

- 实现用户登录接口
- 添加登录表单验证
- 实现 token 存储逻辑

Closes #123
```

### 7.5 性能监控

**1. 页面加载时间监控**

```typescript
export function usePerformanceMonitor() {
  onMounted(() => {
    const perfData = performance.getEntriesByType('navigation')[0]
    console.log('页面加载时间:', perfData.loadEventEnd - perfData.fetchStart)
  })
}
```

**2. 接口请求监控**

```typescript
// 在请求拦截器中记录
function logRequest(url: string, duration: number) {
  console.log(`[API] ${url} - ${duration}ms`)

  // 慢接口告警
  if (duration > 3000) {
    console.warn(`[Slow API] ${url} 耗时 ${duration}ms`)
  }
}
```

---

## 八、开发工具推荐

### 8.1 VS Code 插件

```
- Volar (Vue 3 支持)
- TypeScript Vue Plugin
- ESLint
- Prettier
- GitLens
- Bracket Pair Colorizer
- Error Lens
- Auto Rename Tag
- Path Intellisense
```

### 8.2 Chrome 插件

```
- Vue.js devtools
- uni-app 开发者工具
```

### 8.3 CLI 工具

```bash
# 代码格式化
npm install -D prettier

# 代码检查
npm install -D eslint

# Git 提交规范化
npm install -D husky commitlint

# 单元测试
npm install -D vitest
```

---

## 九、总结与建议

### 9.1 Flutter → Uniapp 迁移要点

**✅ 相似之处:**
1. 组件化开发思想相同
2. 响应式编程模式相似
3. 状态管理理念相通
4. 可以采用相同的分层架构

**❌ 主要差异:**
1. TypeScript 可选,需要更严格的自控
2. 平台差异需要条件编译处理
3. 性能优化手段略有不同
4. 生态和工具链不如 Flutter 完善

### 9.2 开发建议

**1. 优先级排序:**
```
基础设施层 (最高) → 数据层 → 业务层 → 组件层 → 页面层
```

**2. 性能优化优先级:**
```
算法优化 > 缓存策略 > 渲染优化 > 资源优化
```

**3. 代码质量保证:**
- 使用 TypeScript 严格模式
- 配置 ESLint + Prettier
- 编写单元测试
- Code Review

**4. 团队协作:**
- 统一的代码规范
- 统一的目录结构
- 详细的文档
- 清晰的 Git 工作流

### 9.3 项目实施步骤

```
Week 1: 基础设施搭建
  ├── 环境配置
  ├── 目录结构规划
  ├── 工具库开发
  └── 样式系统搭建

Week 2: 核心模块开发
  ├── HTTP 请求封装
  ├── 状态管理搭建
  ├── 用户模块
  └── 认证模块

Week 3-4: 业务功能开发
  ├── 各业务模块 API
  ├── 业务组件开发
  └── 页面开发

Week 5: 优化与测试
  ├── 性能优化
  ├── Bug 修复
  └── 上线准备
```

---

**文档维护**: 本文档应随着项目发展持续更新

**相关文档**:
- [API接口手册-小程序绑定功能.md](./API接口手册-小程序绑定功能.md)
- [Uniapp 官方文档](https://uniapp.dcloud.net.cn/)
