import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity({ schema: 'firelifes', name: 'ads', comment: '广告表' })
export class Ad {
  @PrimaryGeneratedColumn('increment', { comment: 'ID，主键自增' })
  id: number;

  @Column({ name: 'image_url', length: 500, comment: '广告图片URL' })
  imageUrl: string;

  @Column({ name: 'link_url', length: 500, nullable: true, comment: '点击跳转链接' })
  linkUrl: string;

  @Column({ type: 'int', default: 3, comment: '展示时长（秒）' })
  duration: number;

  @Column({ name: 'start_time', type: 'timestamp', nullable: true, comment: '生效开始时间' })
  startTime: Date;

  @Column({ name: 'end_time', type: 'timestamp', nullable: true, comment: '生效结束时间' })
  endTime: Date;

  @Column({
    type: 'enum',
    enum: ['active', 'inactive'],
    default: 'active',
    comment: '状态',
  })
  status: 'active' | 'inactive';

  @Column({ type: 'int', default: 0, comment: '排序' })
  sort: number;

  @CreateDateColumn({ name: 'created_at', comment: '创建时间' })
  createdAt: Date;
}
