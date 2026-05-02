import { Inject, Controller, Get, Param } from '@midwayjs/core';
import type { Context } from '@midwayjs/koa';
import { CategoryService } from '../../service/category.service';

@Controller('/category')
export class CategoryController {
  @Inject()
  ctx: Context;

  @Inject()
  categoryService: CategoryService;

  @Get('/')
  async getAllCategories() {
    try {
      const categories = await this.categoryService.getAllCategories();
      return {
        success: true,
        message: '获取成功',
        data: categories,
      };
    } catch (error) {
      return {
        success: false,
        message: '获取失败',
        error: (error as Error).message,
      };
    }
  }

  @Get('/:type')
  async getCategoriesByType(@Param('type') type: string) {
    try {
      const categories = await this.categoryService.getCategoriesByType(type as 'income' | 'expense');
      return {
        success: true,
        message: '获取成功',
        data: categories,
      };
    } catch (error) {
      return {
        success: false,
        message: '获取失败',
        error: (error as Error).message,
      };
    }
  }

  @Get('/user/:type')
  async getUserCategories(@Param('type') type: string) {
    try {
      const userId = this.ctx.state.user?.userId;
      if (!userId) {
        return {
          success: false,
          message: '请先登录',
        };
      }

      const categories = await this.categoryService.getUserCategories(userId, type as 'income' | 'expense');
      return {
        success: true,
        message: '获取成功',
        data: categories,
      };
    } catch (error) {
      return {
        success: false,
        message: '获取失败',
        error: (error as Error).message,
      };
    }
  }

  @Get('/icons/all')
  async getAllIcons() {
    try {
      const icons = await this.categoryService.getAllIcons();
      return {
        success: true,
        message: '获取成功',
        data: icons,
      };
    } catch (error) {
      return {
        success: false,
        message: '获取失败',
        error: (error as Error).message,
      };
    }
  }
}
