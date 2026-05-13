# API 文档

## 通用说明

### 认证方式

所有需要登录的接口必须在请求头中携带 JWT Token：

```
Authorization: Bearer <token>
```

### 响应格式

所有接口统一返回以下格式：

```json
{
  "success": boolean,
  "message": "提示信息",
  "data": {}
}
```

- `success`: 请求是否成功
- `message`: 提示信息
- `data`: 返回数据（可选）

### 公开接口（不需要认证）

| 路径 | 说明 |
|------|------|
| `/` | 首页 |
| `/health` | 健康检查 |
| `/auth/login` | 登录 |
| `/auth/register` | 注册 |
| `/auth/send-sms` | 发送验证码 |
| `/ads/splash` | 开屏广告 |
| `/api/category/` | 获取所有分类 |
| `/api/category/:type` | 按类型获取分类 |
| `/api/category/icons/all` | 获取所有图标 |

### 需要认证的接口

所有以下接口都需要登录（JWT 认证）：

- `/auth/logout`
- `/auth/me`
- `/auth/bind-wechat`
- `/auth/bind-phone`
- `/auth/change-password`
- `/user/*`
- `/api/accounts/*`
- `/record/*`
- `/api/category/user/*`
- `/api/category/group/*`

---

## 1. 认证接口 (/auth)

### 1.1 发送验证码

```
POST /auth/send-sms
```

请求体：
```json
{
  "phone": "手机号",
  "type": "register|login|bind"
}
```

响应：
```json
{
  "success": true,
  "message": "验证码已发送",
  "data": {
    "code": "验证码（开发环境直接返回）"
  }
}
```

### 1.2 注册

```
POST /auth/register
```

请求体：
```json
{
  "phone": "手机号",
  "code": "验证码",
  "password": "密码",
  "nickname": "昵称（可选）"
}
```

响应：
```json
{
  "success": true,
  "message": "注册成功",
  "data": {
    "token": "JWT Token",
    "user": {
      "id": 1,
      "username": "用户名",
      "phone": "手机号",
      "nickname": "昵称",
      "avatarUrl": "头像地址"
    }
  }
}
```

### 1.3 登录

```
POST /auth/login
```

请求体（支持多种登录方式）：
```json
{
  "username": "用户名（可选）",
  "phone": "手机号（可选）",
  "password": "密码（可选）",
  "code": "验证码（可选）",
  "wechatCode": "微信授权码（可选）",
  "wechatInfo": {
    "unionid": "微信unionid（可选）",
    "nickname": "微信昵称（可选）",
    "avatarUrl": "微信头像（可选）"
  }
}
```

响应：
```json
{
  "success": true,
  "message": "登录成功",
  "data": {
    "token": "JWT Token",
    "user": {
      "id": 1,
      "username": "用户名",
      "phone": "手机号",
      "nickname": "昵称",
      "avatarUrl": "头像地址"
    }
  }
}
```

### 1.4 退出登录

```
POST /auth/logout
```

（需要认证）

响应：
```json
{
  "success": true,
  "message": "退出成功"
}
```

### 1.5 获取当前用户信息

```
GET /auth/me
```

（需要认证）

响应：
```json
{
  "success": true,
  "data": {
    "id": 1,
    "username": "用户名",
    "phone": "手机号",
    "nickname": "昵称",
    "avatarUrl": "头像地址",
    "wechatUnionid": "微信unionid",
    "createdAt": "创建时间"
  }
}
```

### 1.6 绑定微信

```
POST /auth/bind-wechat
```

（需要认证）

请求体：
```json
{
  "wechatCode": "微信授权码",
  "wechatInfo": {
    "unionid": "微信unionid（可选）",
    "nickname": "微信昵称（可选）",
    "avatarUrl": "微信头像（可选）"
  }
}
```

### 1.7 绑定手机号

```
POST /auth/bind-phone
```

（需要认证）

请求体：
```json
{
  "phone": "手机号",
  "code": "验证码"
}
```

