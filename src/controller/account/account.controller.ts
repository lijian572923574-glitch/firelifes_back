import { Controller, Get, Post, Put, Del, Inject, Body, Param } from '@midwayjs/core';
import type { Context } from '@midwayjs/koa';
import { AccountService } from '../../service/account.service';
import type { AccountRequest, AdjustBalanceRequest } from '../../service/account.service';
import { Account } from '../../entity/account.entity';

export interface IApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
}

@Controller('/api/accounts')
export class AccountController {
  @Inject()
  accountService: AccountService;

  @Inject()
  ctx: Context;

  /**
   * 获取账户列表
   */
  @Get('/')
  async getAccountList(): Promise<IApiResponse<Account[]>> {
    try {
      const userId = this.ctx.state.user?.userId;
      if (!userId) {
        return {
          success: false,
          message: '请先登录'
        };
      }

      const accounts = await this.accountService.getAccountsByUserId(userId);
      return {
        success: true,
        data: accounts
      };
    } catch (error) {
      return {
        success: false,
        message: (error as Error).message
      };
    }
  }

  /**
   * 获取账户详情
   */
  @Get('/:id')
  async getAccountDetail(@Param('id') id: string): Promise<IApiResponse<Account>> {
    try {
      const userId = this.ctx.state.user?.userId;
      if (!userId) {
        return {
          success: false,
          message: '请先登录'
        };
      }

      const account = await this.accountService.getAccountById(Number(id), userId);
      if (!account) {
        return {
          success: false,
          message: '账户不存在'
        };
      }

      return {
        success: true,
        data: account
      };
    } catch (error) {
      return {
        success: false,
        message: (error as Error).message
      };
    }
  }

  /**
   * 创建账户
   */
  @Post('/')
  async createAccount(@Body() data: AccountRequest): Promise<IApiResponse<Account>> {
    try {
      const userId = this.ctx.state.user?.userId;
      if (!userId) {
        return {
          success: false,
          message: '请先登录'
        };
      }

      // 验证必填字段
      if (!data.name || !data.icon || !data.type) {
        return {
          success: false,
          message: '请填写完整信息'
        };
      }

      const account = await this.accountService.createAccount(userId, data);
      return {
        success: true,
        data: account,
        message: '创建成功'
      };
    } catch (error) {
      return {
        success: false,
        message: (error as Error).message
      };
    }
  }

  /**
   * 更新账户
   */
  @Put('/:id')
  async updateAccount(
    @Param('id') id: string,
    @Body() data: AccountRequest
  ): Promise<IApiResponse<Account>> {
    try {
      const userId = this.ctx.state.user?.userId;
      if (!userId) {
        return {
          success: false,
          message: '请先登录'
        };
      }

      // 验证必填字段
      if (!data.name || !data.icon || !data.type) {
        return {
          success: false,
          message: '请填写完整信息'
        };
      }

      const account = await this.accountService.updateAccount(Number(id), userId, data);
      if (!account) {
        return {
          success: false,
          message: '账户不存在'
        };
      }

      return {
        success: true,
        data: account,
        message: '更新成功'
      };
    } catch (error) {
      return {
        success: false,
        message: (error as Error).message
      };
    }
  }

  /**
   * 删除账户
   */
  @Del('/:id')
  async deleteAccount(@Param('id') id: string): Promise<IApiResponse> {
    try {
      const userId = this.ctx.state.user?.userId;
      if (!userId) {
        return {
          success: false,
          message: '请先登录'
        };
      }

      const result = await this.accountService.deleteAccount(Number(id), userId);
      if (!result) {
        return {
          success: false,
          message: '账户不存在或默认账户不可删除'
        };
      }

      return {
        success: true,
        message: '删除成功'
      };
    } catch (error) {
      return {
        success: false,
        message: (error as Error).message
      };
    }
  }

  /**
   * 调整账户余额
   */
  @Post('/:id/adjust')
  async adjustBalance(
    @Param('id') id: string,
    @Body() data: AdjustBalanceRequest
  ): Promise<IApiResponse<any>> {
    try {
      const userId = this.ctx.state.user?.userId;
      if (!userId) {
        return {
          success: false,
          message: '请先登录'
        };
      }

      if (data.newBalance === undefined || data.newBalance === null) {
        return {
          success: false,
          message: '请输入新余额'
        };
      }

      const result = await this.accountService.adjustBalance(
        userId,
        Number(id),
        data
      );
      return {
        success: true,
        data: result,
        message: '调整成功'
      };
    } catch (error) {
      return {
        success: false,
        message: (error as Error).message
      };
    }
  }

  /**
   * 获取账户调整记录
   */
  @Get('/:id/adjustments')
  async getAdjustments(@Param('id') id: string): Promise<IApiResponse<any[]>> {
    try {
      const userId = this.ctx.state.user?.userId;
      if (!userId) {
        return {
          success: false,
          message: '请先登录'
        };
      }

      const adjustments = await this.accountService.getAdjustmentsByAccountId(
        userId,
        Number(id)
      );
      return {
        success: true,
        data: adjustments
      };
    } catch (error) {
      return {
        success: false,
        message: (error as Error).message
      };
    }
  }
}
