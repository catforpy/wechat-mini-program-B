/**
 * 模板中心相关类型定义
 */

// 用户角色类型
export type UserRole = 'agent' | 'merchant' | 'admin'

// 模板基础信息
export interface TemplateBaseInfo {
  id: number
  name: string
  category: string
  price: number
  rating: number
  tags: string[]
  agentName: string
  agentId: number
  updatedAt: string
}

// Banner内容
export interface BannerContent {
  type: 'image' | 'video'
  url: string
  thumbnail?: string
  title?: string
}

// 模块内容类型
export interface ModuleContent {
  type: 'image' | 'video' | 'text' | 'feature-list'
  url?: string
  text?: string
  title?: string
  thumbnail?: string
  features?: string[]
  isPlaying?: boolean
}

// 展示模块
export interface TemplateModule {
  id: string
  title: string
  icon: string
  expanded: boolean
  contents: ModuleContent[]
}

// 模板详情数据
export interface TemplateDetail {
  baseInfo: TemplateBaseInfo
  banner: BannerContent[]
  modules: TemplateModule[]
}

// 模板列表项（简化版）
export interface TemplateListItem {
  id: number
  name: string
  category: string
  price: number
  rating: number
  thumbnail: string
  tags: string[]
  agentName?: string
}
