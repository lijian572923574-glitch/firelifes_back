# FireLifes Backend

基于 Midway.js 的生活记账后端服务

## 功能说明

### 核心功能

- **用户认证** - 注册、登录、密码修改、微信/手机绑定
- **记账记录** - 收支记录的增删改查
- **分类管理** - 系统预设分类 + 用户自定义分类
- **分类分组** - 分类分组管理
- **图标管理** - 分类图标选择
- **广告展示** - 开屏广告
- **数据统计** - 月度汇总

### 技术特性

- **JWT 认证** - 无状态 Token 验证
- **TypeORM + PostgreSQL** - ORM + 关系型数据库
- **Midway.js 4.x** - 企业级 Node.js 框架
- **多环境配置** - local/sit/prod 三套环境

## 目录结构

```
firelifes_back/
├── src/
│   ├── config/                  # 配置文件
│   │   ├── config.default.ts    # 默认配置
│   │   ├── config.local.ts      # 本地开发环境配置
│   │   ├── config.sit.ts        # SIT 测试环境配置
│   │   ├── config.prod.ts       # 生产环境配置
│   │   └── config.unittest.ts   # 单元测试配置
│   ├── controller/              # 控制器层
│   │   ├── auth/
│   │   │   └── auth.controller.ts    # 用户认证相关接口
│   │   ├── category/
│   │   │   └── category.controller.ts # 分类管理接口
│   │   ├── record/
│   │   │   └── record.controller.ts   # 记账记录接口
│   │   ├── user/
│   │   │   └── user.controller.ts     # 用户个人信息接口
│   │   ├── ad.controller.ts       # 广告接口
│   │   ├── api.controller.ts      # API 通用接口
│   │   └── home.controller.ts     # 首页接口
│   ├── entity/                  # 数据库实体
│   │   ├── user.entity.ts        # 用户表
│   │   ├── record.entity.ts      # 记账记录表
│   │   ├── category.entity.ts    # 分类表
│   │   ├── category_group.entity.ts # 分类分组表
│   │   ├── icon.entity.ts        # 图标表
│   │   ├── user_category_customization.entity.ts # 用户自定义分类
│   │   ├── user_category_group.entity.ts # 用户分类分组
│   │   ├── user_icon.entity.ts   # 用户图标
│   │   ├── ad.entity.ts          # 广告表
│   │   └── sms_code.entity.ts    # 短信验证码表
│   ├── service/                 # 业务逻辑层
│   │   ├── auth.service.ts       # 认证服务
│   │   ├── record.service.ts     # 记录服务
│   │   ├── category.service.ts   # 分类服务
│   │   ├── user.service.ts       # 用户服务
│   │   ├── ad.service.ts         # 广告服务
│   │   └── sms.service.ts        # 短信服务
│   ├── middleware/              # 中间件
│   │   ├── jwt.middleware.ts     # JWT 验证中间件
│   │   └── report.middleware.ts  # 请求报告中间件
│   ├── filter/                  # 过滤器
│   │   ├── default.filter.ts     # 默认异常过滤器
│   │   └── notfound.filter.ts    # 404 过滤器
│   ├── configuration.ts         # Midway 配置
│   └── interface.ts             # 类型定义
├── test/                        # 测试文件
│   └── controller/
│       ├── api.test.ts
│       └── home.test.ts
├── .env.example                 # 环境变量示例
├── package.json                 # 项目依赖
├── tsconfig.json                # TypeScript 配置
├── jest.config.js               # Jest 测试配置
├── bootstrap.js                 # 启动文件
└── init-db.ts                   # 数据库初始化脚本
```

## 快速入门

### 环境要求

- Node.js >= 20
- PostgreSQL 数据库

### 本地开发

1. 复制环境变量文件
```bash
cp .env.example .env
```

2. 配置数据库连接信息，编辑 `.env` 文件

3. 安装依赖
```bash
npm install
```

4. 启动开发服务
```bash
npm run dev
```

