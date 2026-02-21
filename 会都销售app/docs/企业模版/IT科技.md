# IT科技行业模版

## 一、共性内容（所有行业通用）

### 1.1 基础信息
- **企业名称**: string - IT科技企业全称
- **企业Logo**: image - 企业标志图片
- **行业类型**: string - "IT科技"
- **成立时间**: date - 企业成立日期
- **企业规模**: string - 如: 员工xx人、用户xx亿

### 1.2 企业介绍
- **企业简介**: text - 200-500字企业介绍
- **技术理念**: text - 技术愿景、使命
- **发展历程**: array - 历史里程碑列表

### 1.3 宣传内容
- **宣传片**: video - 企业宣传视频
- **宣传图片轮播**: array[5-10]
- **荣誉资质**: array - 资质证书、专利证书

### 1.4 联系方式
- **客服电话**: string
- **商务合作**: string
- **企业地址**: string
- **官方网站**: string
- **APP下载**: object

### 1.5 用户评价
- **用户评分**: number
- **评价总数**: number
- **用户好评**: array[10-20]

---

## 二、IT科技行业特性内容

### 2.1 产品服务
- **产品分类**: array
  - 产品类别: string (如: 企业软件、云服务、AI技术、大数据)
  - 产品列表: array
    - 产品名称: string
    - 产品简介: text
    - 产品特点: text
    - 产品图片: image
    - 产品详情链接: string
- **核心产品**: array[5-10]
  - 产品名称: string
  - 产品封面: image
  - 产品介绍: text
  - 用户数: number
  - 产品详情链接: string

### 2.2 技术优势
- **核心技术**: array[5-10]
  - 技术名称: string
  - 技术介绍: text
  - 技术优势: text
  - 技术应用: text
  - 技术图片: image
- **专利成果**: array
  - 专利名称: string
  - 专利编号: string
  - 获得时间: date
  - 专利图片: image

### 2.3 解决方案
- **行业方案**: array
  - 行业名称: string (如: 金融、教育、医疗、零售)
  - 方案列表: array
    - 方案名称: string
    - 方案介绍: text
    - 方案图片: image
    - 成功案例: string
- **解决方案**: array[10-20]
  - 方案名称: string
  - 方案介绍: text
  - 方案特点: array
  - 方案架构: image
  - 方案详情链接: string

### 2.4 技术团队
- **团队概况**: object
  - 技术人员总数: number
  - 博士人数: number
  - 硕士人数: number
  - 平均经验: number
- **技术专家**: array[5-15]
  - 专家姓名: string
  - 职位: string
  - 专业领域: string
  - 从业年限: number
  - 个人简介: text
  - 个人照片: image
  - 技术博客: string (可选)

### 2.5 客户案例
- **成功案例**: array[10-30]
  - 客户名称: string
  - 客户Logo: image
  - 合作项目: string
  - 项目介绍: text
  - 项目成果: text
  - 项目图片: array[image]
  - 客户评价: text
- **合作伙伴**: array[20-50]
  - 企业名称: string
  - 企业Logo: image
  - 合作内容: string

### 2.6 服务支持
- **服务体系**: array
  - 服务类型: string (如: 技术支持、培训服务、定制开发)
  - 服务说明: text
  - 服务流程: text
- **技术支持**: object
  - 支持方式: array
    - 方式: string (如: 在线支持、电话支持、现场支持)
    - 说明: text
  - 支持时间: string
  - 支持承诺: text

### 2.7 数据中心
- **基础设施**: array
  - 设施名称: string (如: 数据中心、服务器集群)
  - 设施介绍: text
  - 设施图片: array[image]
- **安全保障**: array
  - 保障项目: string (如: 数据加密、备份容灾)
  - 保障说明: text
  - 保障级别: string

### 2.8 数据统计
- **业务数据**: object
  - 用户总数: number
  - 企业客户数: number
  - 日活跃用户: number
  - 服务器数量: number

### 2.9 技术资讯
- **技术文章**: array[20-50]
  - 文章标题: string
  - 文章类别: string
  - 发布时间: date
  - 内容摘要: text
  - 详细内容: text
  - 文章链接: string

### 2.10 常见问题
- **FAQ**: array[20-50]
  - 问题分类: string
  - 问题: string
  - 答案: text

---

## 三、页面结构建议

1. 企业介绍
2. 产品服务
3. 技术优势
4. 解决方案
5. 技术团队
6. 客户案例
7. 服务支持
8. 数据中心
9. 数据统计
10. 技术资讯
11. 常见问题
12. 用户评价
13. 联系方式
