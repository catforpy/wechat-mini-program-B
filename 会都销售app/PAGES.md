# 会都销售小程序 - 页面手册

> 记录所有页面的用途、跳转关系和组件依赖
> 最后更新：2025-02-12

---

## 目录

- [页面结构总览](#页面结构总览)
- [主要入口页面](#主要入口页面)
- [我的账户模块](#我的账户模块)
- [企业注册模块](#企业注册模块)
- [其他功能页面](#其他功能页面)
- [组件列表](#组件列表)

---

## 页面结构总览

```
我的 (index-new.vue) ⭐ 主要入口
│
├─ 用户信息 → profile-settings.vue
├─ 我的账户 → registrations.vue ⭐⭐⭐
│   ├─ 企业列表点击 → entity-detail.vue ⭐ 复杂
│   ├─ 注册卡片点击 → company-registration.vue
│   └─ 合作申请点击
│       ├─→ cooperation-requests.vue
│       ├─→ leasing-requests.vue
│       └─→ team-requests.vue
├─ 我的合作 → cooperations.vue
├─ 我的租赁 → leasings.vue
├─ 我的钱包 → wallet.vue
├─ 客服中心 → switchTab 到消息页
└─ 设置 → settings.vue
```

---

## 主要入口页面

### 📱 index-new.vue - 我的页面

**路径：** `pages/profile/index-new.vue`

**用途：** 个人中心主入口，展示用户信息和主要功能菜单

**跳转关系：**
- 用户信息区域点击 → `profile-settings.vue`
- 二维码按钮点击 → `my-qrcode.vue`
- "我的账户"点击 → `registrations.vue`
- "我的合作"点击 → `cooperations.vue`
- "我的租赁"点击 → `leasings.vue`
- "我的钱包"点击 → `wallet.vue`
- "客服中心"点击 → switchTab 到消息页
- "设置"点击 → `settings.vue`

**包含功能：**
1. 用户信息展示（头像、昵称、手机、实名状态、ID）
2. 我的账户入口（显示注册企业数量）
3. 我的合作入口（显示合作小程序数量）
4. 我的租赁入口（显示租赁小程序数量）
5. 我的钱包入口（显示都达豆余额）
6. 客服中心入口
7. 设置入口

---

## 我的账户模块

### 📁 registrations.vue - 我的账户页面

**路径：** `pages/profile/registrations.vue`

**用途：** 管理用户的所有注册主体（企业、个体工商户、境外主体）

**跳转关系：**
- "我选中的小程序"点击 → `mini-programs.vue`
- "我的合作"点击 → `cooperations.vue`
- "我的租赁"点击 → `leasings.vue`
- "我的钱包"点击 → `wallet.vue`
- 注册卡片点击 → `company-registration.vue`（传递 entityType, entitySubType, serviceType）
- "合作请求"点击 → `cooperation-requests.vue`
- "租赁请求"点击 → `leasing-requests.vue`
- "团队审批"点击 → `team-requests.vue`

**页面结构：**
```
┌─────────────────────────────────────────────────┐
│ 顶部导航栏：返回 | 标题"我的账户"       │
├─────────────────────────────────────────────────┤
│ 固定区域：                             │
│ ┌─────────────────────────────────────┐      │
│ │ 公司业务（标题）                  │      │
│ └─────────────────────────────────────┘      │
│                                         │
│ ┌─────────────────────────────────────────┐  │
│ │ scroll-view 区域                      │  │
│ │ ┌───────────────────────────────────┐  │  │
│ │ │ 公司业务菜单                    │  │  │
│ │ │ ├─ 我选中的小程序           │  │  │
│ │ │ ├─ 我的合作               │  │  │
│ │ │ ├─ 我的租赁               │  │  │
│ │ │ └─ 我的钱包               │  │  │
│ │ └───────────────────────────────────┘  │  │
│ └─────────────────────────────────────┘  │
│                                         │
│ ┌─────────────────────────────────────────┐  │
│ │ 固定区域：注册                     │  │
│ │ └─ registration-cards.vue            │  │
│ │   ├─ 非个人主体卡片（24种服务类型）│  │
│ │   │   📦 物流服务、🎓 教育、🏥 医疗...  │  │
│ │   ├─ 个人主体卡片（10种服务类型）   │  │
│ │   │   📮 快递、🎓 教育、🚚 交通...     │  │
│ │   └─ 境外主体卡片（15种服务类型）  │  │
│ │       📮 快递、🎓 教育、🚗 出行...      │  │
│ └─────────────────────────────────────┘  │
│                                         │
│ ┌─────────────────────────────────────────┐  │
│ │ 固定区域：合作申请                 │  │
│ │ └─ cooperation-applications.vue      │  │
│ │   ├─ 合作请求 (带数量徽章)        │  │
│ │   ├─ 租赁请求 (带数量徽章)        │  │
│ │   └─ 团队审批 (带数量徽章)        │  │
│ └─────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

**页面结构：**
```
┌─────────────────────────────────────────────────┐
│ 顶部导航栏：返回 | 标题"我的账户"       │
├─────────────────────────────────────────────────┤
│ 固定区域：                             │
│ ┌─────────────────────────────────────┐      │
│ │ 我的企业（标题）                  │      │
│ └─────────────────────────────────────┘      │
│                                         │
│ ┌─────────────────────────────────────────┐  │
│ │ scroll-view 区域                      │  │
│ │ ├─ enterprise-list.vue (企业列表)      │  │
│ │   ├─ 民营企业列表                 │  │
│ │   ├─ 个体工商户列表                │  │
│ │   └─ 境外主体列表                 │  │
│ └─────────────────────────────────────┘  │
│                                         │
│ ┌─────────────────────────────────────────┐  │
│ │ 固定区域：注册                     │  │
│ │ └─ registration-cards.vue            │  │
│ │   ├─ 非个人主体卡片（22种服务类型）│  │
│ │   ├─ 个人主体卡片（10种服务类型）   │  │
│ │   └─ 境外主体卡片（15种服务类型）  │  │
│ └─────────────────────────────────────┘  │
│                                         │
│ ┌─────────────────────────────────────────┐  │
│ │ 固定区域：合作申请                 │  │
│ │ └─ cooperation-applications.vue      │  │
│ │   ├─ 合作请求 (带数量徽章)        │  │
│ │   ├─ 租赁请求 (带数量徽章)        │  │
│ │   └─ 团队审批 (带数量徽章)        │  │
│ └─────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

**使用组件：**
- `registration-cards.vue` - 注册卡片展示
- `cooperation-applications.vue` - 合作申请展示

**页面包含内容：**
1. 公司业务菜单（我选中的小程序、我的合作、我的租赁、我的钱包）
2. 注册卡片（非个人主体24种、个人主体10种、境外主体15种服务类型）
3. 合作申请（合作请求、租赁请求、团队审批）

---

## 企业注册模块

### 📝 company-registration.vue - 企业注册页面 ⭐

**路径：** `pages/profile/company-registration.vue`

**用途：** 根据选择的主体类型和服务类型，填写企业/个体工商户注册信息

**参数接收：**
- `entityType`: 企业/个人/境外
- `entitySubType`: 主体类型（如"非个人主体"）
- `serviceType`: 服务类型（如"物流服务"、"教育服务"等）

**跳转关系：**
- 接收自 `registrations.vue` 的注册卡片点击
- 提交后返回 `registrations.vue`

**页面结构：**
```
┌─────────────────────────────────────────────────┐
│ 顶部导航栏：返回 | 标题（含服务类型）  │
├─────────────────────────────────────────────────┤
│ scroll-view 表单区域                    │
│ ├─ [1] enterprise-basic-info.vue         │
│ │   └─ 根据entityType显示不同字段  │
│ ├─ [2] business-license-upload.vue       │
│ │   └─ 上传营业执照（最多3张）      │
│ ├─ [3] bank-account-info.vue            │
│ │   └─ 对公账户信息                  │
│ ├─ [4] contact-person-info.vue           │
│ │   └─ 超级联系人（自动识别实名）      │
│ └─ [5] qualifications-list.vue ⭐         │
│     └─ 根据serviceType推荐资质      │
└─────────────────────────────────────────────────┘
                                         │
┌─────────────────────────────────────────────────┐
│ 底部：[提交注册] 按钮                    │
└─────────────────────────────────────────────────┘
```

**使用组件：**
1. `enterprise-basic-info.vue` - 企业基本信息表单
2. `business-license-upload.vue` - 营业执照上传
3. `bank-account-info.vue` - 对公账户信息
4. `contact-person-info.vue` - 超级联系人信息
5. `qualifications-list.vue` - 资质管理

---

### 🔍 entity-detail.vue - 企业/主体详情页面 ⚠️ 超复杂！

**路径：** `pages/profile/entity-detail.vue`（原 index.vue）

**用途：** 显示某个企业/主体的详细信息、小程序列表、订单、资质管理

**⚠️ 问题：** **2200+行代码**，混合了太多功能，建议拆分！

**接收参数：**
- `companyId`: 企业ID
- `companyName`: 企业名称
- `companyType`: 企业类型（用于推断主体分类）
- `accountType`: 账户类型（可选）

**跳转关系：**
- 接收自 `registrations.vue` 的企业列表点击
- "主体类型"点击 → `company-detail.vue`（营业执照详情页）
- "管理小程序"点击 → `mini-programs.vue`
- "我的订单"点击 → `orders.vue`
- "资质管理"点击 → `qualifications.vue`
- "合作请求"点击 → `cooperation-requests.vue`
- "租赁请求"点击 → `leasing-requests.vue`
- "团队审批"点击 → `team-requests.vue`
- "客服中心"点击 → switchTab 到消息页
- "设置"点击 → `settings.vue`
- "关于"点击 → `settings.vue`

**页面包含内容（超复杂）：**
1. 用户信息卡片（头像、昵称、实名状态）
2. 订单卡片（最新订单信息）
3. 小程序列表（显示该企业的小程序）
4. 资质管理卡片
5. 功能菜单列表（合作请求、租赁请求、团队审批、客服中心、设置、关于）
6. 小程序状态弹窗（审核中、开发中、已就绪）

---

## 其他功能页面

### 🏢 mini-programs.vue - 小程序管理页

**路径：** `pages/profile/mini-programs.vue`

**用途：** 管理某个企业的小程序列表

---

### 📋 orders.vue - 我的订单页

**路径：** `pages/profile/orders.vue`

**用途：** 显示订单列表

---

### 📄 qualifications.vue - 我的资质页

**路径：** `pages/profile/qualifications.vue`

**用途：** 管理企业的资质信息

---

### 🤝 cooperations.vue - 我的合作页

**路径：** `pages/profile/cooperations.vue`

**用途：** 管理合作小程序列表

---

### 🔄 leasings.vue - 我的租赁页

**路径：** `pages/profile/leasings.vue`

**用途：** 管理租赁小程序列表

---

### 💰 wallet.vue - 我的钱包页

**路径：** `pages/profile/wallet.vue`

**用途：** 钱包余额、充值、提现

---

### ⚙️ settings.vue - 设置页

**路径：** `pages/profile/settings.vue`

**用途：** 账号安全、消息通知、通用设置

---

### 👤 profile-settings.vue - 个人资料设置

**路径：** `pages/profile/profile-settings.vue`

**用途：** 修改头像、昵称、手机号

---

### 🖼️ my-qrcode.vue - 我的二维码页

**路径：** `pages/profile/my-qrcode.vue`

**用途：** 显示和分享个人二维码

---

### 🏢 company-detail.vue - 企业信息页

**路径：** `pages/profile/company-detail.vue`

**用途：** 显示营业执照、法人信息、银行信息

---

### ➕ add-company.vue - 添加企业页

**路径：** `pages/profile/add-company.vue`

**用途：** 添加新企业/主体

---

### 🤝 cooperation-application.vue - 合作申请页

**路径：** `pages/profile/cooperation-application.vue`

**用途：** 提交合作申请

---

### 🔄 leasing-application.vue - 租赁申请页

**路径：** `pages/profile/leasing-application.vue`

**用途：** 提交租赁申请

---

### 📨 cooperation-requests.vue - 合作请求页

**路径：** `pages/profile/cooperation-requests.vue`

**用途：** 查看和处理合作申请

---

### 📦 leasing-requests.vue - 租赁请求页

**路径：** `pages/profile/leasing-requests.vue`

**用途：** 查看和处理租赁申请

---

### 👥 team-requests.vue - 团队审批页

**路径：** `pages/profile/team-requests.vue`

**用途：** 查看和处理团队加入申请

---

### 🏢 join-company.vue - 加入企业页

**路径：** `pages/profile/join-company.vue`

**用途：** 申请加入某个企业

---

### 👨‍💼 management-team.vue - 管理团队页

**路径：** `pages/profile/management-team.vue`

**用途：** 管理企业团队成员

---

### 🪪 real-name-info.vue - 实名信息页

**路径：** `pages/profile/real-name-info.vue`

**用途：** 查看实名认证信息和状态

---

### 🖼️ avatar-setting.vue - 修改头像页

**路径：** `pages/profile/avatar-setting.vue`

**用途：** 修改用户头像

---

### 📝 nickname-setting.vue - 修改昵称页

**路径：** `pages/profile/nickname-setting.vue`

**用途：** 修改用户昵称

---

### 📱 phone-setting.vue - 修改手机页

**路径：** `pages/profile/phone-setting.vue`

**用途：** 修改绑定手机号

---

## 组件列表

### 企业相关组件（components/profile/）

#### 📋 enterprise-list.vue - 企业列表组件
**路径：** `components/profile/enterprise-list.vue`

**Props：**
- `nonPersonalCompanies`: 非个人主体企业列表
- `personalCompanies`: 个人主体企业列表
- `overseasCompanies`: 境外主体企业列表

**Events：**
- `@company-click`: 点击企业

**功能：** 展示三类企业列表，支持展开/折叠

---

#### 🎴 registration-cards.vue - 注册卡片组件
**路径：** `components/profile/registration-cards.vue`

**Props：**
- `nonPersonalCards`: 非个人主体卡片（22种服务类型）
  - 📦 物流服务
  - 🎓 教育服务
  - 🏥 医疗服务
  - 🏛️ 政务民生
  - 💰 金融业
  - 🚚 交通服务
  - 🏠 房地产服务
  - 🛎️ 生活服务
  - 💻 IT科技
  - 🍜 餐饮服务
  - ✈️ 旅游服务
  - 📰 时政信息
  - 🎭 文娱
  - 🔧 工具
  - 🛒 电商平台
  - 🏪 商家自营
  - 💼 商业服务
  - 🎨 工艺
  - 👥 社交
  - ⚽ 体育
  - 🚗 汽车服务
  - 💬 咨询
  - 🔬 深度合成
  - 🧪 内测
- `personalCards`: 个人主体卡片（10种服务类型）
  - 📮 快递业与邮政
  - 🎓 教育服务
  - 🚚 交通服务
  - 🛎️ 生活服务
  - 🍜 餐饮服务
  - ✈️ 旅游服务
  - 🔧 工具
  - 💼 商业服务
  - ⚽ 体育
  - 🎭 文娱
- `overseasCards`: 境外主体卡片（15种服务类型）
  - 📮 快递业与邮政
  - 🎓 教育服务
  - 🚗 出行与交通
  - 🏠 房地产
  - 🛎️ 生活服务
  - 🍜 餐饮
  - ✈️ 旅游
  - 🔧 工具
  - 💼 商业服务
  - ⚽ 体育
  - 🚗 汽车
  - 💻 IT科技
  - 🏛️ 公共服务
  - 📍 本地服务
  - 🌐 跨境电商

**Events：**
- `@card-click`: 点击卡片

**功能：** 显示服务类型卡片网格（22+10+15=47个服务类型）

---

#### 🤝 cooperation-applications.vue - 合作申请组件
**路径：** `components/profile/cooperation-applications.vue`

**Props：**
- `cooperationRequestCount`: 合作请求数量
- `leasingRequestCount`: 租赁请求数量
- `teamRequestCount`: 团队审批数量

**Events：**
- `@cooperation-click`: 点击合作请求
- `@leasing-click`: 点击租赁请求
- `@team-click`: 点击团队审批

**功能：** 显示3个请求入口（无图标）

---

### 注册表单组件

#### 📝 enterprise-basic-info.vue - 企业基本信息表单
**路径：** `components/profile/enterprise-basic-info.vue`

**Props：**
- `entityType`: 主体类型（企业/个人/境外）
- `entitySubType`: 主体子类型
- `modelValue`: 表单数据

**Events：**
- `@update:modelValue`: 更新表单数据

**功能：** 根据主体类型显示不同的表单字段

**表单字段：**
- 企业: 企业名称、法定代表人、信用代码、成立日期、注册地址、经营范围
- 个体工商户: 个体工商户名称、经营者、注册地址、经营范围
- 境外主体: 境外主体名称、法定代表人、信用代码、注册地址、经营范围

---

#### 📷 business-license-upload.vue - 营业执照上传组件
**路径：** `components/profile/business-license-upload.vue`

**Props：**
- `modelValue`: 图片URL数组
- `maxCount`: 最大上传数量（默认3）

**Events：**
- `@update:modelValue`: 更新图片数组

**功能：** 图片上传、预览、删除

---

#### 🏦 bank-account-info.vue - 对公账户信息组件
**路径：** `components/profile/bank-account-info.vue`

**Props：**
- `entityType`: 主体类型
- `modelValue`: 银行账户信息

**Events：**
- `@update:modelValue`: 更新银行信息

**功能：** 对公账户表单，个人主体时可选法人账户

**表单字段：**
- 账户类型选择（个人主体时）
- 开户名称/账户名称
- 银行账号
- 开户银行（下拉选择）
- 开户支行/开户网点

---

#### 👤 contact-person-info.vue - 超级联系人组件
**路径：** `components/profile/contact-person-info.vue`

**Props：**
- `autoName`: 自动识别的姓名
- `autoPhone`: 自动识别的手机号
- `modelValue`: 联系人信息

**Events：**
- `@update:modelValue`: 更新联系信息

**功能：** 显示和编辑超级联系人信息

**表单字段：**
- 姓名（自动填充）
- 手机号（自动填充）
- 身份证号

---

#### 📄 qualifications-list.vue - 资质管理组件 ⭐⭐⭐
**路径：** `components/profile/qualifications-list.vue`

**Props：**
- `entityType`: 主体类型
- `serviceType`: 服务类型（用于推荐）
- `modelValue`: 资质列表

**Events：**
- `@update:modelValue`: 更新资质列表

**功能：**
- 已添加资质列表展示
- 添加资质按钮
- 推荐资质区域（根据 serviceType 显示）
- 资质类型选择弹窗
- 资质详情表单
- 自定义资质输入

**资质数据库：**
- 常用资质：6种（电信增值、网络文化、食品经营、医疗器械、出版物、旅行社）
- 其他资质：6种（食品健康证、消防许可证、环保许可证、广告经营许可证、道路运输经营许可证、建筑资质）
- 服务类型与推荐资质映射

---

## ⚠️ 重要提示

1. **entity-detail.vue（原 index.vue）过于复杂**
   - 2200+ 行代码
   - 混合了用户信息、企业信息、订单、小程序、资质、菜单等多种功能
   - **建议拆分成多个独立页面或组件**

2. **所有组件已在 components/profile/ 目录**
   - 便于复用和维护
   - 清晰的 Props/Events 接口

3. **页面命名规范**
   - 使用英文小写加连字符
   - 文件名清晰表达功能
   - 例如：company-registration.vue, entity-detail.vue

---

**文档维护：** 当新增/修改页面时，请同步更新此文档
