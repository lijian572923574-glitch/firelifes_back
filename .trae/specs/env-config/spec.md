# 环境配置 - Product Requirement Document

## Overview
- **Summary**: 为项目配置三个独立运行环境（本地、SIT、生产），通过不同的启动/打包命令加载对应的环境变量和配置
- **Purpose**: 解决多环境部署问题，确保不同环境使用正确的配置，避免环境混淆
- **Target Users**: 开发团队、运维人员

## Goals
- 配置本地开发环境（local）
- 配置 SIT 测试环境（sit，访问 sit.firelifes.com）
- 配置生产环境（prod，访问 prod.firelifes.com）
- 通过不同的 npm scripts 区分和启动各环境
- 统一使用 dotenv 和 MidwayJS 配置文件管理环境变量

## Non-Goals (Out of Scope)
- 不修改现有业务逻辑代码
- 不添加新的功能特性
- 不重构现有代码架构

## Background & Context
- 项目使用 MidwayJS 4.x 框架
- 当前已使用 dotenv 管理环境变量
- 已有 config.default.ts 配置文件
- 需要支持三个环境的区分配置

## Functional Requirements
- **FR-1**: 创建三个环境的配置文件（config.local.ts、config.sit.ts、config.prod.ts）
- **FR-2**: 在 package.json 中添加对应环境的启动/打包脚本
- **FR-3**: 创建 .env 示例文件，说明各环境变量用途

## Non-Functional Requirements
- **NFR-1**: 环境切换通过 npm scripts 完成，简单易用
- **NFR-2**: 配置文件遵循 MidwayJS 现有规范
- **NFR-3**: 敏感信息（密码、密钥等）通过环境变量配置，不提交到代码库

## Constraints
- **Technical**: MidwayJS 4.x, TypeScript, dotenv
- **Business**: 需要支持 sit.firelifes.com 和 prod.firelifes.com 两个域名环境
- **Dependencies**: 依赖 dotenv 包（已安装）

## Assumptions
- 各环境的数据库配置、JWT 密钥、短信配置等会通过环境变量传入
- 本地环境继续使用现有的默认配置
- SIT 和生产环境会有独立的数据库和服务配置

## Acceptance Criteria

### AC-1: 本地环境配置
- **Given**: 开发环境
- **When**: 运行 npm run dev
- **Then**: 使用本地配置（config.local.ts），端口、数据库等配置正确加载
- **Verification**: programmatic

### AC-2: SIT 环境配置
- **Given**: SIT 测试环境
- **When**: 运行 npm run start:sit
- **Then**: 使用 SIT 配置（config.sit.ts），对应 sit.firelifes.com 环境
- **Verification**: programmatic

### AC-3: 生产环境配置
- **Given**: 生产环境
- **When**: 运行 npm run start:prod
- **Then**: 使用生产配置（config.prod.ts），对应 prod.firelifes.com 环境
- **Verification**: programmatic

### AC-4: .env 示例文件
- **Given**: 项目根目录
- **When**: 查看 .env.example 文件
- **Then**: 包含所有环境变量说明和示例
- **Verification**: human-judgment

### AC-5: package.json 脚本
- **Given**: package.json
- **When**: 查看 scripts 字段
- **Then**: 包含 dev、start:sit、start:prod 等完整脚本
- **Verification**: programmatic

## Open Questions
- 暂无
