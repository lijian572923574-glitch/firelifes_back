import { Provide, Init } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../entity/category.entity';
import { CategoryGroup } from '../entity/category_group.entity';
import { Icon } from '../entity/icon.entity';
import { UserCategoryCustomization } from '../entity/user_category_customization.entity';
import { UserCategoryGroup } from '../entity/user_category_group.entity';
import { UserIcon } from '../entity/user_icon.entity';

@Provide()
export class CategoryService {
  @InjectEntityModel(Category)
  categoryModel: Repository<Category>;

  @InjectEntityModel(CategoryGroup)
  categoryGroupModel: Repository<CategoryGroup>;

  @InjectEntityModel(Icon)
  iconModel: Repository<Icon>;

  @InjectEntityModel(UserCategoryCustomization)
  customizationModel: Repository<UserCategoryCustomization>;

  @InjectEntityModel(UserCategoryGroup)
  userCategoryGroupModel: Repository<UserCategoryGroup>;

  @InjectEntityModel(UserIcon)
  userIconModel: Repository<UserIcon>;

  private defaultIcons: Omit<Icon, 'id' | 'createdAt' | 'updatedAt'>[] = [
    { name: '餐饮', url: '🍜', iconType: 'emoji', sortOrder: 1 },
    { name: '购物', url: '🛍️', iconType: 'emoji', sortOrder: 2 },
    { name: '日用', url: '🧻', iconType: 'emoji', sortOrder: 3 },
    { name: '交通', url: '🚌', iconType: 'emoji', sortOrder: 4 },
    { name: '零食', url: '🍰', iconType: 'emoji', sortOrder: 5 },
    { name: '运动', url: '🚴', iconType: 'emoji', sortOrder: 6 },
    { name: '娱乐', url: '🎮', iconType: 'emoji', sortOrder: 7 },
    { name: '通讯', url: '📱', iconType: 'emoji', sortOrder: 8 },
    { name: '服饰', url: '👔', iconType: 'emoji', sortOrder: 9 },
    { name: '住房', url: '🏠', iconType: 'emoji', sortOrder: 10 },
    { name: '居家', url: '🛋️', iconType: 'emoji', sortOrder: 11 },
    { name: '孩子', url: '👶', iconType: 'emoji', sortOrder: 12 },
    { name: '长辈', url: '👴', iconType: 'emoji', sortOrder: 13 },
    { name: '社交', url: '💬', iconType: 'emoji', sortOrder: 14 },
    { name: '旅行', url: '✈️', iconType: 'emoji', sortOrder: 15 },
    { name: '数码', url: '💻', iconType: 'emoji', sortOrder: 16 },
    { name: '汽车', url: '🚗', iconType: 'emoji', sortOrder: 17 },
    { name: '医疗', url: '💊', iconType: 'emoji', sortOrder: 18 },
    { name: '书籍', url: '📚', iconType: 'emoji', sortOrder: 19 },
    { name: '学习', url: '🎓', iconType: 'emoji', sortOrder: 20 },
    { name: '礼金', url: '🧧', iconType: 'emoji', sortOrder: 21 },
    { name: '礼物', url: '🎁', iconType: 'emoji', sortOrder: 22 },
    { name: '办公', url: '💼', iconType: 'emoji', sortOrder: 23 },
    { name: '维修', url: '🔧', iconType: 'emoji', sortOrder: 24 },
    { name: '捐赠', url: '❤️', iconType: 'emoji', sortOrder: 25 },
    { name: '彩票', url: '🎰', iconType: 'emoji', sortOrder: 26 },
    { name: '亲友', url: '👨‍👩‍👧‍👦', iconType: 'emoji', sortOrder: 27 },
    { name: '快递', url: '📦', iconType: 'emoji', sortOrder: 28 },
    { name: '工资', url: '💼', iconType: 'emoji', sortOrder: 29 },
    { name: '奖金', url: '🎁', iconType: 'emoji', sortOrder: 30 },
    { name: '投资', url: '📈', iconType: 'emoji', sortOrder: 31 },
    { name: '兼职', url: '👔', iconType: 'emoji', sortOrder: 32 },
    { name: '理财', url: '💰', iconType: 'emoji', sortOrder: 33 },
    { name: '报销', url: '📋', iconType: 'emoji', sortOrder: 34 },
    { name: '其他', url: '📦', iconType: 'emoji', sortOrder: 35 },
    { name: '饮料', url: '🥤', iconType: 'emoji', sortOrder: 36 },
    { name: '水果', url: '🍎', iconType: 'emoji', sortOrder: 37 },
    { name: '美发', url: '💇', iconType: 'emoji', sortOrder: 38 },
    { name: '美容', url: '💄', iconType: 'emoji', sortOrder: 39 },
    { name: '健身', url: '🏋️', iconType: 'emoji', sortOrder: 40 },
    { name: '咖啡', url: '☕', iconType: 'emoji', sortOrder: 41 },
    { name: '电影', url: '🎬', iconType: 'emoji', sortOrder: 42 },
    { name: '音乐', url: '🎵', iconType: 'emoji', sortOrder: 43 },
    { name: '游戏', url: '🎮', iconType: 'emoji', sortOrder: 44 },
    { name: '宠物', url: '🐶', iconType: 'emoji', sortOrder: 45 },
  ];

