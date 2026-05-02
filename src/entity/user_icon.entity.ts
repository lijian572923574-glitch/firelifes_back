import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({ schema: 'firelifes', name: 'user_icons', comment: '用户图标表' })
export class UserIcon {
  @PrimaryGeneratedColumn('increment', { comment: '记录ID' })
  id: number;

  @Column({ name: 'user_id', comment: '用户ID' })
  userId: number;

  @Column({ length: 100, comment: '图标名称' })
  name: string;

  @Column({ length: 500, comment: '图标URL或emoji' })
  url: string;

  @Column({ name: 'icon_type', length: 10, default: 'emoji', comment: '图标类型：emoji-emoji，image-图片' })
  iconType: 'emoji' | 'image';

  @Column({ name: 'sort_order', type: 'int', default: 0, comment: '排序' })
  sortOrder: number;

  @Column({ name: 'is_enabled', type: 'boolean', default: true, comment: '是否启用' })
  isEnabled: boolean;

  @CreateDateColumn({ name: 'created_at', comment: '创建时间' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', comment: '更新时间' })
  updatedAt: Date;
}
