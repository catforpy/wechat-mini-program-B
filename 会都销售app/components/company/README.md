# 公司列表版体使用手册

## 概述

本模块提供了两种不同的公司列表版体组件，用于展示"我的公司"页面中的公司和其对应的小程序。

## 版体对比

### 版体1 (CompanyListLayout1) - 内联按钮版

**文件位置**: `components/company/CompanyListLayout1.vue`

**特点**:
- ✅ "添加小程序"按钮位于每个公司展开后的列表底部
- ✅ 根据按钮所在公司类型**自动筛选**下拉列表
- ✅ 上下文关联性强，用户明确知道为哪个公司添加小程序

**筛选逻辑**:
```
点击太湖学院（企业类型）下的"添加小程序"
  → 弹窗下拉列表只显示企业类型的已认证企业

点击王记小吃店（个体工商户类型）下的"添加小程序"
  → 弹窗下拉列表只显示个体工商户类型的已认证企业

点击优选商城（电子商务类型）下的"添加小程序"
  → 弹窗下拉列表只显示电子商务类型的已认证企业
```

**适用场景**:
- 用户主要围绕特定公司进行操作
- 需要强调小程序与所属公司的关联
- 已认证企业数量较多，需要减少选择范围

**优势**:
- 🎯 精准筛选，减少用户选择困惑
- 🎯 上下文清晰，操作意图明确
- 🎯 符合用户心智模型

**劣势**:
- ⚠️ 需要展开公司才能看到按钮
- ⚠️ 长列表可能需要多次滚动

---

### 版体2 (CompanyListLayout2) - 页面级悬浮按钮版

**文件位置**: `components/company/CompanyListLayout2.vue`

**特点**:
- ✅ "添加小程序"按钮为页面右下角悬浮按钮（固定位置）
- ✅ 下拉列表显示**所有类型**的已认证企业
- ✅ 不受列表滚动影响，始终可见可点击

**归类逻辑**:
```
用户点击右下角悬浮按钮
  → 弹窗下拉列表显示所有类型的已认证企业
  → 用户选择任意企业后点击确定
  → 根据所选企业的类型，自动将小程序归类到对应类型的公司下
```

**适用场景**:
- 用户需要频繁添加小程序
- 公司列表较长，不希望每次都滚动到底部
- 已认证企业数量不多，不需要筛选

**优势**:
- 🚀 按钮始终可见，无需滚动
- 🚀 操作更快捷，减少点击次数
- 🚀 适合高频使用场景

**劣势**:
- ⚠️ 缺少上下文，用户需要记住为哪个公司添加
- ⚠️ 下拉列表可能较长，增加选择难度

---

## 接口定义

### Props (两个版体相同)

```typescript
interface Props {
  companies: Company[]                  // 公司列表
  authenticatedCompanies: AuthenticatedCompany[]  // 已认证企业列表
}

interface Company {
  id: string
  name: string
  type: 'enterprise' | 'individual' | 'shop' | 'ecommerce'
  typeLabel: string
  maxPrograms: number
  miniPrograms: MiniProgram[]
  expanded: boolean
}

interface AuthenticatedCompany {
  id: string
  name: string
  type: string
  typeLabel: string
}
```

### Events

#### 版体1 Events

```typescript
emit('programClick', program: MiniProgram)
// 小程序被点击时触发

emit('addProgram', useNewCompany: boolean, company: AuthenticatedCompany | null, targetCompany: Company)
// 添加小程序确认时触发
// - useNewCompany: true=使用新注册企业, false=使用已认证企业
// - company: 选中的已认证企业（如果useNewCompany为false）
// - targetCompany: 目标公司（点击按钮所在的公司）
```

#### 版体2 Events

```typescript
emit('programClick', program: MiniProgram)
// 小程序被点击时触发

emit('addProgram', useNewCompany: boolean, company: AuthenticatedCompany | null)
// 添加小程序确认时触发
// - useNewCompany: true=使用新注册企业, false=使用已认证企业
// - company: 选中的已认证企业（包含type信息，用于自动归类）
```

---

## 使用示例

### 在 company-shop.vue 中使用版体1

