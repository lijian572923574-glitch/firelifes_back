import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from '../entity/account.entity';
import { DepreciatingAsset } from '../entity/depreciating_asset.entity';

export interface NetWorthData {
  netWorth: number;
  cashBalance: number;
  depreciatingAssetValue: number;
  liabilityBalance: number;
}

@Provide()
export class NetWorthService {
  @InjectEntityModel(Account)
  accountModel: Repository<Account>;

  @InjectEntityModel(DepreciatingAsset)
  depreciatingAssetModel: Repository<DepreciatingAsset>;

  async getNetWorth(userId: number): Promise<NetWorthData> {
    const accountResult = await this.accountModel
      .createQueryBuilder('account')
      .select('COALESCE(SUM(account.balance), 0)', 'totalBalance')
      .where('account.userId = :userId', { userId })
      .andWhere('account.isDeleted = false')
      .andWhere('account.isVisible = true')
      .getRawOne();

    const assetResult = await this.depreciatingAssetModel
      .createQueryBuilder('asset')
      .select('COALESCE(SUM(asset.currentValue), 0)', 'totalValue')
      .where('asset.userId = :userId', { userId })
      .andWhere('asset.status = :status', { status: 'active' })
      .getRawOne();

    const cashBalance = parseFloat(accountResult?.totalBalance || '0');
    const assetValue = parseFloat(assetResult?.totalValue || '0');

    return {
      netWorth: Math.round((cashBalance + assetValue) * 100) / 100,
      cashBalance,
      depreciatingAssetValue: assetValue,
      liabilityBalance: 0,
    };
  }
}
