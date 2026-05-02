import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

export type SmsCodeType = 'register' | 'login' | 'reset-password';

@Entity({ schema: 'firelifes', name: 'sms_codes', comment: '短信验证码表' })
export class SmsCode {
  @PrimaryGeneratedColumn('increment', { comment: 'ID，主键自增' })
  id: number;

  @Column({ length: 20, comment: '手机号' })
  phone: string;

  @Column({ length: 10, comment: '验证码' })
  code: string;

  @Column({
    type: 'enum',
    enum: ['register', 'login', 'reset-password'],
    comment: '验证码类型',
  })
  type: SmsCodeType;

  @Column({ name: 'expires_at', type: 'timestamp', comment: '过期时间' })
  expiresAt: Date;

  @Column({ type: 'boolean', default: false, comment: '是否已使用' })
  used: boolean;

  @CreateDateColumn({ name: 'created_at', comment: '创建时间' })
  createdAt: Date;
}