```vue
<template>
  <view class="company-shop-page">
    <!-- 顶部导航栏 -->
    <view class="nav-bar" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="nav-content">
        <view class="nav-back" @tap="goBack">
          <text class="back-icon">←</text>
        </view>
        <view class="nav-title">我的公司</view>
        <view class="nav-action" @tap="addCompany">
          <text class="add-icon">+</text>
        </view>
      </view>
    </view>

    <!-- 主内容区域 -->
    <scroll-view class="main-content" scroll-y :style="{ paddingTop: (statusBarHeight + 88) + 'px' }">
      <CompanyListLayout1
        :companies="allCompanies"
        :authenticated-companies="authenticatedCompanies"
        @program-click="handleProgramClick"
        @add-program="handleAddProgram"
      />
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import CompanyListLayout1 from '@/components/company/CompanyListLayout1.vue'
import type { Company, MiniProgram, AuthenticatedCompany } from '@/components/company/CompanyListLayout1.vue'

// 公司数据
const allCompanies = ref<Company[]>([...])

// 已认证企业数据
const authenticatedCompanies = ref<AuthenticatedCompany[]>([...])

// 处理小程序点击
const handleProgramClick = (program: MiniProgram) => {
  uni.showToast({
    title: `打开${program.name}`,
    icon: 'none'
  })
}

// 处理添加小程序
const handleAddProgram = (
  useNewCompany: boolean,
  company: AuthenticatedCompany | null,
  targetCompany: Company
) => {
  if (useNewCompany) {
    // 使用新注册企业，跳转到注册页面
    uni.navigateTo({
      url: '/pages/profile/company-registration-list'
    })
  } else {
    // 使用已认证企业，为targetCompany添加小程序
    uni.showToast({
      title: `为"${targetCompany.name}"使用"${company!.name}"添加小程序`,
      icon: 'success'
    })
    // TODO: 调用API添加小程序
  }
}
</script>
```

### 在 company-shop.vue 中使用版体2

```vue
<template>
  <view class="company-shop-page">
    <!-- 顶部导航栏 -->
    <view class="nav-bar" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="nav-content">
        <view class="nav-back" @tap="goBack">
          <text class="back-icon">←</text>
        </view>
        <view class="nav-title">我的公司</view>
        <view class="nav-action" @tap="addCompany">
          <text class="add-icon">+</text>
        </view>
      </view>
    </view>

    <!-- 主内容区域 -->
    <scroll-view class="main-content" scroll-y :style="{ paddingTop: (statusBarHeight + 88) + 'px' }">
      <CompanyListLayout2
        :companies="allCompanies"
        :authenticated-companies="authenticatedCompanies"
        @program-click="handleProgramClick"
        @add-program="handleAddProgram"
      />
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import CompanyListLayout2 from '@/components/company/CompanyListLayout2.vue'
import type { Company, MiniProgram, AuthenticatedCompany } from '@/components/company/CompanyListLayout2.vue'

// 公司数据
const allCompanies = ref<Company[]>([...])

// 已认证企业数据
const authenticatedCompanies = ref<AuthenticatedCompany[]>([...])

// 处理小程序点击
const handleProgramClick = (program: MiniProgram) => {
  uni.showToast({
    title: `打开${program.name}`,
    icon: 'none'
  })
}

// 处理添加小程序
const handleAddProgram = (
  useNewCompany: boolean,
  company: AuthenticatedCompany | null
) => {
  if (useNewCompany) {
    // 使用新注册企业，跳转到注册页面
    uni.navigateTo({
      url: '/pages/profile/company-registration-list'
    })
  } else {
    // 使用已认证企业，根据company.type自动归类
    uni.showToast({
      title: `使用"${company!.name}"（${company!.typeLabel}）添加小程序`,
      icon: 'success'
    })
    // TODO: 根据company.type将小程序添加到对应类型的公司下
  }
}
</script>
```

---

## 切换版体步骤

1. **修改导入语句**:
   ```vue
   // 从版体1切换到版体2
   import CompanyListLayout2 from '@/components/company/CompanyListLayout2.vue'
   ```

2. **修改模板标签**:
   ```vue
   <!-- 将 CompanyListLayout1 改为 CompanyListLayout2 -->
   <CompanyListLayout2
     :companies="allCompanies"
     :authenticated-companies="authenticatedCompanies"
     @program-click="handleProgramClick"
     @add-program="handleAddProgram"
   />
   ```

3. **调整事件处理函数**:
   ```typescript
   // 版体1的事件处理
   const handleAddProgram = (
     useNewCompany: boolean,
     company: AuthenticatedCompany | null,
     targetCompany: Company  // 版体1有第三个参数
   ) => {
     // ...
   }

   // 版体2的事件处理
   const handleAddProgram = (
     useNewCompany: boolean,
     company: AuthenticatedCompany | null  // 版体2只有两个参数
   ) => {
     // 需要根据company.type自动归类
   }
   ```

---

## 关键差异总结

| 特性 | 版体1 (内联按钮) | 版体2 (悬浮按钮) |
|------|------------------|------------------|
| 按钮位置 | 每个公司内部 | 页面右下角固定 |
| 下拉筛选 | 按公司类型筛选 | 显示所有类型 |
| 目标公司 | 明确（targetCompany） | 自动归类（company.type） |
| 上下文 | 强关联 | 弱关联 |
| 适用场景 | 围绕特定公司操作 | 高频添加、快速操作 |

---

## 注意事项

1. **按钮显示条件**: 两个版体都只有在 `company.miniPrograms.length < company.maxPrograms` 时才显示"添加小程序"按钮
2. **弹窗组件**: 两个版体都共用 `AddProgramModal` 组件
3. **类型安全**: 使用TypeScript接口定义，确保类型安全
4. **事件参数**: 注意两个版体的 `@add-program` 事件参数不同

---

## 更新日志

- 2026-02-13: 创建两个版体组件及使用手册