  private defaultGroups: Omit<CategoryGroup, 'id' | 'createdAt' | 'updatedAt'>[] = [
    { name: '饮食消费', sortOrder: 1 },
    { name: '居家居住', sortOrder: 2 },
    { name: '交通出行', sortOrder: 3 },
    { name: '形象与消费', sortOrder: 4 },
    { name: '兴趣与成长', sortOrder: 5 },
    { name: '社交关系', sortOrder: 6 },
    { name: '健康与医疗', sortOrder: 7 },
    { name: '职场工作', sortOrder: 8 },
    { name: '金融理财', sortOrder: 9 },
    { name: '其他类型', sortOrder: 10 },
  ];

  private defaultCategories: (Omit<Category, 'id'> & { id: string })[] = [
    { id: 'expense_1_1', name: '餐饮', groupId: 1, iconId: 1, sortOrder: 1, isDefault: true, type: 'expense' },
    { id: 'expense_1_2', name: '饮料', groupId: 1, iconId: 36, sortOrder: 2, isDefault: true, type: 'expense' },
    { id: 'expense_1_3', name: '水果', groupId: 1, iconId: 37, sortOrder: 3, isDefault: true, type: 'expense' },
    { id: 'expense_1_4', name: '零食', groupId: 1, iconId: 5, sortOrder: 4, isDefault: true, type: 'expense' },
    { id: 'expense_1_5', name: '咖啡', groupId: 1, iconId: 41, sortOrder: 5, isDefault: true, type: 'expense' },
    { id: 'expense_2_1', name: '住房', groupId: 2, iconId: 10, sortOrder: 1, isDefault: true, type: 'expense' },
    { id: 'expense_2_2', name: '居家', groupId: 2, iconId: 11, sortOrder: 2, isDefault: true, type: 'expense' },
    { id: 'expense_2_3', name: '维修', groupId: 2, iconId: 24, sortOrder: 3, isDefault: true, type: 'expense' },
    { id: 'expense_2_4', name: '快递', groupId: 2, iconId: 28, sortOrder: 4, isDefault: true, type: 'expense' },
    { id: 'expense_3_1', name: '交通', groupId: 3, iconId: 4, sortOrder: 1, isDefault: true, type: 'expense' },
    { id: 'expense_3_2', name: '汽车', groupId: 3, iconId: 17, sortOrder: 2, isDefault: true, type: 'expense' },
    { id: 'expense_4_1', name: '服饰', groupId: 4, iconId: 9, sortOrder: 1, isDefault: true, type: 'expense' },
    { id: 'expense_4_2', name: '美发', groupId: 4, iconId: 38, sortOrder: 2, isDefault: true, type: 'expense' },
    { id: 'expense_4_3', name: '美容', groupId: 4, iconId: 39, sortOrder: 3, isDefault: true, type: 'expense' },
    { id: 'expense_4_4', name: '购物', groupId: 4, iconId: 2, sortOrder: 4, isDefault: true, type: 'expense' },
    { id: 'expense_5_1', name: '运动', groupId: 5, iconId: 6, sortOrder: 1, isDefault: true, type: 'expense' },
    { id: 'expense_5_2', name: '健身', groupId: 5, iconId: 40, sortOrder: 2, isDefault: true, type: 'expense' },
    { id: 'expense_5_3', name: '旅行', groupId: 5, iconId: 15, sortOrder: 3, isDefault: true, type: 'expense' },
    { id: 'expense_5_4', name: '书籍', groupId: 5, iconId: 19, sortOrder: 4, isDefault: true, type: 'expense' },
    { id: 'expense_5_5', name: '学习', groupId: 5, iconId: 20, sortOrder: 5, isDefault: true, type: 'expense' },
    { id: 'expense_5_6', name: '娱乐', groupId: 5, iconId: 7, sortOrder: 6, isDefault: true, type: 'expense' },
    { id: 'expense_5_7', name: '电影', groupId: 5, iconId: 42, sortOrder: 7, isDefault: true, type: 'expense' },
    { id: 'expense_5_8', name: '音乐', groupId: 5, iconId: 43, sortOrder: 8, isDefault: true, type: 'expense' },
    { id: 'expense_5_9', name: '游戏', groupId: 5, iconId: 44, sortOrder: 9, isDefault: true, type: 'expense' },
    { id: 'expense_6_1', name: '社交', groupId: 6, iconId: 14, sortOrder: 1, isDefault: true, type: 'expense' },
    { id: 'expense_6_2', name: '礼物', groupId: 6, iconId: 22, sortOrder: 2, isDefault: true, type: 'expense' },
    { id: 'expense_6_3', name: '礼金', groupId: 6, iconId: 21, sortOrder: 3, isDefault: true, type: 'expense' },
    { id: 'expense_6_4', name: '亲友', groupId: 6, iconId: 27, sortOrder: 4, isDefault: true, type: 'expense' },
    { id: 'expense_6_5', name: '宠物', groupId: 6, iconId: 45, sortOrder: 5, isDefault: true, type: 'expense' },
    { id: 'expense_7_1', name: '医疗', groupId: 7, iconId: 18, sortOrder: 1, isDefault: true, type: 'expense' },
    { id: 'expense_8_1', name: '办公', groupId: 8, iconId: 23, sortOrder: 1, isDefault: true, type: 'expense' },
    { id: 'expense_8_2', name: '通讯', groupId: 8, iconId: 8, sortOrder: 2, isDefault: true, type: 'expense' },
    { id: 'expense_9_1', name: '投资', groupId: 9, iconId: 31, sortOrder: 1, isDefault: true, type: 'expense' },
    { id: 'expense_9_2', name: '彩票', groupId: 9, iconId: 26, sortOrder: 2, isDefault: true, type: 'expense' },
    { id: 'expense_10_1', name: '其他', groupId: 10, iconId: 35, sortOrder: 1, isDefault: true, type: 'expense' },
    { id: 'expense_10_2', name: '日用', groupId: 10, iconId: 3, sortOrder: 2, isDefault: true, type: 'expense' },
    { id: 'expense_10_3', name: '捐赠', groupId: 10, iconId: 25, sortOrder: 3, isDefault: true, type: 'expense' },
    { id: 'income_8_1', name: '工资', groupId: 8, iconId: 29, sortOrder: 1, isDefault: true, type: 'income' },
    { id: 'income_8_2', name: '奖金', groupId: 8, iconId: 30, sortOrder: 2, isDefault: true, type: 'income' },
    { id: 'income_9_1', name: '投资收入', groupId: 9, iconId: 31, sortOrder: 3, isDefault: true, type: 'income' },
    { id: 'income_8_3', name: '兼职', groupId: 8, iconId: 32, sortOrder: 4, isDefault: true, type: 'income' },
    { id: 'income_9_2', name: '理财', groupId: 9, iconId: 33, sortOrder: 5, isDefault: true, type: 'income' },
    { id: 'income_8_4', name: '报销', groupId: 8, iconId: 34, sortOrder: 6, isDefault: true, type: 'income' },
    { id: 'income_6_1', name: '礼金收入', groupId: 6, iconId: 21, sortOrder: 7, isDefault: true, type: 'income' },
    { id: 'income_10_1', name: '其他收入', groupId: 10, iconId: 35, sortOrder: 8, isDefault: true, type: 'income' },
  ];

