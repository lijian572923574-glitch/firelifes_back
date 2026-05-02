import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({ schema: 'firelifes', name: 'icons', comment: '图标表，支持用户自定义图标' })
export class Icon {
  @PrimaryGeneratedColumn('increment', { comment: '图标ID，主键自增' })
  id: number;

  @Column({ length: 100, comment: '图标名称/关键词' })
  name: string;

  @Column({ length: 500, comment: '图标URL或emoji' })
  url: string;

  @Column({ name: 'icon_type', length: 10, default: 'emoji', comment: '图标类型：emoji-emoji表情，image-图片URL' })
  iconType: 'emoji' | 'image';

  @Column({ name: 'sort_order', type: 'int', default: 0, comment: '排序序号' })
  sortOrder: number;

  @CreateDateColumn({ name: 'created_at', comment: '创建时间' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', comment: '更新时间' })
  updatedAt: Date;
}
