import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'category_groups', comment: '一级分类（分类分组）表' })
export class CategoryGroup {
  @PrimaryGeneratedColumn('increment', { comment: '分组ID，主键自增' })
  id: number;

  @Column({ length: 50, comment: '分组名称' })
  name: string;

  @Column({ name: 'sort_order', type: 'int', default: 0, comment: '排序序号' })
  sortOrder: number;

  @CreateDateColumn({ name: 'created_at', comment: '创建时间' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', comment: '更新时间' })
  updatedAt: Date;
}