  @Init()
  async init() {
    const iconCount = await this.iconModel.count();
    if (iconCount === 0) {
      await this.iconModel.save(this.defaultIcons as any);
    }

    const groupCount = await this.categoryGroupModel.count();
    if (groupCount === 0) {
      await this.categoryGroupModel.save(this.defaultGroups as any);
    }

    const categoryCount = await this.categoryModel.count();
    if (categoryCount === 0) {
      await this.categoryModel.save(this.defaultCategories as any);
    }
  }

  async getAllCategories() {
    const groups = await this.categoryGroupModel.find({
      order: { sortOrder: 'ASC' },
    });
    const categories = await this.categoryModel.find({
      order: { sortOrder: 'ASC' },
    });
    const icons = await this.iconModel.find();

    const iconMap = new Map(icons.map(i => [i.id, i]));

    const result = groups.map(group => ({
      ...group,
      children: categories
        .filter(c => c.groupId === group.id)
        .map(c => ({
          ...c,
          icon: iconMap.get(c.iconId),
        })),
    }));

    return {
      expense: result.filter(g => g.children.some((c: any) => c.type === 'expense')),
      income: result.filter(g => g.children.some((c: any) => c.type === 'income')),
    };
  }

  async getCategoriesByType(type: 'income' | 'expense') {
    const groups = await this.categoryGroupModel.find({
      order: { sortOrder: 'ASC' },
    });
    const categories = await this.categoryModel.find({
      where: { type },
      order: { sortOrder: 'ASC' },
    });
    const icons = await this.iconModel.find();
    const iconMap = new Map(icons.map(i => [i.id, i]));

    return groups
      .map(group => ({
        ...group,
        children: categories
          .filter(c => c.groupId === group.id)
          .map(c => ({
            ...c,
            icon: iconMap.get(c.iconId),
          })),
      }))
      .filter(g => g.children.length > 0);
  }

