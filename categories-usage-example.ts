/**
 * 企业类目使用示例
 */

import { categories, PrimaryCategory, CategoryTemplate } from './categories-complete';

// 示例1: 遍历所有类目
function printAllCategories() {
  categories.forEach((primary: PrimaryCategory) => {
    console.log(`\n【${primary.name}】 - ${primary.children.length} 个二级类目`);
    
    primary.children.forEach((secondary: CategoryTemplate) => {
      console.log(`  • ${secondary.name}`);
      if (secondary.qualification) {
        console.log(`    资质: ${secondary.qualification.substring(0, 50)}...`);
      }
      if (secondary.scope) {
        console.log(`    范围: ${secondary.scope.substring(0, 50)}...`);
      }
    });
  });
}

// 示例2: 根据一级类目名称查找
function findPrimary(name: string): PrimaryCategory | undefined {
  return categories.find(cat => cat.name === name);
}

// 示例3: 根据二级类目名称查找
function findSecondary(name: string): { primary: string; secondary: CategoryTemplate } | undefined {
  for (const primary of categories) {
    const found = primary.children.find(sec => sec.name === name);
    if (found) {
      return { primary: primary.name, secondary: found };
    }
  }
  return undefined;
}

// 示例4: 搜索类目（支持模糊匹配）
function searchCategories(keyword: string) {
  const results: { primary: string; secondary: string }[] = [];
  
  categories.forEach(primary => {
    primary.children.forEach(secondary => {
      if (secondary.name.includes(keyword) || 
          secondary.qualification.includes(keyword) ||
          secondary.scope.includes(keyword)) {
        results.push({
          primary: primary.name,
          secondary: secondary.name
        });
      }
    });
  });
  
  return results;
}

// 示例5: 获取所有类目名称的扁平数组
function getAllCategoryNames(): string[] {
  const names: string[] = [];
  
  categories.forEach(primary => {
    primary.children.forEach(secondary => {
      names.push(`${primary.name} > ${secondary.name}`);
    });
  });
  
  return names;
}

// 使用示例
console.log('=== 企业类目使用示例 ===\n');

// 查找物流服务
const logistics = findPrimary('物流服务');
if (logistics) {
  console.log(`找到一级类目: ${logistics.name}`);
  console.log(`包含 ${logistics.children.length} 个二级类目`);
}

// 查找快递柜
const expressLocker = findSecondary('快递柜');
if (expressLocker) {
  console.log(`\n找到二级类目: ${expressLocker.secondary.name}`);
  console.log(`所属一级类目: ${expressLocker.primary}`);
  console.log(`资质要求: ${expressLocker.secondary.qualification}`);
  console.log(`适用范围: ${expressLocker.secondary.scope}`);
}

// 搜索包含"培训"的类目
const trainingCategories = searchCategories('培训');
console.log(`\n找到 ${trainingCategories.length} 个包含"培训"的类目:`);
trainingCategories.slice(0, 5).forEach(item => {
  console.log(`  - ${item.primary} > ${item.secondary}`);
});

// 统计信息
console.log('\n=== 统计信息 ===');
console.log(`总一级类目数: ${categories.length}`);
console.log(`总二级类目数: ${categories.reduce((sum, cat) => sum + cat.children.length, 0)}`);

export {
  printAllCategories,
  findPrimary,
  findSecondary,
  searchCategories,
  getAllCategoryNames
};
