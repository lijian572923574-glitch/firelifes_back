import { Middleware, IMiddleware } from '@midwayjs/core';
import { Context, NextFunction } from '@midwayjs/koa';
import { AuthService } from '../service/auth.service';

@Middleware()
export class JwtMiddleware implements IMiddleware<Context, NextFunction> {
  match(ctx: Context) {
    const path = ctx.path;
    const method = ctx.method;

    if (method === 'OPTIONS') return false;

    const publicPaths = ['/auth/login', '/auth/register', '/auth/send-sms', '/health', '/', '/ads/splash'];
    const isPublic = publicPaths.some(p => path === p || path.startsWith(p + '/'));
    if (isPublic) return false;
    if (path.startsWith('/api/category/') && !path.startsWith('/api/category/user')) return false;
    return true;
  }

  resolve() {
    return async (ctx: Context, next: NextFunction) => {
      console.log('[JWT Middleware] 请求路径:', ctx.path);
      console.log('[JWT Middleware] 请求头:', ctx.headers);
      
      const authHeader = ctx.headers['authorization'];

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.log('[JWT Middleware] 未找到Authorization header');
        ctx.status = 401;
        ctx.body = {
          success: false,
          message: '未提供认证令牌',
        };
        return;
      }

      const token = authHeader.substring(7);
      console.log('[JWT Middleware] 提取的token:', token.substring(0, 20) + '...');

      try {
        const authService = await ctx.requestContext.getAsync(AuthService);
        const payload = authService.verifyToken(token);
        console.log('[JWT Middleware] 验证成功，payload:', payload);
        ctx.state.user = payload;
        await next();
      } catch (error) {
        console.log('[JWT Middleware] 验证失败:', error);
        ctx.status = 401;
        ctx.body = {
          success: false,
          message: '令牌无效或已过期',
        };
      }
    };
  }
}