  async getCategoryById(id: string) {
    return this.categoryModel.findOne({ where: { id } });
  }

  async getUserCategories(userId: number, type: 'income' | 'expense') {
    const userGroups = await this.userCategoryGroupModel.find({
      where: { userId, isEnabled: true },
      order: { sortOrder: 'ASC' },
    });
    const userCategories = await this.customizationModel.find({
      where: { userId, type, isEnabled: true },
      relations: ['icon'],
      order: { sortOrder: 'ASC' },
    });

    const result = userGroups
      .map(userGroup => {
        const children = userCategories.filter(c => c.groupId === userGroup.id);

        return {
          id: userGroup.id,
          name: userGroup.name,
          sortOrder: userGroup.sortOrder,
          children: children.map(cat => ({
            id: cat.id,
            name: cat.name,
            iconUrl: cat.icon?.url || '📦',
            iconId: cat.iconId,
            sortOrder: cat.sortOrder,
            isUserCreated: cat.isUserCreated,
            groupId: cat.groupId,
            type: cat.type,
          })),
        };
      })
      .filter(g => g.children.length > 0);

    return result;
  }

  async getAllIcons() {
    return this.iconModel.find({
      order: { sortOrder: 'ASC' },
    });
  }

  async initUserCategories(userId: number) {
    console.log(`[分类初始化] 开始为用户 ${userId} 初始化数据`);
    
    try {
      const existingGroups = await this.userCategoryGroupModel.count({ where: { userId } });
      if (existingGroups > 0) {
        console.log(`[分类初始化] 用户 ${userId} 已有分类数据，跳过`);
        return;
      }

      const globalGroups = await this.categoryGroupModel.find({ order: { sortOrder: 'ASC' } });
      console.log(`[分类初始化] 找到 ${globalGroups.length} 个全局大类`);
      
      const globalCategories = await this.categoryModel.find({ order: { sortOrder: 'ASC' } });
      console.log(`[分类初始化] 找到 ${globalCategories.length} 个全局分类`);

      const userGroupEntities: UserCategoryGroup[] = [];
      for (const group of globalGroups) {
        const userGroup = this.userCategoryGroupModel.create({
          userId,
          name: group.name,
          sortOrder: group.sortOrder,
          isEnabled: true,
        });
        userGroupEntities.push(userGroup);
      }
      await this.userCategoryGroupModel.save(userGroupEntities);
      console.log(`[分类初始化] 已保存 ${userGroupEntities.length} 个用户大类`);

      await this.initUserIcons(userId);

      const userIcons = await this.userIconModel.find({ where: { userId } });
      console.log(`[分类初始化] 用户 ${userId} 有 ${userIcons.length} 个图标`);
      
      const globalIcons = await this.iconModel.find();
      console.log(`[分类初始化] 全局有 ${globalIcons.length} 个图标`);
      
      const iconIdToUserIconIdMap = new Map<number, number>();
      for (let i = 0; i < globalIcons.length; i++) {
        iconIdToUserIconIdMap.set(globalIcons[i].id, userIcons[i]?.id);
      }

      const userCategoryEntities: UserCategoryCustomization[] = [];
      for (const category of globalCategories) {
        const globalGroupIndex = globalGroups.findIndex(g => g.id === category.groupId);
        const userGroup = userGroupEntities[globalGroupIndex];

        const userIconId = iconIdToUserIconIdMap.get(category.iconId);

        const userCategory = this.customizationModel.create({
          userId,
          name: category.name,
          iconId: userIconId || userIcons[0]?.id,
          type: category.type,
          groupId: userGroup.id,
          sortOrder: category.sortOrder,
          isEnabled: true,
          isUserCreated: false,
        });
        userCategoryEntities.push(userCategory);
      }
      await this.customizationModel.save(userCategoryEntities);
      console.log(`[分类初始化] 用户 ${userId} 分类和大类已初始化完成，共 ${userCategoryEntities.length} 个分类`);
    } catch (error) {
      console.error(`[分类初始化] 用户 ${userId} 初始化失败:`, error);
      throw error;
    }
  }

