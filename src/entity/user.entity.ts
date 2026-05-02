import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({ schema: 'firelifes', name: 'users', comment: '用户表' })
export class User {
  @PrimaryGeneratedColumn('increment', { comment: '用户ID，主键自增' })
  id: number;

  @Column({ length: 50, unique: true, comment: '用户名，唯一' })
  username: string;

  @Column({ length: 255, comment: '密码（加密存储）' })
  password: string;

  @Column({ name: 'phone', length: 20, unique: true, nullable: true, comment: '手机号' })
  phone: string;

  @Column({ name: 'avatar_url', length: 500, nullable: true, comment: '头像URL' })
  avatarUrl: string;

  @Column({ name: 'nickname', length: 100, nullable: true, comment: '昵称' })
  nickname: string;

  @Column({ name: 'wechat_openid', length: 100, unique: true, nullable: true, comment: '微信OpenID' })
  wechatOpenid: string;

  @Column({ name: 'wechat_unionid', length: 100, unique: true, nullable: true, comment: '微信UnionID' })
  wechatUnionid: string;

  @Column({ type: 'boolean', default: true, comment: '是否启用' })
  isActive: boolean;

  @Column({ name: 'last_login_at', type: 'timestamp', nullable: true, comment: '最后登录时间' })
  lastLoginAt: Date;

  @CreateDateColumn({ name: 'created_at', comment: '注册时间' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', comment: '更新时间' })
  updatedAt: Date;
}
