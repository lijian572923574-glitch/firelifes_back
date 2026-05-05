# 依赖升级 - Verification Checklist

- [x] 当前状态已备份（git 分支和文件备份）
- [x] 所有 @midwayjs/* 包已升级到 ^4.0.0 版本
- [x] @midwayjs/typeorm 保持 3.20.24 版本（与 4.x 兼容）
- [x] typeorm 依赖版本兼容
- [x] 其他有安全漏洞的包已处理
- [x] node_modules 和 package-lock.json 已清理并重新安装
- [x] npm install 成功完成，无依赖解析错误
- [x] npm run build 成功，无 TypeScript 错误
- [x] 框架正常加载，路由注册成功
- [x] npm audit 安全漏洞从 11 个减少到 6 个