  async initUserIcons(userId: number) {
    console.log(`[图标初始化] 开始为用户 ${userId} 初始化图标`);
    
    try {
      const existingIcons = await this.userIconModel.count({ where: { userId } });
      if (existingIcons > 0) {
        console.log(`[图标初始化] 用户 ${userId} 已有图标数据，跳过`);
        return;
      }

      const globalIcons = await this.iconModel.find({ order: { sortOrder: 'ASC' } });
      console.log(`[图标初始化] 找到 ${globalIcons.length} 个全局图标`);

      const userIconEntities: UserIcon[] = [];
      for (const icon of globalIcons) {
        const userIcon = this.userIconModel.create({
          userId,
          name: icon.name,
          url: icon.url,
          iconType: icon.iconType,
          sortOrder: icon.sortOrder,
          isEnabled: true,
        });
        userIconEntities.push(userIcon);
      }
      await this.userIconModel.save(userIconEntities);
      console.log(`[图标初始化] 用户 ${userId} 图标已初始化完成，共 ${userIconEntities.length} 个`);
    } catch (error) {
      console.error(`[图标初始化] 用户 ${userId} 初始化失败:`, error);
      throw error;
    }
  }

  async getUserGroups(userId: number) {
    return this.userCategoryGroupModel.find({
      where: { userId, isEnabled: true },
      order: { sortOrder: 'ASC' },
    });
  }

  async createUserGroup(userId: number, data: { name: string }) {
    const maxGroup = await this.userCategoryGroupModel.findOne({
      where: { userId },
      order: { sortOrder: 'DESC' },
    });
    const sortOrder = maxGroup ? maxGroup.sortOrder + 1 : 0;

    const group = this.userCategoryGroupModel.create({
      userId,
      name: data.name,
      sortOrder,
      isEnabled: true,
    });
    return this.userCategoryGroupModel.save(group);
  }

  async updateUserGroup(userId: number, id: number, data: { name: string }) {
    const group = await this.userCategoryGroupModel.findOne({
      where: { id, userId },
    });
    if (!group) {
      throw new Error('分类不存在');
    }
    group.name = data.name;
    return this.userCategoryGroupModel.save(group);
  }

  async deleteUserGroup(userId: number, id: number) {
    const group = await this.userCategoryGroupModel.findOne({
      where: { id, userId },
    });
    if (!group) {
      throw new Error('分类不存在');
    }

    const childCategories = await this.customizationModel.count({
      where: { groupId: id, userId, isEnabled: true },
    });
    if (childCategories > 0) {
      throw new Error('请先删除该分类下的子分类');
    }

    group.isEnabled = false;
    await this.userCategoryGroupModel.save(group);
  }
}
