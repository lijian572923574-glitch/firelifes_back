import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { Record } from '../entity/record.entity';
import { Account } from '../entity/account.entity';
import { DepreciatingAsset } from '../entity/depreciating_asset.entity';
import { ICreateRecordOptions, IUpdateRecordOptions } from '../interface';

export interface PageResult<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface MonthSummary {
  income: number;
  expense: number;
}

export interface YearlySummary {
  totalIncome: number;
  totalExpense: number;
  totalBalance: number;
}

export interface YearlyBill {
  year: number;
  income: number;
  expense: number;
  balance: number;
}

/**
 * 根据记账类型联动更新账户余额
 * @returns 更新后的主账户余额
 */
function calculateAccountBalance(
  account: Account,
  toAccount: Account | null,
  type: string,
  amount: number
): { accountBalance: number; toAccountBalance?: number } {
  const absAmount = Math.abs(amount);

  switch (type) {
    case 'expense':
      // 支出：账户余额减少
      account.balance = Number(account.balance) - absAmount;
      return { accountBalance: account.balance };

    case 'income':
      // 收入：账户余额增加
      account.balance = Number(account.balance) + absAmount;
      return { accountBalance: account.balance };

    case 'transfer':
      // 转账：转出账户减少，转入账户增加
      account.balance = Number(account.balance) - absAmount;
      if (toAccount) {
        toAccount.balance = Number(toAccount.balance) + absAmount;
        return { accountBalance: account.balance, toAccountBalance: toAccount.balance };
      }
      return { accountBalance: account.balance };

    case 'repayment':
      // 还债：还款账户（资产）减少，债权账户（负债）绝对值减少
      account.balance = Number(account.balance) - absAmount;
      if (toAccount) {
        // 负债账户余额为负数（或0），还债后负债绝对值变小即余额变大（趋向0）
        toAccount.balance = Number(toAccount.balance) + absAmount;
        return { accountBalance: account.balance, toAccountBalance: toAccount.balance };
      }
      return { accountBalance: account.balance };

    default:
      return { accountBalance: account.balance };
  }
}

function calculateMonthlyDepreciation(
  purchasePrice: number,
  residualValue: number,
  lifeMonths: number,
  method: string
): number {
  if (method === 'straight-line') {
    return (purchasePrice - residualValue) / lifeMonths;
  }
  // double-declining-balance: 首月折旧 = purchasePrice * (2 / lifeMonths)
  return purchasePrice * (2 / lifeMonths);
}

@Provide()
export class RecordService {
  @InjectEntityModel(Record)
  recordModel: Repository<Record>;

  @InjectEntityModel(Account)
  accountModel: Repository<Account>;

  @InjectEntityModel(DepreciatingAsset)
  depreciatingAssetModel: Repository<DepreciatingAsset>;

  async createRecord(options: ICreateRecordOptions): Promise<Record> {
    return this.recordModel.manager.transaction(async (manager) => {
      const record = manager.create(Record, {
        userId: options.userId,
        typeId: options.typeId,
        date: options.date,
        amount: options.amount,
        type: options.type,
        accountId: options.accountId,
        toAccountId: options.toAccountId,
        remark: options.remark || '',
      });
      const savedRecord = await manager.save(record);

      // 联动更新账户余额
      if (options.accountId) {
        const account = await manager.findOne(Account, {
          where: { id: options.accountId, userId: options.userId, isDeleted: false }
        });
        if (account) {
          let toAccount: Account | null = null;
          if (options.toAccountId) {
            toAccount = await manager.findOne(Account, {
              where: { id: options.toAccountId, userId: options.userId, isDeleted: false }
            });
          }
          calculateAccountBalance(account, toAccount, options.type, options.amount);
          await manager.save(account);
          if (toAccount) {
            await manager.save(toAccount);
          }
        }
      }

      // 如果记入资产，事务内创建折旧资产
      if (options.depreciatingAsset) {
        const asset = options.depreciatingAsset;
        const monthlyDepreciation = calculateMonthlyDepreciation(
          asset.purchasePrice,
          asset.residualValue,
          asset.expectedLifeMonths,
          asset.depreciationMethod
        );

        const depreciatingAsset = manager.create(DepreciatingAsset, {
          userId: options.userId,
          recordId: savedRecord.id,
          name: asset.name,
          category: asset.category as any,
          depreciationMethod: asset.depreciationMethod as any,
          purchasePrice: asset.purchasePrice,
          purchaseDate: asset.purchaseDate,
          expectedLifeMonths: asset.expectedLifeMonths,
          residualValue: asset.residualValue,
          currentValue: asset.purchasePrice,
          monthlyDepreciation,
          usedMonths: 0,
          status: 'active',
        });
        await manager.save(depreciatingAsset);
      }

      return savedRecord;
    });
  }

