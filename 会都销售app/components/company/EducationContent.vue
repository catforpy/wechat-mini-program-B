<template>
  <view class="education-content">
    <!-- 师资力量 -->
    <view class="content-section">
      <view class="section-title">
        <text class="title-text">👨‍🏫 师资力量</text>
        <view class="title-line"></view>
      </view>

      <view class="teachers-stats">
        <view class="stat-item">
          <text class="stat-value">{{ formatNumber(educationInfo?.teachers?.totalTeachers || 0) }}</text>
          <text class="stat-label">教师总数</text>
        </view>
        <view class="stat-item">
          <text class="stat-value">{{ formatNumber(educationInfo?.teachers?.seniorTeachers || 0) }}</text>
          <text class="stat-label">高级教师</text>
        </view>
        <view class="stat-item">
          <text class="stat-value">{{ formatNumber(educationInfo?.teachers?.foreignTeachers || 0) }}</text>
          <text class="stat-label">外教</text>
        </view>
      </view>

      <view class="teachers-card">
        <scroll-view class="teacher-scroll" scroll-x show-scrollbar>
          <view class="teacher-item" v-for="(teacher, index) in educationInfo?.teachers?.famousTeachers" :key="index">
            <image :src="teacher.photo" mode="aspectFill" class="teacher-photo" />
            <text class="teacher-name">{{ teacher.name }}</text>
            <text class="teacher-title">{{ teacher.title }}</text>
            <text class="teacher-subject">{{ teacher.subject }}</text>
            <text class="teacher-exp">{{ teacher.experience }}年经验</text>
          </view>
        </scroll-view>
      </view>
    </view>

    <!-- 课程体系 -->
    <view class="content-section">
      <view class="section-title">
        <text class="title-text">📚 课程体系</text>
        <view class="title-line"></view>
      </view>

      <view class="courses-card">
        <view class="course-category" v-for="(category, index) in educationInfo?.courses?.categories" :key="index">
          <view class="category-header">
            <text class="category-name">{{ category.name }}</text>
          </view>
          <scroll-view class="course-scroll" scroll-x show-scrollbar>
            <view class="course-item" v-for="(course, courseIndex) in category.courses" :key="courseIndex">
              <image :src="course.image" mode="aspectFill" class="course-image" />
              <text class="course-name">{{ course.name }}</text>
              <text class="course-intro">{{ course.intro }}</text>
              <text class="course-price">¥{{ course.price }}</text>
              <text class="course-students">{{ course.students }}人已学</text>
            </view>
          </scroll-view>
        </view>
      </view>
    </view>

    <!-- 热门课程 -->
    <view class="content-section">
      <view class="section-title">
        <text class="title-text">🔥 热门课程</text>
        <view class="title-line"></view>
      </view>

      <view class="hot-courses-card">
        <view class="hot-course-item" v-for="(course, index) in educationInfo?.courses?.hotCourses" :key="index">
          <image :src="course.image" mode="aspectFill" class="hot-course-image" />
          <view class="hot-course-info">
            <text class="hot-course-name">{{ course.name }}</text>
            <text class="hot-course-intro">{{ course.intro }}</text>
            <view class="hot-course-meta">
              <text class="hot-course-sessions">{{ course.sessions }}课时</text>
              <text class="hot-course-students">{{ course.students }}人</text>
              <view class="hot-course-rating">
                <text class="rating">{{ course.rating }}</text>
                <text class="rating-label">分</text>
              </view>
            </view>
            <text class="hot-course-price">¥{{ course.price }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 学员风采 -->
    <view class="content-section">
      <view class="section-title">
        <text class="title-text">🏆 学员风采</text>
        <view class="title-line"></view>
      </view>

      <view class="students-card">
        <view class="student-item" v-for="(student, index) in educationInfo?.students" :key="index">
          <image :src="student.photo" mode="aspectFill" class="student-photo" />
          <view class="student-info">
            <text class="student-name">{{ student.name }}</text>
            <text class="student-course">{{ student.course }}</text>
            <text class="student-result">{{ student.result }}</text>
            <text class="student-achievement">{{ student.achievement }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 教学环境 -->
    <view class="content-section">
      <view class="section-title">
        <text class="title-text">🏫 教学环境</text>
        <view class="title-line"></view>
      </view>

      <view class="environment-card">
        <view class="campus-stats">
          <text class="campus-count">{{ educationInfo?.environment?.campusCount }}个校区</text>
        </view>

        <view class="facilities-list">
          <view class="facility-item" v-for="(facility, index) in educationInfo?.environment?.facilities" :key="index">
            <text class="facility-name">{{ facility.name }}</text>
            <text class="facility-desc">{{ facility.desc }}</text>
            <scroll-view class="facility-images" scroll-x show-scrollbar>
              <image v-for="(img, imgIndex) in facility.images" :key="imgIndex" :src="img" mode="aspectFill" class="facility-image" />
            </scroll-view>
          </view>
        </view>
      </view>
    </view>

    <!-- 教学特色 -->
    <view class="content-section">
      <view class="section-title">
        <text class="title-text">✨ 教学特色</text>
        <view class="title-line"></view>
      </view>

      <view class="features-card">
        <view class="feature-item" v-for="(feature, index) in educationInfo?.features" :key="index">
          <text class="feature-icon">{{ feature.icon }}</text>
          <view class="feature-info">
            <text class="feature-title">{{ feature.title }}</text>
            <text class="feature-desc">{{ feature.desc }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 招生信息 -->
    <view class="content-section">
      <view class="section-title">
        <text class="title-text">📝 招生信息</text>
        <view class="title-line"></view>
      </view>

      <view class="enrollment-card">
        <view class="enrollment-info">
          <view class="info-item">
            <text class="info-label">招生对象</text>
            <text class="info-value">{{ educationInfo?.enrollment?.target }}</text>
          </view>
          <view class="info-item">
            <text class="info-label">招生名额</text>
            <text class="info-value">{{ educationInfo?.enrollment?.quota }}人</text>
          </view>
        </view>

        <view class="class-types">
          <text class="class-title">班型设置</text>
          <view class="class-item" v-for="(classType, index) in educationInfo?.enrollment?.classTypes" :key="index">
            <text class="class-type">{{ classType.type }}</text>
            <text class="class-students">{{ classType.students }}人/班</text>
            <text class="class-time">{{ classType.time }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
interface Props {
  educationInfo?: any
}

defineProps<Props>()

// 格式化数字
const formatNumber = (num: number) => {
  if (!num) return '0'
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + '万'
  }
  return num.toString()
}
</script>

<style scoped lang="scss">
.education-content {
  padding-bottom: 20rpx;
}

.content-section {
  margin-bottom: 20rpx;
}

.section-title {
  padding: 30rpx 20rpx 20rpx;

  .title-text {
    font-size: 36rpx;
    font-weight: 600;
    color: #333;
  }

  .title-line {
    width: 60rpx;
    height: 6rpx;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 3rpx;
    margin-top: 16rpx;
  }
}

.teachers-stats {
  display: flex;
  justify-content: space-around;
  padding: 30rpx 20rpx;
  background: #fff;

  .stat-item {
    text-align: center;

    .stat-value {
      display: block;
      font-size: 36rpx;
      font-weight: 600;
      color: #667eea;
      margin-bottom: 8rpx;
    }

    .stat-label {
      font-size: 24rpx;
      color: #999;
    }
  }
}

.teachers-card,
.courses-card,
.hot-courses-card,
.students-card,
.environment-card,
.features-card,
.enrollment-card {
  margin: 0 20rpx;
  background: #fff;
  border-radius: 20rpx;
  padding: 30rpx;
  margin-top: -10rpx;
}

// 教师列表
.teacher-scroll {
  white-space: nowrap;

  .teacher-item {
    display: inline-block;
    width: 200rpx;
    margin-right: 20rpx;
    text-align: center;

    &:last-child {
      margin-right: 0;
    }

    .teacher-photo {
      width: 120rpx;
      height: 120rpx;
      border-radius: 50%;
      margin-bottom: 12rpx;
    }

    .teacher-name {
      display: block;
      font-size: 26rpx;
      font-weight: 600;
      color: #333;
      margin-bottom: 8rpx;
    }

    .teacher-title {
      display: block;
      font-size: 22rpx;
      color: #667eea;
      margin-bottom: 4rpx;
    }

    .teacher-subject {
      display: block;
      font-size: 22rpx;
      color: #999;
      margin-bottom: 4rpx;
    }

    .teacher-exp {
      font-size: 22rpx;
      color: #999;
    }
  }
}

// 课程分类
.course-category {
  margin-bottom: 30rpx;

  &:last-child {
    margin-bottom: 0;
  }

  .category-header {
    margin-bottom: 20rpx;

    .category-name {
      font-size: 28rpx;
      font-weight: 600;
      color: #667eea;
    }
  }

  .course-scroll {
    white-space: nowrap;

    .course-item {
      display: inline-block;
      width: 200rpx;
      margin-right: 20rpx;
      text-align: center;

      &:last-child {
        margin-right: 0;
      }

      .course-image {
        width: 200rpx;
        height: 150rpx;
        border-radius: 12rpx;
        margin-bottom: 12rpx;
      }

      .course-name {
        display: block;
        font-size: 26rpx;
        font-weight: 600;
        color: #333;
        margin-bottom: 8rpx;
      }

      .course-intro {
        display: block;
        font-size: 22rpx;
        color: #999;
        margin-bottom: 8rpx;
      }

      .course-price {
        display: block;
        font-size: 28rpx;
        font-weight: 600;
        color: #ff5252;
        margin-bottom: 4rpx;
      }

      .course-students {
        font-size: 22rpx;
        color: #999;
      }
    }
  }
}

// 热门课程
.hot-course-item {
  display: flex;
  padding: 20rpx;
  background: #f8f9fa;
  border-radius: 12rpx;
  margin-bottom: 16rpx;

  &:last-child {
    margin-bottom: 0;
  }

  .hot-course-image {
    width: 200rpx;
    height: 150rpx;
    border-radius: 12rpx;
    margin-right: 20rpx;
    flex-shrink: 0;
  }

  .hot-course-info {
    flex: 1;
    display: flex;
    flex-direction: column;

    .hot-course-name {
      font-size: 28rpx;
      font-weight: 600;
      color: #333;
      margin-bottom: 8rpx;
    }

    .hot-course-intro {
      font-size: 24rpx;
      color: #999;
      margin-bottom: 12rpx;
    }

    .hot-course-meta {
      display: flex;
      gap: 16rpx;
      margin-bottom: 12rpx;

      .hot-course-sessions,
      .hot-course-students {
        font-size: 22rpx;
        color: #999;
      }

      .hot-course-rating {
        display: flex;
        align-items: center;
        margin-left: auto;

        .rating {
          font-size: 28rpx;
          font-weight: 600;
          color: #FFB800;
        }

        .rating-label {
          font-size: 22rpx;
          color: #999;
        }
      }
    }

    .hot-course-price {
      font-size: 32rpx;
      font-weight: 600;
      color: #ff5252;
      margin-top: auto;
    }
  }
}

// 学员风采
.student-item {
  display: flex;
  align-items: center;
  padding: 20rpx;
  background: #f8f9fa;
  border-radius: 12rpx;
  margin-bottom: 16rpx;

  &:last-child {
    margin-bottom: 0;
  }

  .student-photo {
    width: 80rpx;
    height: 80rpx;
    border-radius: 50%;
    margin-right: 20rpx;
  }

  .student-info {
    flex: 1;

    .student-name {
      display: block;
      font-size: 28rpx;
      font-weight: 600;
      color: #333;
      margin-bottom: 8rpx;
    }

    .student-course {
      display: block;
      font-size: 24rpx;
      color: #667eea;
      margin-bottom: 4rpx;
    }

    .student-result {
      display: block;
      font-size: 22rpx;
      color: #999;
      margin-bottom: 4rpx;
    }

    .student-achievement {
      font-size: 22rpx;
      color: #FFB800;
    }
  }
}

// 教学环境
.campus-stats {
  text-align: center;
  margin-bottom: 30rpx;

  .campus-count {
    font-size: 28rpx;
    color: #667eea;
    font-weight: 600;
  }
}

.facilities-list {
  .facility-item {
    margin-bottom: 30rpx;

    &:last-child {
      margin-bottom: 0;
    }

    .facility-name {
      display: block;
      font-size: 28rpx;
      font-weight: 600;
      color: #333;
      margin-bottom: 8rpx;
    }

    .facility-desc {
      display: block;
      font-size: 24rpx;
      color: #999;
      margin-bottom: 16rpx;
    }

    .facility-images {
      white-space: nowrap;

      .facility-image {
        display: inline-block;
        width: 200rpx;
        height: 150rpx;
        border-radius: 12rpx;
        margin-right: 16rpx;

        &:last-child {
          margin-right: 0;
        }
      }
    }
  }
}

// 教学特色
.feature-item {
  display: flex;
  align-items: center;
  padding: 20rpx;
  background: #f8f9fa;
  border-radius: 12rpx;
  margin-bottom: 16rpx;

  &:last-child {
    margin-bottom: 0;
  }

  .feature-icon {
    font-size: 48rpx;
    margin-right: 20rpx;
  }

  .feature-info {
    flex: 1;

    .feature-title {
      display: block;
      font-size: 28rpx;
      font-weight: 600;
      color: #333;
      margin-bottom: 8rpx;
    }

    .feature-desc {
      font-size: 24rpx;
      color: #999;
    }
  }
}

// 招生信息
.enrollment-info {
  display: flex;
  justify-content: space-around;
  margin-bottom: 30rpx;

  .info-item {
    text-align: center;

    .info-label {
      display: block;
      font-size: 24rpx;
      color: #999;
      margin-bottom: 8rpx;
    }

    .info-value {
      font-size: 28rpx;
      font-weight: 600;
      color: #667eea;
    }
  }
}

.class-types {
  .class-title {
    display: block;
    font-size: 28rpx;
    font-weight: 600;
    color: #333;
    margin-bottom: 20rpx;
  }

  .class-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20rpx;
    background: #f8f9fa;
    border-radius: 12rpx;
    margin-bottom: 12rpx;

    &:last-child {
      margin-bottom: 0;
    }

    .class-type {
      font-size: 26rpx;
      font-weight: 600;
      color: #333;
    }

    .class-students {
      font-size: 24rpx;
      color: #667eea;
    }

    .class-time {
      font-size: 24rpx;
      color: #999;
    }
  }
}
</style>
