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
    if (path.startsWith('/category/') && !path.startsWith('/category/user')) return false;
    return true;
  }

  resolve() {
    return async (ctx: Context, next: NextFunction) => {
      const authHeader = ctx.headers['authorization'];

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        ctx.status = 401;
        ctx.body = {
          success: false,
          message: '未提供认证令牌',
        };
        return;
      }

      const token = authHeader.substring(7);

      try {
        const authService = await ctx.requestContext.getAsync(AuthService);
        const payload = authService.verifyToken(token);
        ctx.state.user = payload;
        await next();
      } catch (error) {
        ctx.status = 401;
        ctx.body = {
          success: false,
          message: '令牌无效或已过期',
        };
      }
    };
  }
}
