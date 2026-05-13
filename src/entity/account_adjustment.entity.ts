import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'account_adjustments', comment: '账户调整记录表' })
export class AccountAdjustment {
  @PrimaryGeneratedColumn('increment', { comment: '记录ID' })
  id: number;

  @Column({ name: 'user_id', type: 'int', comment: '用户ID' })
  userId: number;

  @Column({ name: 'account_id', type: 'int', comment: '账户ID' })
  accountId: number;

  @Column({ name: 'old_balance', type: 'decimal', precision: 14, scale: 2, comment: '调整前余额' })
  oldBalance: number;

  @Column({ name: 'new_balance', type: 'decimal', precision: 14, scale: 2, comment: '调整后余额' })
  newBalance: number;

  @Column({ name: 'adjustment_amount', type: 'decimal', precision: 14, scale: 2, comment: '调整金额' })
  adjustmentAmount: number;

  @Column({ name: 'remark', type: 'varchar', length: 500, nullable: true, comment: '备注' })
  remark?: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', comment: '创建时间' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', comment: '更新时间' })
  updatedAt: Date;
}
