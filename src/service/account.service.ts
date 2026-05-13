import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { Account, AccountType } from '../entity/account.entity';
import { AccountAdjustment } from '../entity/account_adjustment.entity';

export interface AccountRequest {
  name: string;
  icon: string;
  type: AccountType;
  balance: number;
  description?: string;
}

export interface AdjustBalanceRequest {
  newBalance: number;
  remark?: string;
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

  @InjectEntityModel(AccountAdjustment)
  accountAdjustmentModel: Repository<AccountAdjustment>;

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

    // 负债类余额强制转负数
    let balance = data.balance;
    if (data.type === 'liability' && balance > 0) {
      balance = -Math.abs(balance);
    }

    const account = this.accountModel.create({
      userId,
      name: data.name,
      icon: data.icon,
      type: data.type,
      balance: balance,
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

    // 负债类余额强制转负数
    let balance = data.balance;
    if (data.type === 'liability' && balance > 0) {
      balance = -Math.abs(balance);
    }

    account.name = data.name;
    account.icon = data.icon;
    account.type = data.type;
    account.balance = balance;
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

  /**
   * 调整账户余额
   */
  async adjustBalance(
    userId: number,
    accountId: number,
    data: AdjustBalanceRequest
  ): Promise<{ account: Account; adjustment: AccountAdjustment }> {
    const account = await this.accountModel.findOne({
      where: { id: accountId, userId, isDeleted: false }
    });

    if (!account) {
      throw new Error('账户不存在');
    }

    const oldBalance = account.balance;
    const newBalance = data.newBalance;
    const adjustmentAmount = newBalance - oldBalance;

    // 更新账户余额
    account.balance = newBalance;
    await this.accountModel.save(account);

    // 创建调整记录
    const adjustment = this.accountAdjustmentModel.create({
      userId,
      accountId,
      oldBalance,
      newBalance,
      adjustmentAmount,
      remark: data.remark
    });
    await this.accountAdjustmentModel.save(adjustment);

    return {
      account: transformAccount(account) as any,
      adjustment: {
        ...adjustment,
        id: String(adjustment.id),
        userId: String(adjustment.userId),
        accountId: String(adjustment.accountId),
        createdAt: adjustment.createdAt.toISOString(),
        updatedAt: adjustment.updatedAt.toISOString()
      }
    };
  }

  /**
   * 获取账户调整记录
   */
  async getAdjustmentsByAccountId(
    userId: number,
    accountId: number
  ): Promise<AccountAdjustment[]> {
    const adjustments = await this.accountAdjustmentModel.find({
      where: { userId, accountId },
      order: { createdAt: 'DESC' }
    });
    return adjustments.map(adj => ({
      ...adj,
      id: String(adj.id),
      userId: String(adj.userId),
      accountId: String(adj.accountId),
      createdAt: adj.createdAt.toISOString(),
      updatedAt: adj.updatedAt.toISOString()
    } as any));
  }
}
