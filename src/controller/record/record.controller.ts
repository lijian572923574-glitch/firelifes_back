import { Inject, Controller, Post, Body, Put, Param, Get, Del, Query } from '@midwayjs/core';
import type { Context } from '@midwayjs/koa';
import { RecordService } from '../../service/record.service';
import { NetWorthService } from '../../service/net-worth.service';
import type { ICreateRecordOptions, IUpdateRecordOptions } from '../../interface';

@Controller('/record')
export class RecordController {
  @Inject()
  ctx: Context;

  @Inject()
  recordService: RecordService;

  @Inject()
  netWorthService: NetWorthService;

  @Post('/')
  async createRecord(@Body() options: ICreateRecordOptions) {
    try {
      const userId = (this.ctx.state.user as any)?.userId;
      if (!userId) {
        return {
          success: false,
          message: '用户未登录',
        };
      }
      const record = await this.recordService.createRecord({
        ...options,
        userId,
      });
      return {
        success: true,
        message: '创建成功',
        data: record,
      };
    } catch (error) {
      return {
        success: false,
        message: '创建失败',
        error: error.message,
      };
    }
  }

  @Get('/page')
  async getRecordsByMonth(
    @Query('yearMonth') yearMonth: string,
    @Query('page') page: string = '1',
    @Query('pageSize') pageSize: string = '50'
  ) {
    try {
      const userId = (this.ctx.state.user as any)?.userId;
      if (!userId) {
        return {
          success: false,
          message: '用户未登录',
        };
      }
      const pageNum = parseInt(page) || 1;
      const size = parseInt(pageSize) || 50;
      const result = await this.recordService.getRecordsByMonth(
        userId,
        yearMonth,
        pageNum,
        size
      );
      return {
        success: true,
        message: '获取成功',
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        message: '获取失败',
        error: error.message,
      };
    }
  }

  @Get('/month-summary')
  async getMonthSummary(@Query('yearMonth') yearMonth: string) {
    try {
      const userId = (this.ctx.state.user as any)?.userId;
      if (!userId) {
        return {
          success: false,
          message: '用户未登录',
        };
      }
      const summary = await this.recordService.getMonthSummary(userId, yearMonth);
      return {
        success: true,
        message: '获取成功',
        data: summary,
      };
    } catch (error) {
      return {
        success: false,
        message: '获取失败',
        error: error.message,
      };
    }
  }

  @Get('/net-worth')
  async getNetWorth() {
    try {
      const userId = (this.ctx.state.user as any)?.userId;
      if (!userId) {
        return { success: false, message: '用户未登录' };
      }
      const netWorth = await this.netWorthService.getNetWorth(userId);
      return { success: true, message: '获取成功', data: netWorth };
    } catch (error) {
      return { success: false, message: '获取失败', error: error.message };
    }
  }

  @Get('/')
  async getAllRecords() {
    try {
      const userId = (this.ctx.state.user as any)?.userId;
      if (!userId) {
        return {
          success: false,
          message: '用户未登录',
        };
      }
      const records = await this.recordService.getRecordsByUserId(userId);
      return {
        success: true,
        message: '获取成功',
        data: records,
      };
    } catch (error) {
      return {
        success: false,
        message: '获取失败',
        error: error.message,
      };
    }
  }

  @Get('/:id')
  async getRecord(@Param('id') id: string) {
    try {
      const record = await this.recordService.getRecordById(parseInt(id));
      if (!record) {
        return {
          success: false,
          message: '记录不存在',
        };
      }
      return {
        success: true,
        message: '获取成功',
        data: record,
      };
    } catch (error) {
      return {
        success: false,
        message: '获取失败',
        error: error.message,
      };
    }
  }

  @Put('/:id')
  async updateRecord(
    @Param('id') id: string,
    @Body() options: Omit<IUpdateRecordOptions, 'id'>
  ) {
    try {
      const record = await this.recordService.updateRecord({
        id: parseInt(id),
        ...options,
      });
      if (!record) {
        return {
          success: false,
          message: '记录不存在',
        };
      }
      return {
        success: true,
        message: '更新成功',
        data: record,
      };
    } catch (error) {
      return {
        success: false,
        message: '更新失败',
        error: error.message,
      };
    }
  }

  @Get('/depreciating-assets')
  async getDepreciatingAssets() {
    try {
      const userId = (this.ctx.state.user as any)?.userId;
      if (!userId) {
        return { success: false, message: '用户未登录' };
      }
      const assets = await this.recordService.getDepreciatingAssets(userId);
      return { success: true, message: '获取成功', data: assets };
    } catch (error) {
      return { success: false, message: '获取失败', error: error.message };
    }
  }

  @Get('/depreciating-asset/:recordId')
  async getDepreciatingAssetByRecordId(@Param('recordId') recordId: string) {
    try {
      const userId = (this.ctx.state.user as any)?.userId;
      if (!userId) {
        return { success: false, message: '用户未登录' };
      }
      const asset = await this.recordService.getDepreciatingAssetByRecordId(parseInt(recordId));
      return { success: true, data: asset };
    } catch (error) {
      return { success: false, message: '获取失败', error: error.message };
    }
  }

  @Get('/yearly-summary')
  async getYearlySummary() {
    try {
      const userId = (this.ctx.state.user as any)?.userId;
      if (!userId) {
        return { success: false, message: '用户未登录' };
      }
      const summary = await this.recordService.getYearlySummary(userId);
      return { success: true, message: '获取成功', data: summary };
    } catch (error) {
      return { success: false, message: '获取失败', error: error.message };
    }
  }

  @Get('/yearly-bills')
  async getYearlyBills() {
    try {
      const userId = (this.ctx.state.user as any)?.userId;
      if (!userId) {
        return { success: false, message: '用户未登录' };
      }
      const bills = await this.recordService.getYearlyBills(userId);
      return { success: true, message: '获取成功', data: bills };
    } catch (error) {
      return { success: false, message: '获取失败', error: error.message };
    }
  }

  @Del('/:id')
  async deleteRecord(@Param('id') id: string) {
    try {
      const success = await this.recordService.deleteRecord(parseInt(id));
      if (!success) {
        return {
          success: false,
          message: '记录不存在',
        };
      }
      return {
        success: true,
        message: '删除成功',
      };
    } catch (error) {
      return {
        success: false,
        message: '删除失败',
        error: error.message,
      };
    }
  }
}