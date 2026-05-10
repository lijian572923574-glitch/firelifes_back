import { Entity, Column, PrimaryGeneratedColumn, Index, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export type AccountType = 'cash' | 'investment' | 'fixed_asset' | 'depreciable_asset' | 'liability';

@Entity({ name: 'accounts', comment: '账户表' })
@Index(['userId', 'isDeleted'])
export class Account {
  @PrimaryGeneratedColumn('increment', { comment: '账户ID' })
  id: number;

  @Column({ name: 'user_id', type: 'int', comment: '用户ID' })
  @Index()
  userId: number;

  @Column({ name: 'name', type: 'varchar', length: 100, comment: '账户名称' })
  name: string;

  @Column({ name: 'icon', type: 'varchar', length: 20, comment: '图标' })
  icon: string;

  @Column({ name: 'type', type: 'varchar', length: 30, comment: '账户类型' })
  type: AccountType;

  @Column({ name: 'balance', type: 'decimal', precision: 14, scale: 2, default: 0, comment: '余额' })
  balance: number;

  @Column({ name: 'description', type: 'varchar', length: 500, nullable: true, comment: '说明' })
  description?: string;

  @Column({ name: 'is_default', type: 'boolean', default: false, comment: '是否默认账户' })
  isDefault: boolean;

  @Column({ name: 'order', type: 'int', default: 0, comment: '排序' })
  order: number;

  @Column({ name: 'is_visible', type: 'boolean', default: true, comment: '是否显示' })
  isVisible: boolean;

  @Column({ name: 'is_deleted', type: 'boolean', default: false, comment: '软删除标记' })
  isDeleted: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', comment: '创建时间' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', comment: '更新时间' })
  updatedAt: Date;
}
