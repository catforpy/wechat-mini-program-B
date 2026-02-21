# 企业详情页 / 主体详情页

## 概述

这是一个**通用的主体详情页**，用于显示所有类型主体（企业、个体工商户、事业单位、境外主体等）的详细信息。

**页面路径**：`/pages/profile/index.vue`

## 核心功能

### 1. 主体信息展示
- 显示主体名称（如：上海XX科技有限公司）
- 显示主体类型（企业/个人主体/事业单位/境外主体）
- 显示账户类型（超级管理员/管理员/联系人）
- 显示主体认证状态

### 2. 小程序列表
- 显示该主体拥有的所有小程序
- 支持查看小程序详情
- 支持管理小程序（编辑、删除等）

### 3. 订单管理
- 显示该主体的相关订单
- 支持查看订单详情
- 支持订单状态跟踪

### 4. 资质管理
- 显示该主体已通过的资质
- 支持添加新资质
- 支持查看资质详情

## 支持的主体类型

| 主体类型 | 示例 | companyType 示例值 |
|---------|------|-------------------|
| 企业 | 上海XX科技有限公司 | 有限责任公司、股份有限公司 |
| 个人主体 | 浦东新区XX餐饮店 | 个体工商户、个人独资企业 |
| 事业单位 | 北京XX教育集团 | 事业单位 |
| 境外主体 | 香港XX国际集团有限公司 | 境外企业、外资企业 |

## 使用方式

### 跳转到企业详情页

```javascript
// 从公司列表跳转
uni.navigateTo({
  url: `/pages/profile/index?companyId=${company.id}&companyName=${encodeURIComponent(company.name)}&companyType=${encodeURIComponent(company.type)}`
})

// 示例：跳转到上海XX科技有限公司的详情页
uni.navigateTo({
  url: '/pages/profile/index?companyId=123&companyName=上海XX科技有限公司&companyType=有限责任公司'
})
```

### URL 参数说明

| 参数名 | 类型 | 必填 | 说明 |
|-------|------|------|------|
| companyId | string | 否 | 主体ID |
| companyName | string | **是** | 主体名称 |
| companyType | string | 否 | 主体类型（用于推断主体分类） |
| accountType | string | 否 | 账户类型（super_admin/manager/contact） |

## 页面逻辑

### 1. 自动推断主体分类

根据 `companyType` 参数自动推断主体分类：

```javascript
if (companyType.includes('个体工商户') || companyType.includes('个人独资')) {
  // → 个人主体
} else if (companyType.includes('事业单位')) {
  // → 事业单位
} else if (companyType.includes('境外') || companyType.includes('外资')) {
  // → 境外主体
} else {
  // → 企业
}
```

### 2. 条件渲染

- **有 companyName 参数**：显示主体详情页（显示主体信息、小程序列表等）
- **无 companyName 参数**：显示用户个人中心（显示用户信息、个人数据等）

## 与其他页面的关系

```
我的账户 (registrations.vue)
    ↓ 点击某个公司
企业详情页 (index.vue) ← 【当前页面】
    ↓ 点击"主体类型：企业 >"
企业信息页 (company-detail.vue)
```

## 重要说明

1. **此页面是通用的主体详情页**
   - 所有企业、个体工商户、事业单位、境外主体等详情页都复用此模板
   - 根据 `companyType` 参数自动推断主体分类并显示相应内容

2. **此页面不是企业信息页**
   - 此页面：显示主体的小程序列表、订单、资质等业务信息
   - 企业信息页（company-detail.vue）：显示营业执照、法人、银行信息等基本信息

3. **可复用性**
   - 任何需要查看主体详情的地方都可以跳转到此页面
   - 只需传递正确的参数（companyId、companyName、companyType）

## 相关文件

- `pages/profile/index.vue` - 【当前页面】企业详情页/主体详情页
- `pages/profile/company-detail.vue` - 企业信息页（营业执照、法人等）
- `pages/profile/registrations.vue` - 我的账户页面（公司列表）
- `pages/profile/index-new.vue` - 用户个人中心页面

## 更新日志

- 2025-01-XX: 创建企业详情页，支持所有主体类型的详情展示
- 2025-01-XX: 添加详细的页面说明和使用文档
