/**
 * 资质检查相关 API
 */

import apiAdapter from './adapter'

/**
 * 资质检查响应
 */
export interface QualificationCheckResponse {
  hasQualification: boolean
  missingQualifications?: string[]
  message?: string
}

/**
 * 资质检查请求参数
 */
export interface QualificationCheckParams {
  firstLevel: string
  secondLevel: string
  templateName: string
}

/**
 * 资质相关 API
 */
export const qualificationApi = {
  /**
   * 检查用户是否具备所需资质
   */
  checkQualification(
    params: QualificationCheckParams
  ): Promise<QualificationCheckResponse> {
    return apiAdapter.post<QualificationCheckResponse>(
      '/api/qualification/check',
      params
    )
  },

  /**
   * 获取用户已上传的资质列表
   */
  getUserQualifications(): Promise<any[]> {
    return apiAdapter.get<any[]>('/api/qualification/user')
  }
}
