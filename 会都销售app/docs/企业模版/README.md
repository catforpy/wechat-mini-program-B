# 企业模版系统说明文档

## 概述

本企业模版系统是为了支持"会都销售"小程序中"商家浏览"页面的企业详情展示而设计的。每个行业都有自己独特的展示需求和数据结构，本模版系统定义了各行业的页面框架、数据字段和展示逻辑。

---

## 行业列表

目前已创建以下33个行业的模版文档：

### 1. 详细模版（包含完整数据结构）
1. **物流服务** - `物流服务.md`
2. **教育服务** - `教育服务.md`
3. **医疗服务** - `医疗服务.md`
4. **政务民生** - `政务民生.md`
5. **金融业** - `金融业.md`
6. **交通服务** - `交通服务.md`
7. **房地产服务** - `房地产服务.md`
8. **生活服务** - `生活服务.md`
9. **IT科技** - `IT科技.md`
10. **餐饮服务** - `餐饮服务.md`
11. **旅游服务** - `旅游服务.md`
12. **时政信息** - `时政信息.md`
13. **文娱** - `文娱.md`
14. **工具** - `工具.md`
15. **电商平台** - `电商平台.md`
16. **商家自营** - `商家自营.md`
17. **商业服务** - `商业服务.md`
18. **公益** - `公益.md`
19. **社交** - `社交.md`
20. **体育** - `体育.md`
21. **汽车服务** - `汽车服务.md`
22. **咨询** - `咨询.md`
23. **深度合成** - `深度合成.md`
24. **内测** - `内测.md`

### 2. 简化模版（引用主模版）
25. **快递业与邮政** - 引用物流服务模版
26. **教育** - 引用教育服务模版
27. **出行与交通** - 引用交通服务模版
28. **房地产** - 引用房地产服务模版
29. **餐饮** - 引用餐饮服务模版
30. **旅游** - 引用旅游服务模版
31. **汽车** - 引用汽车服务模版
32. **公共服务** - 简化版本
33. **本地服务** - 简化版本
34. **跨境电商** - 引用电商平台模版

---

## 模版文档结构

每个详细模版文档包含以下四个部分：

### 一、共性内容（所有行业通用）

这部分定义了所有行业都会有的基础数据结构：

1. **基础信息**
   - 企业名称、Logo、行业类型、成立时间、规模

2. **企业介绍**
   - 企业简介、理念、发展历程

3. **宣传内容**
   - 宣传片、宣传图片轮播、荣誉资质

4. **联系方式**
   - 客服电话、投诉电话、地址、官网、APP下载

5. **用户评价**
   - 评分、评价总数、用户好评列表

### 二、行业特性内容

这部分定义了该行业独有的数据字段和展示内容，例如：
- 物流服务：运力展示、物流团队、智能化服务、安心保障
- 教育服务：师资力量、课程体系、学员风采、教学环境
- 医疗服务：医生团队、科室介绍、医疗设备、就诊服务

### 三、页面结构建议

这部分给出了页面模块的展示顺序建议，例如：
1. 企业介绍
2. 核心服务/产品
3. 特色优势
4. 用户评价
5. 联系方式

### 四、数据结构示例

这部分提供了JSON格式的数据结构示例，供后端开发参考。

---

## 使用说明

### 1. 前端开发

**页面路由：**
```
/pages/company/detail?id={companyId}&industry={industryType}
```

**数据获取：**
```typescript
// 根据行业类型获取对应的企业详情数据
interface CompanyDetailParams {
  companyId: string
  industry: string  // 行业类型，如: "物流服务"
}

// API返回数据结构
interface CompanyDetailResponse {
  basicInfo: BasicInfo      // 共性基础信息
  industryInfo: IndustryInfo // 行业特性信息（根据行业类型不同而不同）
}
```

