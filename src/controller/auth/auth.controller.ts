import { Controller, Post, Body, Get, Inject } from '@midwayjs/core';
import type { Context } from '@midwayjs/koa';
import { AuthService } from '../../service/auth.service';
import { SmsService } from '../../service/sms.service';
import { SmsCodeType } from '../../entity/sms_code.entity';

export interface IApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
}

@Controller('/auth')
export class AuthController {
  @Inject()
  authService: AuthService;

  @Inject()
  smsService: SmsService;

  @Inject()
  ctx: Context;

  @Post('/send-sms')
  async sendSms(@Body() body: {
    phone: string;
    type: SmsCodeType;
  }): Promise<IApiResponse> {
    try {
      const code = await this.smsService.sendCode(body.phone, body.type);
      console.log(`\n========== 短信验证码 ==========`);
      console.log(`📱 手机号: ${body.phone}`);
      console.log(`🔢 验证码: ${code}`);
      console.log(`==========================================\n`);
      return {
        success: true,
        message: '验证码已发送',
        data: { code },
      };
    } catch (error) {
      return {
        success: false,
        message: (error as Error).message,
      };
    }
  }

  @Post('/register')
  async register(@Body() body: {
    phone: string;
    code: string;
    password: string;
    nickname?: string;
  }): Promise<IApiResponse> {
    try {
      const result = await this.authService.register(body);
      return {
        success: true,
        data: result,
        message: '注册成功',
      };
    } catch (error) {
      return {
        success: false,
        message: (error as Error).message,
      };
    }
  }

  @Post('/login')
  async login(@Body() body: {
    username?: string;
    phone?: string;
    password?: string;
    code?: string;
    wechatCode?: string;
    wechatInfo?: { unionid?: string; nickname?: string; avatarUrl?: string };
  }): Promise<IApiResponse> {
    try {
      const result = await this.authService.login({
        username: body.username,
        phone: body.phone,
        password: body.password,
        code: body.code,
        wechatCode: body.wechatCode,
        wechatInfo: body.wechatInfo,
      });
      return {
        success: true,
        data: result,
        message: '登录成功',
      };
    } catch (error) {
      return {
        success: false,
        message: (error as Error).message,
      };
    }
  }

  @Post('/logout')
  async logout(): Promise<IApiResponse> {
    try {
      const userId = this.ctx.state.user?.userId;
      if (userId) {
        await this.authService.logout(userId);
      }
      return {
        success: true,
        message: '退出成功',
      };
    } catch (error) {
      return {
        success: false,
        message: (error as Error).message,
      };
    }
  }

  @Post('/bind-wechat')
  async bindWechat(@Body() body: {
    wechatCode: string;
    wechatInfo?: { unionid?: string; nickname?: string; avatarUrl?: string };
  }): Promise<IApiResponse> {
    try {
      const userId = this.ctx.state.user?.userId;
      if (!userId) {
        return {
          success: false,
          message: '请先登录',
        };
      }

      const result = await this.authService.bindWechat(userId, body.wechatCode, body.wechatInfo);
      return {
        success: true,
        data: result,
        message: '微信绑定成功',
      };
    } catch (error) {
      return {
        success: false,
        message: (error as Error).message,
      };
    }
  }

  @Post('/bind-phone')
  async bindPhone(@Body() body: {
    phone: string;
    code: string;
  }): Promise<IApiResponse> {
    try {
      const userId = this.ctx.state.user?.userId;
      if (!userId) {
        return {
          success: false,
          message: '请先登录',
        };
      }

      const result = await this.authService.bindPhone(userId, body.phone, body.code);
      return {
        success: true,
        data: result,
        message: '手机号绑定成功',
      };
    } catch (error) {
      return {
        success: false,
        message: (error as Error).message,
      };
    }
  }

  @Post('/change-password')
  async changePassword(@Body() body: {
    oldPassword: string;
    newPassword: string;
  }): Promise<IApiResponse> {
    try {
      const userId = this.ctx.state.user?.userId;
      if (!userId) {
        return {
          success: false,
          message: '请先登录',
        };
      }

      await this.authService.changePassword(userId, body.oldPassword, body.newPassword);
      return {
        success: true,
        message: '密码修改成功',
      };
    } catch (error) {
      return {
        success: false,
        message: (error as Error).message,
      };
    }
  }

  @Get('/me')
  async getCurrentUser(): Promise<IApiResponse> {
    try {
      const userId = this.ctx.state.user?.userId;
      if (!userId) {
        return {
          success: false,
          message: '请先登录',
        };
      }

      const user = await this.authService.getUserById(userId);
      if (!user) {
        return {
          success: false,
          message: '用户不存在',
        };
      }

      return {
        success: true,
        data: {
          id: user.id,
          username: user.username,
          phone: user.phone,
          nickname: user.nickname,
          avatarUrl: user.avatarUrl,
          wechatUnionid: user.wechatUnionid,
          createdAt: user.createdAt,
        },
      };
    } catch (error) {
      return {
        success: false,
        message: (error as Error).message,
      };
    }
  }
}
