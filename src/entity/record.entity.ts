import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({ schema: 'firelifes', name: 'records', comment: '记账记录表' })
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

  @Column({ length: 10, comment: '类型：income-收入，expense-支出' })
  type: 'income' | 'expense';

  @Column({ nullable: true, length: 200, comment: '备注/说明' })
  remark: string;

  @CreateDateColumn({ name: 'created_at', comment: '创建时间' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', comment: '更新时间' })
  updatedAt: Date;
}
