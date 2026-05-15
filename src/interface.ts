/**
 * @description User-Service parameters
 */
export interface IUserOptions {
  uid: number;
}

/**
 * @description Transaction record interface
 */
export interface IRecord {
  id: number;
  typeId: number;
  date: string;
  amount: number;
  type: 'income' | 'expense' | 'transfer' | 'repayment';
  accountId?: number;
  toAccountId?: number;
  remark?: string;
}

/**
 * @description Create record options
 */
export interface ICreateRecordAssetOptions {
  name: string;
  category: string;
  depreciationMethod: string;
  purchasePrice: number;
  purchaseDate: string;
  expectedLifeMonths: number;
  residualValue: number;
}

export interface ICreateRecordOptions {
  userId: number;
  typeId: number;
  date: string;
  amount: number;
  type: 'income' | 'expense' | 'transfer' | 'repayment';
  accountId?: number;
  toAccountId?: number;
  remark?: string;
  depreciatingAsset?: ICreateRecordAssetOptions;
}

/**
 * @description Update record options
 */
export interface IUpdateRecordOptions {
  id: number;
  typeId?: number;
  date?: string;
  amount?: number;
  type?: 'income' | 'expense' | 'transfer' | 'repayment';
  accountId?: number;
  toAccountId?: number;
  remark?: string;
  depreciatingAsset?: ICreateRecordAssetOptions;
}