  async updateRecord(options: IUpdateRecordOptions): Promise<Record | null> {
    const record = await this.recordModel.findOne({ where: { id: options.id } });
    if (!record) {
      return null;
    }

    if (options.typeId !== undefined) record.typeId = options.typeId;
    if (options.date !== undefined) record.date = options.date;
    if (options.amount !== undefined) record.amount = options.amount;
    if (options.type !== undefined) record.type = options.type;
    if (options.remark !== undefined) record.remark = options.remark;
    if (options.accountId !== undefined) record.accountId = options.accountId;
    if (options.toAccountId !== undefined) record.toAccountId = options.toAccountId;

    const savedRecord = await this.recordModel.save(record);

    if (options.depreciatingAsset) {
      const asset = options.depreciatingAsset;
      const existing = await this.depreciatingAssetModel.findOne({
        where: { recordId: options.id }
      });

      const monthlyDepreciation = calculateMonthlyDepreciation(
        asset.purchasePrice,
        asset.residualValue,
        asset.expectedLifeMonths,
        asset.depreciationMethod
      );

      if (existing) {
        existing.name = asset.name;
        existing.category = asset.category as any;
        existing.depreciationMethod = asset.depreciationMethod as any;
        existing.purchasePrice = asset.purchasePrice;
        existing.purchaseDate = asset.purchaseDate;
        existing.expectedLifeMonths = asset.expectedLifeMonths;
        existing.residualValue = asset.residualValue;
        existing.monthlyDepreciation = monthlyDepreciation;
        await this.depreciatingAssetModel.save(existing);
      } else {
        const newAsset = this.depreciatingAssetModel.create({
          userId: record.userId,
          recordId: savedRecord.id,
          name: asset.name,
          category: asset.category as any,
          depreciationMethod: asset.depreciationMethod as any,
          purchasePrice: asset.purchasePrice,
          purchaseDate: asset.purchaseDate,
          expectedLifeMonths: asset.expectedLifeMonths,
          residualValue: asset.residualValue,
          currentValue: asset.purchasePrice,
          monthlyDepreciation,
          usedMonths: 0,
          status: 'active',
        });
        await this.depreciatingAssetModel.save(newAsset);
      }
    }

    return savedRecord;
  }

  async getRecordById(id: number): Promise<Record | null> {
    return this.recordModel.findOne({ where: { id } });
  }

  async getAllRecords(): Promise<Record[]> {
    return this.recordModel.find({
      order: { date: 'DESC', createdAt: 'DESC' },
    });
  }

  async getRecordsByUserId(userId: number): Promise<Record[]> {
    return this.recordModel.find({
      where: { userId },
      order: { date: 'DESC', createdAt: 'DESC' },
    });
  }

  async deleteRecord(id: number): Promise<boolean> {
    const result = await this.recordModel.delete(id);
    return (result.affected ?? 0) > 0;
  }

  async getRecordsByMonth(
    userId: number,
    yearMonth: string,
    page: number = 1,
    pageSize: number = 50
  ): Promise<PageResult<Record>> {
    const startDate = `${yearMonth}-01`;
    const year = parseInt(yearMonth.split('-')[0]);
    const month = parseInt(yearMonth.split('-')[1]);
    const endDate = new Date(year, month, 0).toISOString().split('T')[0];
    
    const queryBuilder = this.recordModel
      .createQueryBuilder('record')
      .where('record.userId = :userId', { userId })
      .andWhere('record.date BETWEEN :startDate AND :endDate', { startDate, endDate })
      .orderBy('record.date', 'DESC')
      .addOrderBy('record.createdAt', 'DESC');

    const total = await queryBuilder.getCount();
    const list = await queryBuilder
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getMany();

    return {
      list,
      total,
      page,
      pageSize,
    };
  }