**页面渲染逻辑：**
```vue
<template>
  <view class="company-detail">
    <!-- 共性模块 -->
    <CompanyBanner :info="data.basicInfo" />
    <CompanyIntro :info="data.basicInfo" />
    <CompanyMedia :media="data.basicInfo.media" />
    <CompanyContact :contact="data.basicInfo.contact" />
    <UserReviews :reviews="data.basicInfo.reviews" />

    <!-- 行业特性模块 - 根据industry动态渲染 -->
    <component
      :is="industryComponent"
      :data="data.industryInfo"
    />
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// 行业组件映射
const industryComponents = {
  '物流服务': 'LogisticsContent',
  '教育服务': 'EducationContent',
  '医疗服务': 'MedicalContent',
  // ... 其他行业
}

const industryComponent = computed(() => {
  return industryComponents[industry] || 'DefaultContent'
})
</script>
```

### 2. 后端开发

**数据库设计：**

方案1：使用MongoDB等文档数据库
```javascript
// 企业详情数据结构
{
  _id: ObjectId,
  companyId: String,
  industry: String,  // 行业类型

  // 共性数据
  basicInfo: {
    companyName: String,
    logo: String,
    // ... 其他基础信息
  },

  // 行业特性数据（根据industry不同，结构不同）
  industryInfo: {
    // 物流服务
    logistics: {
      fleet: { ... },
      serviceArea: { ... },
      // ...
    },

    // 或教育服务
    education: {
      teachers: { ... },
      courses: { ... },
      // ...
    },

    // ... 根据industry动态存储
  }
}
```

方案2：使用关系型数据库
- 基础信息表（companies）：存储共性数据
- 行业扩展表（company_{industry}）：每个行业一张表，存储行业特性数据

**API接口设计：**
```
GET /api/company/detail
参数:
  - companyId: string
  - industry: string

返回:
{
  code: 200,
  data: {
    basicInfo: { ... },
    industryInfo: { ... }
  }
}
```

### 3. 管理后台开发

**数据录入流程：**

1. **商家注册/登录**
2. **选择行业类型**（从33个行业中选择）
3. **填写基础信息**（共性内容）
4. **填写行业特性内容**（根据选择的行业，动态显示对应的表单）
5. **提交审核**

**表单组件示例：**
```vue
<!-- 行业表单选择器 -->
<select v-model="selectedIndustry">
  <option value="物流服务">物流服务</option>
  <option value="教育服务">教育服务</option>
  <!-- ... 其他32个行业 -->
</select>

<!-- 动态表单渲染 -->
<component
  :is="industryFormComponent"
  v-model="industryData"
/>

<script setup lang="ts">
const industryFormComponents = {
  '物流服务': 'LogisticsForm',
  '教育服务': 'EducationForm',
  // ...
}
</script>
```

---

## 数据字段规范

### 图片字段
- 类型：string
- 格式：URL（支持CDN）
- 建议尺寸：
  - Logo: 200x200px
  - 封面图: 750x400px
  - 详情图: 750x600px

### 视频字段
- 类型：string
- 格式：URL（MP4）
- 建议规格：
  - 分辨率：1920x1080或1280x720
  - 时长：3-5分钟
  - 大小：<100MB

### 文本字段
- 简介类：200-500字
- 描述类：不限
- 标题类：10-30字

### 数组字段
- 建议数量：
  - 轮播图：5-10张
  - 证书：5-10个
  - 用户评价：10-20条
  - 产品/服务：10-50个

---

## 扩展指南

### 添加新行业模版

1. 在`docs/企业模版/`目录下创建新的`{行业名称}.md`文件
2. 按照模版结构编写文档
3. 定义该行业的特有数据字段
4. 更新本README文档

### 修改现有行业模版

1. 编辑对应的行业模版文档
2. 同步更新：
   - 前端页面组件
   - 后端数据结构
   - 管理后台表单
3. 通知相关开发人员

---

## 版本历史

- **v1.0** (2025-02-20)
  - 创建33个行业模版文档
  - 定义共性数据结构
  - 定义各行业特性数据结构
  - 编写使用说明文档

---

## 联系方式

如有问题或建议，请联系项目组。
