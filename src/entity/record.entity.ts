import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'records', comment: '记账记录表' })
export class Record {
  @PrimaryGeneratedColumn('increment', { comment: '记录ID，主键自增' })
  id: number;

  @Column({ name: 'user_id', type: 'int', comment: '用户ID，关联users表' })
  userId: number;

  @Column({ name: 'type_id', type: 'int', comment: '分类ID，关联user_category_customizations表' })
  typeId: number;

  @Column({ type: 'date', comment: '记账日期' })
  date: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, comment: '金额，正数为收入，负数为支出' })
  amount: number;

  @Column({ length: 20, comment: '类型：income-收入，expense-支出，transfer-转账，repayment-还债' })
  type: 'income' | 'expense' | 'transfer' | 'repayment';

  @Column({ name: 'account_id', type: 'int', nullable: true, comment: '账户ID，支出/收入时使用的账户，转账/还债时为转出账户' })
  accountId?: number;

  @Column({ name: 'to_account_id', type: 'int', nullable: true, comment: '转账时为转入账户ID，还债时为债权账户ID' })
  toAccountId?: number;

  @Column({ nullable: true, length: 200, comment: '备注/说明' })
  remark: string;

  @CreateDateColumn({ name: 'created_at', comment: '创建时间' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', comment: '更新时间' })
  updatedAt: Date;
}