  async getMonthSummary(userId: number, yearMonth: string): Promise<MonthSummary> {
    const startDate = `${yearMonth}-01`;
    const year = parseInt(yearMonth.split('-')[0]);
    const month = parseInt(yearMonth.split('-')[1]);
    const endDate = new Date(year, month, 0).toISOString().split('T')[0];
    
    const result = await this.recordModel
      .createQueryBuilder('record')
      .select('record.type', 'type')
      .addSelect('SUM(ABS(record.amount))', 'total')
      .where('record.userId = :userId', { userId })
      .andWhere('record.date BETWEEN :startDate AND :endDate', { startDate, endDate })
      .andWhere('record.type IN (:...types)', { types: ['income', 'expense'] })
      .groupBy('record.type')
      .getRawMany();

    let income = 0;
    let expense = 0;

    result.forEach((row: any) => {
      if (row.type === 'income') {
        income = parseFloat(row.total) || 0;
      } else if (row.type === 'expense') {
        expense = parseFloat(row.total) || 0;
      }
    });

    return { income, expense };
  }

  async getDepreciatingAssets(userId: number): Promise<DepreciatingAsset[]> {
    return this.depreciatingAssetModel.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async getDepreciatingAssetByRecordId(recordId: number): Promise<DepreciatingAsset | null> {
    return this.depreciatingAssetModel.findOne({ where: { recordId } });
  }

  async updateDepreciatingAsset(id: number, data: Partial<DepreciatingAsset>): Promise<void> {
    await this.depreciatingAssetModel.update(id, data);
  }

  async getYearlySummary(userId: number): Promise<YearlySummary> {
    const result = await this.recordModel
      .createQueryBuilder('record')
      .select('record.type', 'type')
      .addSelect('SUM(ABS(record.amount))', 'total')
      .where('record.userId = :userId', { userId })
      .andWhere('record.type IN (:...types)', { types: ['income', 'expense'] })
      .groupBy('record.type')
      .getRawMany();

    let totalIncome = 0;
    let totalExpense = 0;

    result.forEach((row: any) => {
      if (row.type === 'income') {
        totalIncome = parseFloat(row.total) || 0;
      } else if (row.type === 'expense') {
        totalExpense = parseFloat(row.total) || 0;
      }
    });

    return {
      totalIncome: Math.round(totalIncome * 100) / 100,
      totalExpense: Math.round(totalExpense * 100) / 100,
      totalBalance: Math.round((totalIncome - totalExpense) * 100) / 100,
    };
  }

  async getYearlyBills(userId: number): Promise<YearlyBill[]> {
    const result = await this.recordModel
      .createQueryBuilder('record')
      .select("strftime('%Y', record.date)", 'year')
      .addSelect('record.type', 'type')
      .addSelect('SUM(ABS(record.amount))', 'total')
      .where('record.userId = :userId', { userId })
      .andWhere('record.type IN (:...types)', { types: ['income', 'expense'] })
      .groupBy("strftime('%Y', record.date), record.type")
      .orderBy("strftime('%Y', record.date)", 'DESC')
      .getRawMany();

    const yearMap = new Map<number, { income: number; expense: number }>();

    result.forEach((row: any) => {
      const year = parseInt(row.year);
      if (!yearMap.has(year)) {
        yearMap.set(year, { income: 0, expense: 0 });
      }
      const entry = yearMap.get(year)!;
      if (row.type === 'income') {
        entry.income = parseFloat(row.total) || 0;
      } else if (row.type === 'expense') {
        entry.expense = parseFloat(row.total) || 0;
      }
    });

    return Array.from(yearMap.entries())
      .map(([year, data]) => ({
        year,
        income: Math.round(data.income * 100) / 100,
        expense: Math.round(data.expense * 100) / 100,
        balance: Math.round((data.income - data.expense) * 100) / 100,
      }))
      .sort((a, b) => b.year - a.year);
  }
}