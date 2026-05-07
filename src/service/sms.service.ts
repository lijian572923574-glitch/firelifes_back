import { Provide, Config } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { SmsCode, SmsCodeType } from '../entity/sms_code.entity';

export interface TencentSmsConfig {
  appId: string;
  appKey: string;
  signName: string;
  templateId: string;
}

@Provide()
export class SmsService {
  @InjectEntityModel(SmsCode)
  smsCodeModel: Repository<SmsCode>;

  @Config('tencentSms')
  tencentSmsConfig: TencentSmsConfig;

  private readonly CODE_EXPIRES_MINUTES = 5;
  private readonly SEND_INTERVAL_SECONDS = 60;
  private readonly MAX_SEND_PER_DAY = 100;

  async sendCode(phone: string, type: SmsCodeType): Promise<string> {
    const now = new Date();

    const lastCode = await this.smsCodeModel.findOne({
      where: { phone },
      order: { createdAt: 'DESC' },
    });

    if (lastCode) {
      const secondsSinceLastSend = (now.getTime() - lastCode.createdAt.getTime()) / 1000;
      if (secondsSinceLastSend < this.SEND_INTERVAL_SECONDS) {
        throw new Error('发送太频繁，请稍后再试');
      }

      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const todayCount = await this.smsCodeModel.count({
        where: {
          phone,
          createdAt: LessThan(todayStart),
        },
      });

      if (todayCount >= this.MAX_SEND_PER_DAY) {
        throw new Error('今日发送次数已达上限');
      }
    }

    const code = this.generateCode();
    const expiresAt = new Date(now.getTime() + this.CODE_EXPIRES_MINUTES * 60 * 1000);

    const smsCode = this.smsCodeModel.create({
      phone,
      code,
      type,
      expiresAt,
      used: false,
    });

    await this.smsCodeModel.save(smsCode);

    console.log(`\n========== 短信验证码 ==========`);
    console.log(`📱 手机号: ${phone}`);
    console.log(`🔢 验证码: ${code}`);
    console.log(`⏰ 有效期: ${this.CODE_EXPIRES_MINUTES} 分钟`);
    console.log(`📋 类型: ${type}`);
    console.log(`================================\n`);

    try {
      await this.sendSmsViaTencent(phone, code);
    } catch (error) {
      console.warn('⚠️ 腾讯云短信发送失败（调试模式）:', error);
    }

    return code;
  }

  async verifyCode(phone: string, code: string, type: SmsCodeType): Promise<boolean> {
    const now = new Date();

    const smsCode = await this.smsCodeModel.findOne({
      where: { phone, code, type, used: false },
      order: { createdAt: 'DESC' },
    });

    if (!smsCode) {
      return false;
    }

    if (smsCode.expiresAt < now) {
      return false;
    }

    smsCode.used = true;
    await this.smsCodeModel.save(smsCode);

    return true;
  }

  private generateCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  private async sendSmsViaTencent(phone: string, code: string): Promise<void> {
    const { appId, appKey, signName, templateId } = this.tencentSmsConfig;

    const SmsSender = require('qcloudsms-js').SmsSingleSender;

    const sender = new SmsSender(appId, appKey);

    const params = [code, '5'];

    return new Promise((resolve, reject) => {
      sender.sendWithParam(
        '86',
        phone,
        parseInt(templateId),
        params,
        signName,
        '',
        '',
        (err: any, result: any) => {
          if (err) {
            reject(err);
          } else {
            console.log(`✅ 腾讯云短信发送成功: ${JSON.stringify(result)}`);
            resolve(result);
          }
        }
      );
    });
  }
}
