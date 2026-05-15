import { Entity, Column, PrimaryGeneratedColumn, Index, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export type DepreciatingCategory =
  | 'phone'
  | 'computer'
  | 'camera'
  | 'appliance'
  | 'footwear'
  | 'furniture'
  | 'bag'
  | 'sports'
  | 'other';

export type DepreciationMethod = 'straight-line' | 'double-declining-balance';

@Entity({ name: 'depreciating_assets', comment: '折旧资产表' })
@Index(['userId', 'status'])
export class DepreciatingAsset {
  @PrimaryGeneratedColumn('increment', { comment: '资产ID，主键自增' })
  id: number;

  @Column({ name: 'user_id', type: 'int', comment: '用户ID，关联users表' })
  @Index()
  userId: number;

  @Column({ name: 'record_id', type: 'int', nullable: true, comment: '关联的记账记录ID' })
  recordId?: number;

  @Column({ name: 'name', type: 'varchar', length: 100, comment: '资产名称' })
  name: string;

  @Column({ name: 'category', type: 'varchar', length: 30, comment: '品类标签' })
  category: DepreciatingCategory;

  @Column({ name: 'depreciation_method', type: 'varchar', length: 30, comment: '折旧方法' })
  depreciationMethod: DepreciationMethod;

  @Column({ name: 'purchase_price', type: 'decimal', precision: 12, scale: 2, comment: '购入价' })
  purchasePrice: number;

  @Column({ name: 'purchase_date', type: 'date', comment: '购入日期' })
  purchaseDate: string;

  @Column({ name: 'expected_life_months', type: 'int', comment: '计划使用月数' })
  expectedLifeMonths: number;

  @Column({ name: 'residual_value', type: 'decimal', precision: 12, scale: 2, comment: '预期残值' })
  residualValue: number;

  @Column({ name: 'current_value', type: 'decimal', precision: 12, scale: 2, comment: '当前价值' })
  currentValue: number;

  @Column({ name: 'monthly_depreciation', type: 'decimal', precision: 12, scale: 2, comment: '月折旧额' })
  monthlyDepreciation: number;

  @Column({ name: 'used_months', type: 'int', default: 0, comment: '已使用月数' })
  usedMonths: number;

  @Column({ name: 'status', type: 'varchar', length: 20, default: 'active', comment: '状态：active-使用中，disposed-已处置' })
  status: 'active' | 'disposed';

  @Column({ name: 'disposal_method', type: 'varchar', length: 20, nullable: true, comment: '处置方式' })
  disposalMethod?: string;

  @Column({ name: 'disposal_date', type: 'date', nullable: true, comment: '处置日期' })
  disposalDate?: string;

  @Column({ name: 'disposal_price', type: 'decimal', precision: 12, scale: 2, nullable: true, comment: '卖出价格' })
  disposalPrice?: number;

  @Column({ name: 'disposal_note', type: 'varchar', length: 500, nullable: true, comment: '处置备注' })
  disposalNote?: string;

  @CreateDateColumn({ name: 'created_at', comment: '创建时间' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', comment: '更新时间' })
  updatedAt: Date;
}
