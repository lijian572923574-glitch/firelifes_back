import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ schema: 'firelifes', name: 'categories', comment: '二级分类（具体分类）表' })
export class Category {
  @PrimaryColumn({ length: 50, comment: '分类ID，主键' })
  id: string;

  @Column({ length: 50, comment: '分类名称' })
  name: string;

  @Column({ name: 'group_id', type: 'int', comment: '所属一级分类ID，关联category_groups表' })
  groupId: number;

  @Column({ name: 'icon_id', comment: '图标ID，关联icons表，支持用户自定义' })
  iconId: number;

  @Column({ name: 'sort_order', type: 'int', default: 0, comment: '排序序号' })
  sortOrder: number;

  @Column({ name: 'is_default', type: 'boolean', default: true, comment: '是否系统默认分类，false则用户可删除' })
  isDefault: boolean;

  @Column({ length: 10, comment: '类型：income-收入，expense-支出' })
  type: 'income' | 'expense';
}