### 1.8 修改密码

```
POST /auth/change-password
```

（需要认证）

请求体：
```json
{
  "oldPassword": "旧密码",
  "newPassword": "新密码"
}
```

---

## 2. 用户接口 (/user)

### 2.1 获取用户资料

```
GET /user/profile
```

（需要认证）

响应：
```json
{
  "success": true,
  "data": {
    "id": 1,
    "username": "用户名",
    "nickname": "昵称",
    "avatarUrl": "头像地址",
    "phone": "手机号"
  }
}
```

### 2.2 更新用户资料

```
PUT /user/profile
```

（需要认证）

请求体：
```json
{
  "nickname": "昵称（可选）",
  "avatarUrl": "头像地址（可选）"
}
```

### 2.3 获取用户自定义分类

```
GET /user/customizations
```

（需要认证）

### 2.4 更新用户自定义分类

```
PUT /user/customizations/:categoryId
```

（需要认证）

请求体：
```json
{
  "name": "名称（可选）",
  "iconId": 图标ID（可选）,
  "isEnabled": true/false（可选）,
  "sortOrder": 排序（可选）
}
```

### 2.5 添加用户自定义分类

```
POST /user/customizations
```

（需要认证）

请求体：
```json
{
  "name": "分类名称",
  "iconId": 图标ID,
  "groupId": 分组ID,
  "type": "income|expense",
  "sortOrder": 排序（可选）
}
```

### 2.6 删除用户自定义分类

```
DELETE /user/customizations/:id
```

（需要认证）

### 2.7 启用分类

```
POST /user/customizations/:categoryId/enable
```

（需要认证）

### 2.8 禁用分类

```
POST /user/customizations/:categoryId/disable
```

（需要认证）

### 2.9 获取用户分组

```
GET /user/groups
```

（需要认证）

### 2.10 添加用户分组

```
POST /user/groups
```

（需要认证）

请求体：
```json
{
  "name": "分组名称",
  "sortOrder": 排序（可选）
}
```

### 2.11 删除用户分组

```
DELETE /user/groups/:id
```

（需要认证）

### 2.12 获取用户图标

```
GET /user/icons
```

（需要认证）

### 2.13 添加用户图标

```
POST /user/icons
```

（需要认证）

请求体：
```json
{
  "name": "图标名称",
  "url": "图标地址",
  "iconType": "emoji|image（可选）",
  "sortOrder": 排序（可选）
}
```

---

## 3. 分类接口 (/api/category)

### 3.1 获取所有分类（公开）

```
GET /api/category/
```

响应：
```json
{
  "success": true,
  "message": "获取成功",
  "data": {
    "expense": [分组列表],
    "income": [分组列表]
  }
}
```

### 3.2 按类型获取分类（公开）

```
GET /api/category/:type
```

参数：
- `type`: `income` 或 `expense`

### 3.3 获取所有图标（公开）

```
GET /api/category/icons/all
```

### 3.4 获取用户分类（需要认证）

```
GET /api/category/user/:type
```

（需要认证）

参数：
- `type`: `income` 或 `expense`

### 3.5 获取用户分组（需要认证）

```
GET /api/category/user/groups/all
```

（需要认证）

### 3.6 创建用户分组（需要认证）

```
POST /api/category/user/groups
```

（需要认证）

请求体：
```json
{
  "name": "分组名称"
}
```

### 3.7 更新用户分组（需要认证）

```
PUT /api/category/user/groups/:id
```

（需要认证）

请求体：
```json
{
  "name": "分组名称"
}
```

### 3.8 删除用户分组（需要认证）

```
DELETE /api/category/user/groups/:id
```

（需要认证）

### 3.9 获取指定分组下的分类（需要认证）

```
GET /api/category/group/:groupId
```

（需要认证）

参数：
- `groupId`: 分组ID

### 3.10 创建子分类（需要认证）

```
POST /api/category/user
```

（需要认证）

