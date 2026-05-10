import { Inject, Controller, Get, Param, Post, Put, Del, Body } from '@midwayjs/core';
import type { Context } from '@midwayjs/koa';
import { CategoryService } from '../../service/category.service';

@Controller('/api/category')
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

  @Get('/user/groups/all')
  async getUserGroups() {
    try {
      const userId = this.ctx.state.user?.userId;
      if (!userId) {
        return {
          success: false,
          message: '请先登录',
        };
      }

      const groups = await this.categoryService.getUserGroups(userId);
      return {
        success: true,
        message: '获取成功',
        data: groups,
      };
    } catch (error) {
      return {
        success: false,
        message: '获取失败',
        error: (error as Error).message,
      };
    }
  }

  @Post('/user/groups')
  async createUserGroup(@Body() body: { name: string }) {
    try {
      const userId = this.ctx.state.user?.userId;
      if (!userId) {
        return {
          success: false,
          message: '请先登录',
        };
      }

      const group = await this.categoryService.createUserGroup(userId, body);
      return {
        success: true,
        message: '创建成功',
        data: group,
      };
    } catch (error) {
      return {
        success: false,
        message: '创建失败',
        error: (error as Error).message,
      };
    }
  }

  @Put('/user/groups/:id')
  async updateUserGroup(@Param('id') id: string, @Body() body: { name: string }) {
    try {
      const userId = this.ctx.state.user?.userId;
      if (!userId) {
        return {
          success: false,
          message: '请先登录',
        };
      }

      const group = await this.categoryService.updateUserGroup(userId, parseInt(id), body);
      return {
        success: true,
        message: '更新成功',
        data: group,
      };
    } catch (error) {
      return {
        success: false,
        message: '更新失败',
        error: (error as Error).message,
      };
    }
  }

  @Del('/user/groups/:id')
  async deleteUserGroup(@Param('id') id: string) {
    try {
      const userId = this.ctx.state.user?.userId;
      if (!userId) {
        return {
          success: false,
          message: '请先登录',
        };
      }

      await this.categoryService.deleteUserGroup(userId, parseInt(id));
      return {
        success: true,
        message: '删除成功',
      };
    } catch (error) {
      return {
        success: false,
        message: '删除失败',
        error: (error as Error).message,
      };
    }
  }
}
