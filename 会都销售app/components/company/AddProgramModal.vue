<template>
  <view v-if="show" class="modal-overlay" @tap="handleClose">
    <view class="modal-content" @tap.stop>
      <view class="modal-header">
        <text class="modal-title">添加小程序</text>
        <view class="modal-close" @tap="handleClose">
          <text class="close-icon">×</text>
        </view>
      </view>

      <view class="modal-body">
        <!-- 使用新注册企业 -->
        <view
          class="option-item"
          :class="{ disabled: useRegisteredCompany }"
          @tap="selectNewCompany"
        >
          <view class="checkbox-wrapper">
            <view class="checkbox" :class="{ checked: useNewCompany }">
              <text v-if="useNewCompany" class="check-icon">✓</text>
            </view>
          </view>
          <text class="option-text" :class="{ disabled: useRegisteredCompany }">使用新注册企业</text>
        </view>

        <!-- 使用已注册企业 -->
        <view
          class="option-item"
          @tap="selectRegisteredCompany"
        >
          <view class="checkbox-wrapper">
            <view class="checkbox" :class="{ checked: useRegisteredCompany, disabled: !canUseRegistered }">
              <text v-if="useRegisteredCompany" class="check-icon">✓</text>
            </view>
          </view>
          <text class="option-text" :class="{ disabled: !canUseRegistered && !useRegisteredCompany }">使用已注册企业</text>
        </view>

        <!-- 已认证企业下拉列表 -->
        <view v-if="useRegisteredCompany" class="company-select-wrapper">
          <text class="select-label">选择企业</text>
          <picker
            mode="selector"
            :range="authenticatedCompanies"
            range-key="name"
            :value="internalSelectedIndex"
            @change="onCompanyChange"
          >
            <view class="picker-container" :class="{ placeholder: internalSelectedIndex === -1 }">
              <text class="picker-text">
                {{ internalSelectedIndex !== -1 ? authenticatedCompanies[internalSelectedIndex].name : '请选择已认证企业' }}
              </text>
              <text class="picker-arrow">▼</text>
            </view>
          </picker>
        </view>
      </view>

      <view class="modal-footer">
        <view class="footer-btn cancel-btn" @tap="handleCancel">
          <text class="btn-text">取消</text>
        </view>
        <view class="footer-btn confirm-btn" @tap="handleConfirm">
          <text class="btn-text">确定</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

// 已认证企业接口
export interface AuthenticatedCompany {
  id: string
  name: string
  type: string
  typeLabel: string
}

interface Props {
  show: boolean
  authenticatedCompanies: AuthenticatedCompany[]
}

const props = withDefaults(defineProps<Props>(), {
  show: false,
  authenticatedCompanies: () => []
})

const emit = defineEmits<{
  'update:show': [value: boolean]
  'confirm': [useNewCompany: boolean, companyIndex: number]
  'cancel': []
}>()

// 内部状态
const useNewCompany = ref(true)
const useRegisteredCompany = ref(false)
const internalSelectedIndex = ref(-1)

// 是否可以使用已注册企业（至少有一个已认证企业）
const canUseRegistered = computed(() => {
  return props.authenticatedCompanies.length > 0
})

// 监听弹窗显示/隐藏，重置状态
watch(() => props.show, (newVal) => {
  if (newVal) {
    // 打开弹窗时重置状态
    useNewCompany.value = true
    useRegisteredCompany.value = false
    internalSelectedIndex.value = -1
  }
})

// 选择使用新注册企业
const selectNewCompany = () => {
  useNewCompany.value = true
  useRegisteredCompany.value = false
  internalSelectedIndex.value = -1
}

// 选择使用已注册企业
const selectRegisteredCompany = () => {
  if (canUseRegistered.value) {
    useRegisteredCompany.value = true
    useNewCompany.value = false
  }
}

// 企业选择变化
const onCompanyChange = (e: any) => {
  internalSelectedIndex.value = e.detail.value
}

// 关闭弹窗
const handleClose = () => {
  emit('update:show', false)
}

// 取消按钮
const handleCancel = () => {
  emit('cancel')
  emit('update:show', false)
}

// 确认按钮
const handleConfirm = () => {
  if (useRegisteredCompany.value) {
    // 验证是否选择了企业
    if (internalSelectedIndex.value === -1) {
      uni.showModal({
        title: '提示',
        content: '必须使用已认证过的企业，否则请返回注册新企业',
        showCancel: false
      })
      return
    }
  }

  // 触发确认事件，传递选择结果
  emit('confirm', useNewCompany.value, internalSelectedIndex.value)
  emit('update:show', false)
}
</script>

<style scoped lang="scss">
// 弹窗遮罩
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

// 弹窗内容
.modal-content {
  width: 600rpx;
  background: #fff;
  border-radius: 24rpx;
  overflow: hidden;
}

// 弹窗头部
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30rpx;
  border-bottom: 1rpx solid #f0f0f0;

  .modal-title {
    font-size: 32rpx;
    font-weight: 600;
    color: #333;
  }

  .modal-close {
    width: 60rpx;
    height: 60rpx;
    display: flex;
    align-items: center;
    justify-content: center;

    .close-icon {
      font-size: 48rpx;
      color: #999;
      font-weight: 300;
      line-height: 1;
    }

    &:active {
      opacity: 0.7;
    }
  }
}

// 弹窗主体
.modal-body {
  padding: 30rpx;
}

// 选项项
.option-item {
  display: flex;
  align-items: center;
  padding: 24rpx 0;

  &.disabled {
    opacity: 0.5;
    pointer-events: none;
  }

  .checkbox-wrapper {
    margin-right: 20rpx;
  }

  .checkbox {
    width: 44rpx;
    height: 44rpx;
    border: 3rpx solid #ddd;
    border-radius: 8rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s;

    &.checked {
      background: #667eea;
      border-color: #667eea;
    }

    &.disabled {
      background: #f5f5f5;
      border-color: #e0e0e0;
    }

    .check-icon {
      font-size: 28rpx;
      color: #fff;
      font-weight: bold;
      line-height: 1;
    }
  }

  .option-text {
    font-size: 28rpx;
    color: #333;

    &.disabled {
      color: #999;
    }
  }

  &:active {
    background: #f5f5f5;
    border-radius: 12rpx;
  }
}

// 企业下拉选择器
.company-select-wrapper {
  margin-top: 30rpx;
  padding: 20rpx;
  background: #f8f8f8;
  border-radius: 12rpx;

  .select-label {
    font-size: 26rpx;
    color: #666;
    margin-bottom: 16rpx;
    display: block;
  }

  .picker-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20rpx;
    background: #fff;
    border-radius: 8rpx;
    border: 1rpx solid #e0e0e0;

    &.placeholder {
      .picker-text {
        color: #999;
      }
    }

    .picker-text {
      font-size: 28rpx;
      color: #333;
      flex: 1;
    }

    .picker-arrow {
      font-size: 20rpx;
      color: #999;
    }
  }
}

// 弹窗底部
.modal-footer {
  display: flex;
  gap: 20rpx;
  padding: 20rpx 30rpx 30rpx;
  border-top: 1rpx solid #f0f0f0;

  .footer-btn {
    flex: 1;
    height: 80rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 12rpx;
    font-size: 28rpx;

    &.cancel-btn {
      background: #f5f5f5;
      color: #666;

      &:active {
        opacity: 0.7;
      }
    }

    &.confirm-btn {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: #fff;

      &:active {
        opacity: 0.8;
      }
    }

    .btn-text {
      font-size: 28rpx;
      font-weight: 500;
    }
  }
}
</style>
