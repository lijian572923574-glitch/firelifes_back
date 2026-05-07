import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { UserIcon } from './user_icon.entity';

@Entity({ name: 'user_category_customizations', comment: '用户分类定制表' })
export class UserCategoryCustomization {
  @PrimaryGeneratedColumn('increment', { comment: '记录ID' })
  id: number;

  @Column({ name: 'user_id', comment: '用户ID' })
  userId: number;

  @Column({ length: 50, comment: '分类名称' })
  name: string;

  @Column({ name: 'icon_id', type: 'int', comment: '图标ID，关联user_icons表' })
  iconId: number;

  @ManyToOne(() => UserIcon)
  @JoinColumn({ name: 'icon_id' })
  icon: UserIcon;

  @Column({ length: 10, comment: '类型：income-收入，expense-支出' })
  type: 'income' | 'expense';

  @Column({ name: 'group_id', type: 'int', comment: '所属大类ID，关联user_category_groups表' })
  groupId: number;

  @Column({ name: 'sort_order', type: 'int', default: 0, comment: '排序' })
  sortOrder: number;

  @Column({ name: 'is_enabled', type: 'boolean', default: true, comment: '是否启用' })
  isEnabled: boolean;

  @Column({ name: 'is_user_created', type: 'boolean', default: false, comment: '是否用户自创' })
  isUserCreated: boolean;

  @CreateDateColumn({ name: 'created_at', comment: '创建时间' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', comment: '更新时间' })
  updatedAt: Date;
}
