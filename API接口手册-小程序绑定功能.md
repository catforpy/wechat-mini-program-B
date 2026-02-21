# API 接口手册 - 小程序绑定功能

> 本手册提供微信开放平台相关 API 的快速查询，包含接口名称、功能说明和基本参数。

**最后更新时间**：2026-02-06

---

## 📚 目录

- [一、开放平台账号管理](#一开放平台账号管理)
- [二、代商家注册小程序](#二代商家注册小程序)
- [三、试用小程序管理](#三试用小程序管理)
- [四、后端接口设计](#四后端接口设计)
- [五、调用凭证说明](#五调用凭证说明)

---

## 一、开放平台账号管理

### 1. 创建开放平台账号

**接口名称**：`createOpenAccount`

**功能说明**：创建新的开放平台账号，并将一个未绑定的公众号/小程序自动绑定到该账号

**请求方式**：
```
POST https://api.weixin.qq.com/cgi-bin/open/create
```

**关键参数**：
- `appid` - 公众号/小程序的 appid

**权限集**：24-25

**使用场景**：
- ✅ 商家有一个未绑定开放平台的小程序
- ✅ 需要创建新的开放平台账号并自动绑定

**返回**：
```json
{
  "open_appid": "开放平台appid",
  "errcode": 0,
  "errmsg": "ok"
}
```

---

### 2. 绑定开放平台账号

**接口名称**：`bindOpenAccount`

**功能说明**：将小程序绑定到已有的开放平台账号

**请求方式**：
```
POST https://api.weixin.qq.com/cgi-bin/open/bind
```

**关键参数**：
- `open_appid` - 开放平台账号的 appid
- `appid` - 要绑定的小程序 appid

**权限集**：24-25

**使用场景**：
- ✅ 商家已有开放平台账号
- ✅ 需要将新小程序绑定到该账号
- ✅ 实现账号统一管理，数据互通

**注意**：小程序必须与开放平台账号是同一主体

---

### 3. 解除绑定开放平台账号

**接口名称**：`unbindOpenAccount`

**功能说明**：将小程序从开放平台账号解绑

**请求方式**：
```
POST https://api.weixin.qq.com/cgi-bin/open/unbind
```

**关键参数**：
- `open_appid` - 开放平台账号的 appid
- `appid` - 要解绑的小程序 appid

**权限集**：24-25

**使用场景**：
- ✅ 商家需要更换开放平台账号
- ✅ 准备解绑后重新绑定到其他账号

---

### 4. 获取开放平台账号

**接口名称**：`getOpenAccount`

**功能说明**：查询小程序绑定的开放平台账号信息

**请求方式**：
```
POST https://api.weixin.qq.com/cgi-bin/open/get
```

**关键参数**：
- `appid` - 小程序的 appid

**权限集**：24-25

**使用场景**：
- ✅ 查询小程序是否已绑定开放平台
- ✅ 获取绑定的开放平台账号 ID

**返回**：
```json
{
  "open_appid": "开放平台appid",
  "errcode": 0,
  "errmsg": "ok"
}
```

---

## 二、代商家注册小程序

### 1. 快速注册企业小程序 ⭐

**接口名称**：`registerMiniprogram`

**功能说明**：通过企业信息快速创建小程序账号

**请求方式**：
```
POST https://api.weixin.qq.com/cgi-bin/account/registerminiprogram
```

**关键参数**：
- `action` - "create" 创建 / "search" 查询
- `name` - 企业名称（需与工商信息一致）
- `code` - 企业代码
- `code_type` - 代码类型（1-统一社会信用代码 2-组织机构代码 3-营业执照注册号）
- `legal_persona_wechat` - 法人微信号
- `legal_persona_name` - 法人姓名
- `component_phone` - 第三方联系电话（可选）

**限制**：每个微信号每天只能调用 5 次

**使用场景**：
- ✅ 企业商家需要快速创建小程序
- ✅ 有完整的营业执照和企业信息

**注意**：
- 默认为未认证状态，需要单独申请认证
- 会向法人微信号发送模板消息进行确认
- 任务串行执行，需等待前一个任务完成

---

### 2. 复用公众号主体注册小程序 ⭐

**接口名称**：`registerMiniprogramByOffiaccount`

**功能说明**：复用已认证公众号的主体信息快速创建小程序

**请求方式**：
```
POST https://api.weixin.qq.com/cgi-bin/account/fastregister
```

**关键参数**：
- `ticket` - 公众号扫码授权凭证

**权限集**：27

**使用场景**：
- ✅ 商家已有认证公众号
- ✅ 希望复用公众号主体快速创建小程序
- ✅ 自动关联公众号和小程序

**返回**：
```json
{
  "appid": "新小程序appid",
  "authorization_code": "授权码",
  "is_wx_verify_succ": true,
  "is_link_succ": true
}
```

**优势**：
- 流程简单，只需公众号扫码授权
- 自动关联公众号
- 复用认证信息（但默认仍为未认证状态）

---

### 3. 快速注册个人小程序

**接口名称**：`fastRegisterPersonalMp`

**功能说明**：为个人用户快速注册小程序

**请求方式**：
```
POST https://api.weixin.qq.com/cgi-bin/account/fastregisterpersonalapp
```

**关键参数**：
- `idname` - 个人用户名字
- `wxuser` - 个人用户微信号
- `component_phone` - 第三方联系电话（可选）

**限制**：
- 每分钟 5 次
- 每天 100 次

**使用场景**：
- ✅ 个人开发者需要创建小程序
- ✅ 个体创作者

**注意**：
- 注册的小程序不可绑定微信支付商户号
- 默认未认证，不影响发布但无法被搜索/分享

**任务状态**：
- 0-生成任务 → 12-创建成功
- 包含人脸识别和手机验证流程

---

## 三、试用小程序管理

### 1. 注册试用小程序

**接口名称**：`registerBetaMiniprogram`

**功能说明**：快速创建试用小程序，适用于体验和测试

**请求方式**：
```
POST https://api.weixin.qq.com/wxa/registerbetaweapp
```

**关键参数**：
- `name` - 小程序名称（4-30字符，自动添加"的体验小程序"后缀）
- `openid` - 微信用户 openid（将成为小程序管理员）

**使用场景**：
- ✅ 快速体验小程序功能
- ✅ 开发测试环境
- ✅ 演示场景

**返回**：
```json
{
  "unique_id": "唯一标识符",
  "authorize_url": "用户授权URL"
}
```

**注意**：
- 需要用户扫码授权
- quota 与个人小程序共用（同一微信号最多 5 个）
- 需要转正才能成为正式小程序

---

### 2. 试用小程序快速转正

**接口名称**：`verfifyBetaMiniprogram`

**功能说明**：通过企业法人认证将试用小程序转为正式企业小程序

**请求方式**：
```
POST https://api.weixin.qq.com/cgi-bin/account/verifybetaweapp
```

**关键参数**：
- `verify_info.enterprise_name` - 企业名称
- `verify_info.code` - 企业代码
- `verify_info.code_type` - 代码类型
- `verify_info.legal_persona_wechat` - 法人微信号
- `verify_info.legal_persona_name` - 法人姓名
- `verify_info.legal_persona_idcard` - 法人身份证号
- `verify_info.component_phone` - 第三方联系电话

**权限集**：81

**限制**：
- 每分钟 5 次
- 每天 100 次

**使用场景**：
- ✅ 试用小程序满意后转为正式版
- ✅ 通过企业认证获得完整功能

**流程**：
1. 调用接口下发模板消息
2. 法人收到消息，进行人脸识别
3. 法人通过后，管理员确认转正
4. 转正成功

**注意**：
- 转正后不会自动去除"的试用小程序"后缀
- 需要调用「设置名称」接口重新设置名称
- 只支持企业和个体户，不支持个人和境外主体

---

### 3. 修改试用小程序名称

**接口名称**：`modifyBetaMiniprogramNickName`

**功能说明**：修改试用小程序的名称

**请求方式**：
```
POST https://api.weixin.qq.com/wxa/setbetaweappnickname
```

**关键参数**：
- `name` - 新名称（自动添加"的体验小程序"后缀）

**权限集**：81

**使用场景**：
- ✅ 试用小程序创建后需要改名
- ✅ 避免品牌关键字先用临时名称

**注意**：
- 仅适用于试用小程序
- 转正后不能调用，需要用普通小程序改名接口

---

## 四、后端接口设计

### 4.1 开放平台管理

| 后端接口 | 对应微信 API | 功能说明 |
|---------|-------------|---------|
| `POST /api/open-platform/create` | createOpenAccount | 创建开放平台账号并绑定 |
| `POST /api/open-platform/bind` | bindOpenAccount | 绑定小程序到开放平台 |
| `POST /api/open-platform/unbind` | unbindOpenAccount | 解绑小程序 |
| `GET /api/open-platform/info` | getOpenAccount | 查询绑定信息 |

### 4.2 小程序注册

| 后端接口 | 对应微信 API | 功能说明 |
|---------|-------------|---------|
| `POST /api/miniprogram/register/enterprise` | registerMiniprogram | 注册企业小程序 |
| `POST /api/miniprogram/register/by-account` | registerMiniprogramByOffiaccount | 复用公众号注册 |
| `POST /api/miniprogram/register/personal` | fastRegisterPersonalMp | 注册个人小程序 |
| `POST /api/miniprogram/register/trial` | registerBetaMiniprogram | 注册试用小程序 |

### 4.3 试用小程序管理

| 后端接口 | 对应微信 API | 功能说明 |
|---------|-------------|---------|
| `POST /api/miniprogram/trial/verify` | verfifyBetaMiniprogram | 试用转正 |
| `POST /api/miniprogram/trial/rename` | modifyBetaMiniprogramNickName | 修改试用小程序名称 |

### 4.4 其他功能接口

| 后端接口 | 功能说明 |
|---------|---------|
| `GET /api/task/status` | 查询注册任务状态 |
| `POST /api/webhook/wechat` | 接收微信推送的事件 |
| `GET /api/token/component` | 获取第三方平台 token |
| `GET /api/token/authorizer` | 获取授权账号 token |

---

## 五、调用凭证说明

### 5.1 component_access_token

**说明**：第三方平台调用凭证

**获取方式**：通过第三方平台的 AppID 和 AppSecret 获取

**使用场景**：
- 第三方平台自己调用的接口
- 不代商家调用时使用

**相关接口**：
- 创建开放平台账号
- 快速注册企业小程序
- 快速注册个人小程序
- 注册试用小程序

### 5.2 authorizer_access_token

**说明**：授权账号调用凭证（代商家调用）

**获取方式**：
1. 先获取 component_access_token
2. 通过授权码换取 authorizer_refresh_token
3. 通过 refresh_token 换取 authorizer_access_token

**使用场景**：
- 代商家调用的接口
- 需要操作商家小程序时使用

**相关接口**：
- 复用公众号主体注册
- 试用小程序转正
- 修改试用小程序名称

---

## 六、常见问题

### Q1: 各种注册方式有什么区别？

| 注册方式 | 主体要求 | 优势 | 限制 |
|---------|---------|------|------|
| 企业注册 | 企业/个体工商户 | 完整功能，可开通支付 | 需要企业证件，法人验证 |
| 复用公众号注册 | 需有已认证公众号 | 流程简单，自动关联 | 需要已有公众号 |
| 个人注册 | 个人 | 简单快速 | 不可绑定支付 |
| 试用小程序 | 任意 | 快速体验，无证件要求 | 需转正才可用，功能受限 |

### Q2: 注册后的小程序默认是什么状态？

自 2023年12月25日起，所有新注册的小程序默认为**未认证状态**。
- 未认证不影响发布上架
- 未认证无法被搜索、分享
- 需要通过「代认证小程序接口」申请认证

### Q3: 试用小程序和普通小程序有什么区别？

| 特性 | 试用小程序 | 普通小程序 |
|-----|----------|----------|
| 创建难度 | 简单（只需 openid） | 复杂（需要企业证件） |
| 功能限制 | 有 | 无 |
| quota | 与个人共用（5个） | 独立 |
| 是否需要转正 | 是 | 否 |
| 名称后缀 | "的体验小程序" | 无 |

### Q4: 调用频率限制如何？

| 接口类型 | 频率限制 |
|---------|---------|
| 企业注册 | 每微信号每天 5 次 |
| 个人注册 | 每分钟 5 次，每天 100 次 |
| 试用转正 | 每分钟 5 次，每天 100 次 |

### Q5: 如何处理任务状态？

注册流程通常是异步的，需要：
1. 保存返回的 `task_id`
2. 通过查询接口轮询任务状态
3. 或配置 Webhook 接收微信推送
4. 根据状态码判断任务结果

---

## 七、完整 API 列表速查

### 开放平台账号管理（4个）

| 序号 | 接口英文名 | 接口中文名 | 权限集 |
|-----|----------|----------|-------|
| 1 | createOpenAccount | 创建开放平台账号 | 24-25 |
| 2 | bindOpenAccount | 绑定开放平台账号 | 24-25 |
| 3 | unbindOpenAccount | 解除绑定开放平台账号 | 24-25 |
| 4 | getOpenAccount | 获取开放平台账号 | 24-25 |

### 代商家注册小程序（6个）

| 序号 | 接口英文名 | 接口中文名 | 权限集 |
|-----|----------|----------|-------|
| 1 | registerMiniprogram | 快速注册企业小程序 | - |
| 2 | registerMiniprogramByOffiaccount | 复用公众号主体注册小程序 | 27 |
| 3 | fastRegisterPersonalMp | 快速注册个人小程序 | - |
| 4 | registerBetaMiniprogram | 注册试用小程序 | - |
| 5 | verfifyBetaMiniprogram | 试用小程序快速转正 | 81 |
| 6 | modifyBetaMiniprogramNickName | 修改试用小程序名称 | 81 |

---

## 八、开发检查清单

### 准备工作

- [ ] 第三方平台已全网发布
- [ ] 已获取必需的权限集（24-25, 27, 81）
- [ ] 已配置授权事件接收 URL
- [ ] 已获取 component_access_token

### 功能实现

- [ ] 实现小程序查询功能
- [ ] 实现试用小程序注册
- [ ] 实现企业小程序注册
- [ ] 实现复用公众号注册
- [ ] 实现任务状态查询
- [ ] 实现 Webhook 事件处理
- [ ] 实现试用小程序转正

### 测试验证

- [ ] 测试试用小程序注册流程
- [ ] 测试企业小程序注册流程
- [ ] 测试任务状态查询
- [ ] 测试事件推送接收
- [ ] 测试错误处理和异常情况

---

**文档维护**：
- 当微信 API 更新时，请及时更新本文档
- 发现问题或有改进建议，请联系开发团队

**相关文档**：
- [微信开放平台完整 API 文档](./微信开放平台API文档-小程序注册与账号管理.md)
- [错误解决文档 - 菜单高亮与展开问题](./错误解决文档-菜单高亮与展开问题.md)