5. 访问 http://localhost:7001/

### 部署

#### SIT 环境
```bash
npm run start:sit
```

#### 生产环境
```bash
npm run start:prod
```

## 环境变量说明

| 变量名 | 说明 | 默认值 |
|-------|------|-------|
| `DB_HOST` | 数据库主机 | localhost |
| `DB_PORT` | 数据库端口 | 5432 |
| `DB_USERNAME` | 数据库用户名 | - |
| `DB_PASSWORD` | 数据库密码 | - |
| `DB_NAME` | 数据库名 | firelifes |
| `JWT_SECRET` | JWT 密钥 | - |
| `TENCENT_SMS_APP_ID` | 腾讯云短信 AppID | - |
| `TENCENT_SMS_APP_KEY` | 腾讯云短信 AppKey | - |
| `TENCENT_SMS_SIGN` | 腾讯云短信签名 | - |
| `TENCENT_SMS_TEMPLATE` | 腾讯云短信模板 ID | - |

## 内置指令

| 命令 | 说明 |
|------|------|
| `npm run dev` | 本地开发模式（watch） |
| `npm run start` | 启动生产环境 |
| `npm run start:sit` | 启动 SIT 环境 |
| `npm run start:prod` | 启动生产环境 |
| `npm run build` | 编译 TypeScript |
| `npm test` | 运行单元测试 |
| `npm run cov` | 生成测试覆盖率报告 |
| `npm run lint` | 代码风格检查 |
| `npm run lint:fix` | 自动修复代码风格问题 |

## API 接口说明

### 认证接口 (auth)
- `POST /auth/send-sms` - 发送短信验证码
- `POST /auth/register` - 用户注册
- `POST /auth/login` - 用户登录
- `POST /auth/logout` - 用户登出
- `POST /auth/bind-wechat` - 绑定微信
- `POST /auth/bind-phone` - 绑定手机
- `POST /auth/change-password` - 修改密码
- `GET /auth/me` - 获取当前用户信息

### 记账接口 (record)
- `POST /record` - 创建记录
- `GET /record` - 获取所有记录
- `GET /record/:id` - 获取单条记录
- `PUT /record/:id` - 更新记录
- `DELETE /record/:id` - 删除记录
- `GET /record/page` - 分页查询（按月份）
- `GET /record/month-summary` - 月度汇总

### 分类接口 (category)
- `GET /category` - 获取所有分类
- `GET /category/:type` - 按类型获取分类
- `GET /category/user/:type` - 获取用户自定义分类
- `GET /category/icons/all` - 获取所有图标

### 用户接口 (user)
- `GET /user/profile` - 获取个人信息
- `PUT /user/profile` - 更新个人信息
- `GET /user/customizations` - 获取用户自定义分类
- `POST /user/customizations` - 添加自定义分类
- `PUT /user/customizations/:categoryId` - 更新自定义分类
- `DELETE /user/customizations/:id` - 删除自定义分类
- `POST /user/customizations/:categoryId/enable` - 启用分类
- `POST /user/customizations/:categoryId/disable` - 禁用分类
- `GET /user/groups` - 获取分类分组
- `POST /user/groups` - 添加分组
- `DELETE /user/groups/:id` - 删除分组
- `GET /user/icons` - 获取用户图标
- `POST /user/icons` - 添加用户图标

### 广告接口 (ad)
- `GET /ads/splash` - 获取开屏广告

### 通用接口 (api)
- `GET /api/get_user` - 获取用户信息（测试用）

### 首页接口
- `GET /` - 首页

## 技术栈

- **框架**: Midway.js 4.x
- **语言**: TypeScript
- **ORM**: TypeORM
- **数据库**: PostgreSQL
- **测试框架**: Jest
- **代码规范**: ESLint + Prettier

## 相关链接

- [Midway.js 官方文档](https://midwayjs.org)
- [TypeORM 官方文档](https://typeorm.io)
