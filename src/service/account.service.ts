import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { Account, AccountType } from '../entity/account.entity';

export interface AccountRequest {
  name: string;
  icon: string;
  type: AccountType;
  balance: number;
  description?: string;
}

export interface DefaultAccountConfig {
  name: string;
  icon: string;
  type: AccountType;
  balance: number;
  description?: string;
  order: number;
  isDefault: boolean;
  isVisible: boolean;
  isDeleted: boolean;
}

const DEFAULT_ACCOUNTS: Omit<DefaultAccountConfig, 'id' | 'userId' | 'createdAt' | 'updatedAt'>[] = [
  {
    name: '现金',
    icon: '💵',
    type: 'cash',
    balance: 0,
    description: '日常现金备用',
    order: 1,
    isDefault: true,
    isVisible: true,
    isDeleted: false
  },
  {
    name: '折旧资产',
    icon: '📱',
    type: 'depreciable_asset',
    balance: 0,
    description: '手机、电脑等折旧物品',
    order: 2,
    isDefault: true,
    isVisible: true,
    isDeleted: false
  },
  {
    name: '固定资产',
    icon: '🏠',
    type: 'fixed_asset',
    balance: 0,
    description: '房产、车位等高价值物品',
    order: 3,
    isDefault: true,
    isVisible: true,
    isDeleted: false
  }
];

/**
 * 转换账户数据格式，确保符合前端期望
 */
const transformAccount = (account: Account) => {
  return {
    ...account,
    id: String(account.id),
    userId: String(account.userId),
    createdAt: account.createdAt.toISOString(),
    updatedAt: account.updatedAt.toISOString()
  };
};

const transformAccounts = (accounts: Account[]) => {
  return accounts.map(transformAccount);
};

@Provide()
export class AccountService {
  @InjectEntityModel(Account)
  accountModel: Repository<Account>;

  /**
   * 获取用户的所有账户
   */
  async getAccountsByUserId(userId: number): Promise<Account[]> {
    const accounts = await this.accountModel.find({
      where: {
        userId,
        isDeleted: false
      },
      order: {
        order: 'ASC',
        createdAt: 'ASC'
      }
    });
    // 转换格式后返回
    return transformAccounts(accounts) as any;
  }

  /**
   * 获取账户详情
   */
  async getAccountById(id: number, userId: number): Promise<Account | null> {
    const account = await this.accountModel.findOne({
      where: {
        id,
        userId,
        isDeleted: false
      }
    });
    if (!account) {
      return null;
    }
    return transformAccount(account) as any;
  }

  /**
   * 创建账户
   */
  async createAccount(userId: number, data: AccountRequest): Promise<Account> {
    const lastAccount = await this.accountModel.findOne({
      where: { userId, isDeleted: false },
      order: { order: 'DESC' }
    });

    const account = this.accountModel.create({
      userId,
      name: data.name,
      icon: data.icon,
      type: data.type,
      balance: data.balance,
      description: data.description,
      isDefault: false,
      order: (lastAccount?.order || 0) + 1,
      isVisible: true,
      isDeleted: false
    });

    const savedAccount = await this.accountModel.save(account);
    return transformAccount(savedAccount) as any;
  }

  /**
   * 更新账户
   */
  async updateAccount(id: number, userId: number, data: AccountRequest): Promise<Account | null> {
    const account = await this.accountModel.findOne({
      where: {
        id,
        userId,
        isDeleted: false
      }
    });
    if (!account) {
      return null;
    }

    account.name = data.name;
    account.icon = data.icon;
    account.type = data.type;
    account.balance = data.balance;
    account.description = data.description;

    const updatedAccount = await this.accountModel.save(account);
    return transformAccount(updatedAccount) as any;
  }

  /**
   * 删除账户（软删除）
   */
  async deleteAccount(id: number, userId: number): Promise<boolean> {
    const account = await this.accountModel.findOne({
      where: {
        id,
        userId,
        isDeleted: false
      }
    });
    if (!account) {
      return false;
    }

    // 默认账户不允许删除
    if (account.isDefault) {
      return false;
    }

    account.isDeleted = true;
    await this.accountModel.save(account);
    return true;
  }

  /**
   * 为新用户创建默认账户
   */
  async createDefaultAccounts(userId: number): Promise<Account[]> {
    const accounts: Account[] = [];

    for (const config of DEFAULT_ACCOUNTS) {
      const account = this.accountModel.create({
        userId,
        name: config.name,
        icon: config.icon,
        type: config.type,
        balance: config.balance,
        description: config.description,
        isDefault: config.isDefault,
        order: config.order,
        isVisible: config.isVisible,
        isDeleted: config.isDeleted
      });
      const savedAccount = await this.accountModel.save(account);
      accounts.push(savedAccount);
    }

    return transformAccounts(accounts) as any;
  }

  /**
   * 检查用户是否已有账户
   */
  async hasAccounts(userId: number): Promise<boolean> {
    const count = await this.accountModel.count({
      where: {
        userId,
        isDeleted: false
      }
    });
    return count > 0;
  }
}
