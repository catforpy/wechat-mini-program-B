const fs = require('fs');

// Read the TypeScript file
const content = fs.readFileSync('./data/categories-by-entity.ts', 'utf8');

// Count first-level categories for each entity type
const companyMatch = content.match(/export const companyCategories.*?\[/s);
const personalMatch = content.match(/export const personalCategories.*?\[/s);
const overseasMatch = content.match(/export const overseasCategories.*?\[/s);

// Count the number of { name: '...' } blocks for each type
function countCategories(content, startMarker, endMarker) {
  const startIdx = content.indexOf(startMarker);
  const endIdx = content.indexOf(endMarker, startIdx);
  const section = content.substring(startIdx, endIdx);
  
  // Count top-level category objects (they have "name:" at the start of a line with specific indentation)
  const matches = section.match(/^\s{2}\{\s*$\n\s{4}name:/gm);
  return matches ? matches.length : 0;
}

const companyCount = content.substring(
  content.indexOf("export const companyCategories"),
  content.indexOf("// ==================== 2. 个人主体类目")
).match(/^\s{2}\{$/gm) || [];

const personalCount = content.substring(
  content.indexOf("export const personalCategories"),
  content.indexOf("// ==================== 3. 境外主体类目")
).match(/^\s{2}\{$/gm) || [];

const overseasCount = content.substring(
  content.indexOf("export const overseasCategories"),
  content.indexOf("// ==================== 导出所有主体类型的数据")
).match(/^\s{2}\{$/gm) || [];

console.log('企业主体类目数量:', companyCount.length);
console.log('个人主体类目数量:', personalCount.length);
console.log('境外主体类目数量:', overseasCount.length);
console.log('总计:', companyCount.length + personalCount.length + overseasCount.length);
