# 企业类目文档解析项目

本项目用于解析微信小程序企业类目文档，生成TypeScript代码以便在小程序中使用。

## 文件说明

### 核心文件

- **企业类目文档-clean.txt**: 原始类目文档
- **categories-complete.ts**: 解析生成的TypeScript类目数据文件
- **parse_fixed.py**: 用于解析文档的Python脚本

### 辅助文件

- **parse_report.txt**: 解析报告，包含统计信息
- **categories-usage-example.ts**: 使用示例代码

## 解析结果

### 一级类目统计（24个）

| 序号 | 一级类目 | 二级类目数量 |
|------|----------|--------------|
| 1 | 物流服务 | 10 |
| 2 | 教育服务 | 20 |
| 3 | 医疗服务 | 24 |
| 4 | 政务民生 | 64 |
| 5 | 金融业 | 38 |
| 6 | 交通服务 | 37 |
| 7 | 房地产服务 | 8 |
| 8 | 生活服务 | 40 |
| 9 | IT科技 | 19 |
| 10 | 餐饮服务 | 18 |
| 11 | 旅游服务 | 18 |
| 12 | 时政信息 | 36 |
| 13 | 文娱 | 36 |
| 14 | 工具 | 22 |
| 15 | 电商平台 | 14 |
| 16 | 商家自营 | 55 |
| 17 | 商业服务 | 35 |
| 18 | 公益 | 9 |
| 19 | 社交 | 13 |
| 20 | 体育 | 5 |
| 21 | 汽车服务 | 9 |
| 22 | 资讯 | 2 |
| 23 | 深度合成 | 5 |
| 24 | 内测 | 7 |

**总计: 24 个一级类目，544 个二级类目**

## TypeScript 数据结构

### 接口定义

```typescript
export interface CategoryTemplate {
  name: string;           // 二级类目名称
  qualification: string;  // 资质要求
  scope: string;          // 适用范围
  templates: string[];    // 模板列表（预留字段）
}

export interface PrimaryCategory {
  name: string;                      // 一级类目名称
  children: CategoryTemplate[];      // 二级类目列表
}
```

### 数据导出

```typescript
export const categories: PrimaryCategory[] = [
  {
    name: '物流服务',
    children: [
      {
        name: '收件/派件',
        qualification: '（3选1）：...',
        scope: '适用于快递行业，提供寄件、收件等服务。',
        templates: []
      },
      // ... 更多二级类目
    ]
  },
  // ... 更多一级类目
];
```

## 使用方法

### 1. 导入模块

```typescript
import { categories, PrimaryCategory, CategoryTemplate } from './categories-complete';
```

### 2. 查找一级类目

```typescript
const logistics = categories.find(cat => cat.name === '物流服务');
console.log(logistics?.children.length); // 二级类目数量
```

### 3. 查找二级类目

```typescript
function findSecondary(name: string) {
  for (const primary of categories) {
    const found = primary.children.find(sec => sec.name === name);
    if (found) {
      return { primary: primary.name, category: found };
    }
  }
  return undefined;
}

const result = findSecondary('快递柜');
console.log(result?.category.qualification);
console.log(result?.category.scope);
```

### 4. 搜索类目

```typescript
function search(keyword: string) {
  const results: { primary: string; secondary: string }[] = [];
  
  categories.forEach(primary => {
    primary.children.forEach(secondary => {
      if (secondary.name.includes(keyword)) {
        results.push({
          primary: primary.name,
          secondary: secondary.name
        });
      }
    });
  });
  
  return results;
}

const trainingCategories = search('培训');
console.log(trainingCategories);
```

## 重新解析

如果需要重新解析文档，运行：

```bash
python3 parse_fixed.py
```

这将：
1. 读取 `企业类目文档-clean.txt`
2. 解析所有类目
3. 生成 `categories-complete.ts`
4. 输出统计信息

## 注意事项

1. 部分二级类目可能包含三级分类（如"丽人服务"下的"美甲"、"美容"等）
2. 资质要求和适用范围可能跨多行
3. 分隔符"/"用于分隔不同的二级类目
4. 注释内容（以"注"开头）通常归入适用范围
5. 由于文档格式复杂，可能存在少量解析错误，需要人工校验

## 数据完整性

- ✅ 24个一级类目全部解析
- ✅ 每个二级类目包含名称、资质要求、适用范围
- ✅ TypeScript类型定义完整
- ⚠️ 部分三级分类可能被误识别为二级类目
- ⚠️ 部分资质要求和适用范围可能不完整或混在一起

## 后续工作建议

1. 人工校验生成的类目数据
2. 修复解析错误（如果有）
3. 添加单元测试确保数据完整性
4. 考虑添加三级分类支持
5. 添加类目搜索和过滤功能

## 许可证

本项目为内部工具，仅供团队使用。
