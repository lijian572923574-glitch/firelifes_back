# 环境配置 - Verification Checklist

- [x] config.local.ts 文件创建成功
- [x] config.sit.ts 文件创建成功
- [x] config.prod.ts 文件创建成功
- [x] package.json 包含 dev 脚本，设置 NODE_ENV=local 和 MIDWAY_SERVER_ENV=local
- [x] package.json 包含 start:sit 脚本，设置 NODE_ENV=production 和 MIDWAY_SERVER_ENV=sit
- [x] package.json 包含 start:prod 脚本，设置 NODE_ENV=production 和 MIDWAY_SERVER_ENV=prod
- [x] .env.example 文件创建成功，包含所有必需的环境变量
- [x] .gitignore 包含 .env
