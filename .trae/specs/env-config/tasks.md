# 环境配置 - The Implementation Plan (Decomposed and Prioritized Task List)

## [ ] Task 1: 创建三个环境的 MidwayJS 配置文件
- **Priority**: P0
- **Depends On**: None
- **Description**: 
  - 在 src/config/ 目录下创建 config.local.ts
  - 在 src/config/ 目录下创建 config.sit.ts
  - 在 src/config/ 目录下创建 config.prod.ts
  - 每个配置文件根据环境需要配置端口、数据库、JWT、短信等
- **Acceptance Criteria Addressed**: AC-1, AC-2, AC-3
- **Test Requirements**:
  - `programmatic` TR-1.1: config.local.ts 文件存在，配置正确
  - `programmatic` TR-1.2: config.sit.ts 文件存在，配置正确
  - `programmatic` TR-1.3: config.prod.ts 文件存在，配置正确
- **Notes**: 各配置文件应继承或覆盖 config.default.ts 中的配置

## [ ] Task 2: 更新 package.json 脚本
- **Priority**: P0
- **Depends On**: Task 1
- **Description**: 
  - 修改现有 scripts，确保 dev 使用 local 环境
  - 添加 start:sit 脚本，使用 sit 环境
  - 添加 start:prod 脚本，使用 prod 环境
  - 确保所有脚本正确设置 NODE_ENV
- **Acceptance Criteria Addressed**: AC-1, AC-2, AC-3, AC-5
- **Test Requirements**:
  - `programmatic` TR-2.1: package.json 包含 dev 脚本，NODE_ENV=local
  - `programmatic` TR-2.2: package.json 包含 start:sit 脚本，NODE_ENV=sit
  - `programmatic` TR-2.3: package.json 包含 start:prod 脚本，NODE_ENV=prod
  - `programmatic` TR-2.4: 保留 build、test 等现有脚本
- **Notes**: 使用 cross-env 设置环境变量

## [ ] Task 3: 创建 .env.example 文件
- **Priority**: P0
- **Depends On**: None
- **Description**: 
  - 在项目根目录创建 .env.example
  - 列出所有需要的环境变量
  - 添加说明注释和示例值
- **Acceptance Criteria Addressed**: AC-4
- **Test Requirements**:
  - `human-judgement` TR-3.1: .env.example 文件存在，包含完整的环境变量说明
- **Notes**: 环境变量包括：DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_NAME, JWT_SECRET, TENCENT_SMS_APP_ID, TENCENT_SMS_APP_KEY, TENCENT_SMS_SIGN, TENCENT_SMS_TEMPLATE

## [ ] Task 4: 更新 .gitignore（如需要）
- **Priority**: P1
- **Depends On**: Task 3
- **Description**: 
  - 确保 .env 文件已在 .gitignore 中
  - 避免敏感配置被提交
- **Acceptance Criteria Addressed**: NFR-3
- **Test Requirements**:
  - `programmatic` TR-4.1: .gitignore 包含 .env
- **Notes**: 如果已包含则无需修改