请求体：
```json
{
  "name": "分类名称",
  "groupId": 分组ID,
  "iconId": 图标ID,
  "type": "income|expense"
}
```

### 3.11 更新子分类（需要认证）

```
PUT /api/category/user/:id
```

（需要认证）

请求体：
```json
{
  "name": "分类名称",
  "iconId": 图标ID
}
```

### 3.12 删除子分类（需要认证）

```
DELETE /api/category/user/:id
```

（需要认证）

---

## 4. 账户接口 (/api/accounts)

### 4.1 获取账户列表

```
GET /api/accounts/
```

（需要认证）

### 4.2 获取账户详情

```
GET /api/accounts/:id
```

（需要认证）

### 4.3 创建账户

```
POST /api/accounts/
```

（需要认证）

请求体：
```json
{
  "name": "账户名称",
  "icon": "图标",
  "type": "账户类型",
  "balance": 余额（可选）,
  "color": "颜色（可选）",
  "isDefault": true/false（可选）
}
```

### 4.4 更新账户

```
PUT /api/accounts/:id
```

（需要认证）

请求体同创建账户。

### 4.5 删除账户

```
DELETE /api/accounts/:id
```

（需要认证）

---

## 5. 记账接口 (/record)

### 5.1 创建记录

```
POST /record/
```

（需要认证）

请求体：
```json
{
  "type": "income|expense|transfer",
  "amount": 金额,
  "categoryId": 分类ID,
  "accountId": 账户ID,
  "date": "日期",
  "remark": "备注（可选）",
  "tags": ["标签列表（可选）"]
}
```

### 5.2 获取记录列表（分页）

```
GET /record/page?yearMonth=YYYY-MM&page=1&pageSize=50
```

（需要认证）

查询参数：
- `yearMonth`: 年月（格式：YYYY-MM）
- `page`: 页码（默认1）
- `pageSize`: 每页条数（默认50）

### 5.3 获取月度汇总

```
GET /record/month-summary?yearMonth=YYYY-MM
```

（需要认证）

查询参数：
- `yearMonth`: 年月（格式：YYYY-MM）

### 5.4 获取所有记录

```
GET /record/
```

（需要认证）

### 5.5 获取单条记录详情

```
GET /record/:id
```

### 5.6 更新记录

```
PUT /record/:id
```

（需要认证）

请求体同创建记录。

### 5.7 删除记录

```
DELETE /record/:id
```

（需要认证）

---

## 6. 广告接口 (/ads)

### 6.1 获取开屏广告

```
GET /ads/splash
```

响应：
```json
{
  "success": true,
  "data": {
    "id": 广告ID,
    "imageUrl": "图片地址",
    "linkUrl": "跳转链接",
    "duration": 展示时长
  }
}
```

---

## 7. 其他接口

### 7.1 首页

```
GET /
```

响应：`Hello Midwayjs!`

### 7.2 获取用户信息（调试用）

```
GET /api/get_user?uid=用户ID
```

---

## 重要提示

### 添加新接口时的检查清单

1. **确定接口是否需要认证**
   - 如果需要 userId，必须认证
   - 更新 `jwt.middleware.ts` 的 `match` 方法
   - 需要认证的路径：
     - `/auth/logout`
     - `/auth/me`
     - `/auth/bind-*`
     - `/auth/change-password`
     - `/user/*`
     - `/api/accounts/*`
     - `/record/*`
     - `/api/category/user/*`
     - `/api/category/group/*`

2. **JWT 中间件匹配规则**
   - 公开路径：`/auth/login`, `/auth/register`, `/auth/send-sms`, `/health`, `/`, `/ads/splash`
   - 公开的分类路径：`/api/category/` 但排除 `/api/category/user/` 和 `/api/category/group/`
   - 其他都需要认证

3. **Controller 中检查 userId**
   ```typescript
   const userId = this.ctx.state.user?.userId;
   if (!userId) {
     return { success: false, message: '请先登录' };
   }
   ```
