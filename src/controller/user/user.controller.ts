import { Controller, Get, Post, Put, Body, Del, Param, Inject } from '@midwayjs/core';
import type { Context } from '@midwayjs/koa';
import { UserService } from '../../service/user.service';

export interface IApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
}

@Controller('/user')
export class UserController {
  @Inject()
  userService: UserService;

  @Inject()
  ctx: Context;

  @Get('/profile')
  async getProfile(): Promise<IApiResponse> {
    try {
      const userId = this.ctx.state.user?.userId;
      if (!userId) {
        return { success: false, message: '请先登录' };
      }

      const profile = await this.userService.getUserProfile(userId);
      return { success: true, data: profile };
    } catch (error) {
      return { success: false, message: (error as Error).message };
    }
  }

  @Put('/profile')
  async updateProfile(@Body() body: {
    nickname?: string;
    avatarUrl?: string;
  }): Promise<IApiResponse> {
    try {
      const userId = this.ctx.state.user?.userId;
      if (!userId) {
        return { success: false, message: '请先登录' };
      }

      const user = await this.userService.updateProfile(userId, body);
      return {
        success: true,
        data: {
          nickname: user.nickname,
          avatarUrl: user.avatarUrl,
        },
        message: '更新成功',
      };
    } catch (error) {
      return { success: false, message: (error as Error).message };
    }
  }

  @Get('/customizations')
  async getCustomizations(): Promise<IApiResponse> {
    try {
      const userId = this.ctx.state.user?.userId;
      if (!userId) {
        return { success: false, message: '请先登录' };
      }

      const customizations = await this.userService.getUserCustomizations(userId);
      return { success: true, data: customizations };
    } catch (error) {
      return { success: false, message: (error as Error).message };
    }
  }

  @Put('/customizations/:categoryId')
  async updateCustomization(
    @Param('categoryId') categoryId: string,
    @Body() body: {
      name?: string;
      iconId?: number;
      isEnabled?: boolean;
      sortOrder?: number;
    }
  ): Promise<IApiResponse> {
    try {
      const userId = this.ctx.state.user?.userId;
      if (!userId) {
        return { success: false, message: '请先登录' };
      }

      const customization = await this.userService.updateUserCategory(userId, parseInt(categoryId), body);
      return { success: true, data: customization, message: '更新成功' };
    } catch (error) {
      return { success: false, message: (error as Error).message };
    }
  }

  @Post('/customizations')
  async addCustomCategory(@Body() body: {
    name: string;
    iconId: number;
    groupId: number;
    type: 'income' | 'expense';
    sortOrder?: number;
  }): Promise<IApiResponse> {
    try {
      const userId = this.ctx.state.user?.userId;
      if (!userId) {
        return { success: false, message: '请先登录' };
      }

      const customization = await this.userService.addUserCategory(userId, body);
      return { success: true, data: customization, message: '添加成功' };
    } catch (error) {
      return { success: false, message: (error as Error).message };
    }
  }

  @Del('/customizations/:id')
  async deleteCustomCategory(@Param('id') id: string): Promise<IApiResponse> {
    try {
      const userId = this.ctx.state.user?.userId;
      if (!userId) {
        return { success: false, message: '请先登录' };
      }

      const success = await this.userService.deleteUserCategory(userId, parseInt(id));
      if (success) {
        return { success: true, message: '删除成功' };
      }
      return { success: false, message: '记录不存在' };
    } catch (error) {
      return { success: false, message: (error as Error).message };
    }
  }

  @Post('/customizations/:categoryId/enable')
  async enableCategory(@Param('categoryId') categoryId: string): Promise<IApiResponse> {
    try {
      const userId = this.ctx.state.user?.userId;
      if (!userId) {
        return { success: false, message: '请先登录' };
      }

      const customization = await this.userService.enableCategory(userId, parseInt(categoryId));
      return { success: true, data: customization, message: '已启用' };
    } catch (error) {
      return { success: false, message: (error as Error).message };
    }
  }

  @Post('/customizations/:categoryId/disable')
  async disableCategory(@Param('categoryId') categoryId: string): Promise<IApiResponse> {
    try {
      const userId = this.ctx.state.user?.userId;
      if (!userId) {
        return { success: false, message: '请先登录' };
      }

      const customization = await this.userService.disableCategory(userId, parseInt(categoryId));
      return { success: true, data: customization, message: '已禁用' };
    } catch (error) {
      return { success: false, message: (error as Error).message };
    }
  }

  @Get('/groups')
  async getGroups(): Promise<IApiResponse> {
    try {
      const userId = this.ctx.state.user?.userId;
      if (!userId) {
        return { success: false, message: '请先登录' };
      }

      const groups = await this.userService.getUserGroups(userId);
      return { success: true, data: groups };
    } catch (error) {
      return { success: false, message: (error as Error).message };
    }
  }

  @Post('/groups')
  async addGroup(@Body() body: {
    name: string;
    sortOrder?: number;
  }): Promise<IApiResponse> {
    try {
      const userId = this.ctx.state.user?.userId;
      if (!userId) {
        return { success: false, message: '请先登录' };
      }

      const group = await this.userService.addUserGroup(userId, body);
      return { success: true, data: group, message: '添加成功' };
    } catch (error) {
      return { success: false, message: (error as Error).message };
    }
  }

  @Del('/groups/:id')
  async deleteGroup(@Param('id') id: string): Promise<IApiResponse> {
    try {
      const userId = this.ctx.state.user?.userId;
      if (!userId) {
        return { success: false, message: '请先登录' };
      }

      const success = await this.userService.deleteUserGroup(userId, parseInt(id));
      if (success) {
        return { success: true, message: '删除成功' };
      }
      return { success: false, message: '记录不存在' };
    } catch (error) {
      return { success: false, message: (error as Error).message };
    }
  }

  @Get('/icons')
  async getIcons(): Promise<IApiResponse> {
    try {
      const userId = this.ctx.state.user?.userId;
      if (!userId) {
        return { success: false, message: '请先登录' };
      }

      const icons = await this.userService.getUserIcons(userId);
      return { success: true, data: icons };
    } catch (error) {
      return { success: false, message: (error as Error).message };
    }
  }

  @Post('/icons')
  async addIcon(@Body() body: {
    name: string;
    url: string;
    iconType?: 'emoji' | 'image';
    sortOrder?: number;
  }): Promise<IApiResponse> {
    try {
      const userId = this.ctx.state.user?.userId;
      if (!userId) {
        return { success: false, message: '请先登录' };
      }

      const icon = await this.userService.addUserIcon(userId, body);
      return { success: true, data: icon, message: '添加成功' };
    } catch (error) {
      return { success: false, message: (error as Error).message };
    }
  }
}
