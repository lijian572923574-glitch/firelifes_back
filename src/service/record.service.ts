import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { Record } from '../entity/record.entity';
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

@Provide()
export class RecordService {
  @InjectEntityModel(Record)
  recordModel: Repository<Record>;

  async createRecord(options: ICreateRecordOptions): Promise<Record> {
    const record = this.recordModel.create({
      userId: options.userId,
      typeId: options.typeId,
      date: options.date,
      amount: options.amount,
      type: options.type,
      remark: options.remark || '',
    });
    return this.recordModel.save(record);
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

    return this.recordModel.save(record);
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
}