# 项目架构说明

## 分层架构

项目采用经典的分层架构设计：

```
┌─────────────────────────────────┐
│     Controller (控制器层)        │  ← 处理 HTTP 请求
├─────────────────────────────────┤
│      Service (业务逻辑层)       │  ← 核心业务逻辑
├─────────────────────────────────┤
│    Entity / Repository (数据层) │  ← 数据库操作
└─────────────────────────────────┘
```

## 核心模块说明

### 1. 配置层 (src/config/)

| 文件 | 说明 |
|------|------|
| `config.default.ts` | 默认配置，其他环境继承此配置 |
| `config.local.ts` | 本地开发环境配置 |
| `config.sit.ts` | SIT 测试环境配置 |
| `config.prod.ts` | 生产环境配置 |
| `config.unittest.ts` | 单元测试配置 |

**配置优先级**: 对应环境配置 > 默认配置

### 2. 控制器层 (src/controller/)

负责处理 HTTP 请求，参数验证，调用 Service 层，返回响应。

#### 主要控制器：

- **auth.controller.ts** - 用户认证相关接口
  - 注册、登录、登出
  - 密码修改
  - 微信/手机绑定

- **record.controller.ts** - 记账记录管理
  - CRUD 操作
  - 分页查询
  - 月度汇总统计

- **category.controller.ts** - 分类管理
  - 系统分类
  - 用户自定义分类
  - 分类图标

- **user.controller.ts** - 用户个人信息
  - 个人资料
  - 用户自定义分类
  - 分类分组管理
  - 图标管理

- **ad.controller.ts** - 广告相关
  - 开屏广告

### 3. 业务逻辑层 (src/service/)

包含核心业务逻辑，处理事务，调用数据层。

| 服务 | 职责 |
|------|------|
| `auth.service.ts` | 认证逻辑，JWT 生成和验证 |
| `record.service.ts` | 记录业务，统计计算 |
| `category.service.ts` | 分类管理，用户自定义分类 |
| `user.service.ts` | 用户信息管理 |
| `ad.service.ts` | 广告数据管理 |
| `sms.service.ts` | 短信验证码发送 |

### 4. 数据实体层 (src/entity/)

数据库表映射，使用 TypeORM 装饰器定义。

#### 核心实体：

| 实体 | 表名 | 说明 |
|------|------|------|
| `User` | user | 用户表 |
| `Record` | record | 记账记录表 |
| `Category` | category | 分类表 |
| `CategoryGroup` | category_group | 分类分组表 |
| `Icon` | icon | 图标表 |
| `UserCategoryCustomization` | user_category_customization | 用户自定义分类 |
| `UserCategoryGroup` | user_category_group | 用户分类分组 |
| `UserIcon` | user_icon | 用户图标 |
| `Ad` | ad | 广告表 |
| `SmsCode` | sms_code | 短信验证码表 |

### 5. 中间件层 (src/middleware/)

| 中间件 | 功能 |
|--------|------|
| `jwt.middleware.ts` | JWT Token 验证，保护需要认证的接口 |
| `report.middleware.ts` | 请求报告，记录请求响应时间 |

### 6. 过滤器层 (src/filter/)

| 过滤器 | 功能 |
|--------|------|
| `default.filter.ts` | 全局异常处理，统一错误响应格式 |
| `notfound.filter.ts` | 404 处理 |

## 数据库关系图

```
User (用户表)
  ├─ 1:N → Record (记账记录)
  ├─ 1:N → UserCategoryCustomization (用户自定义分类)
  ├─ 1:N → UserCategoryGroup (用户分类分组)
  └─ 1:N → UserIcon (用户图标)

Category (分类表)
  ├─ N:1 → CategoryGroup (分类分组)
  ├─ N:1 → Icon (图标)
  └─ 1:N → Record (记账记录)

CategoryGroup (分类分组表)

Icon (图标表)

Ad (广告表)

SmsCode (短信验证码表)
```

## 认证流程

```
用户登录
   │
   ▼
验证用户名密码
   │
   ▼
生成 JWT Token
   │
   ▼
返回 Token
   │
   ▼
后续请求带上 Authorization: Bearer <token>
   │
   ▼
JWT 中间件验证 Token
   │
   ▼
通过验证 → 继续请求
失败 → 返回 401
```

## 请求处理流程

```
1. HTTP 请求到达
   ↓
2. Koa 中间件链
   ↓
3. ReportMiddleware (记录日志)
   ↓
4. JwtMiddleware (如需认证)
   ↓
5. Controller (参数验证)
   ↓
6. Service (业务逻辑)
   ↓
7. Repository (数据库操作)
   ↓
8. 返回响应
```

## 环境变量管理

使用 `dotenv` 加载 `.env` 文件中的环境变量，支持多环境配置。

环境变量可以覆盖配置文件中的默认值，敏感信息（密码、密钥）不应该提交到代码仓库。

## 开发规范

### 命名规范

- 控制器: `XxxController`
- 服务: `XxxService`
- 实体: `Xxx`
- 中间件: `XxxMiddleware`
- 过滤器: `XxxFilter`

### 路由规范

- RESTful 风格
- 资源名使用复数
- 路径使用 kebab-case

### 错误处理

- 使用过滤器统一处理异常
- 返回标准格式: `{ success: boolean, message: string, data?: any }`
- HTTP 状态码规范:
  - 200 - 成功
  - 400 - 客户端错误
  - 401 - 未授权
  - 403 - 禁止访问
  - 404 - 不存在
  - 500 - 服务器错误
