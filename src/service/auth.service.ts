import { Provide, Inject } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { User } from '../entity/user.entity';
import { SmsService } from './sms.service';
import { CategoryService } from './category.service';
import { AccountService } from './account.service';

export interface ILoginOptions {
  username?: string;
  phone?: string;
  password?: string;
  code?: string;
  wechatCode?: string;
  wechatInfo?: { unionid?: string; nickname?: string; avatarUrl?: string };
}

export interface IRegisterOptions {
  phone: string;
  code: string;
  password: string;
  nickname?: string;
}

export interface ITokenPayload {
  userId: number;
  username: string;
}

@Provide()
export class AuthService {
  @InjectEntityModel(User)
  userModel: Repository<User>;

  @Inject()
  smsService: SmsService;

  @Inject()
  categoryService: CategoryService;

  @Inject()
  accountService: AccountService;

  private readonly JWT_SECRET = process.env.JWT_SECRET || 'firelifes_jwt_secret_key_2024';
  private readonly JWT_EXPIRES_IN = '7d';
  private readonly SALT_ROUNDS = 10;

  async register(options: IRegisterOptions): Promise<{ user: Partial<User>; token: string }> {
    const { phone, code, password, nickname } = options;

    const codeValid = await this.smsService.verifyCode(phone, code, 'register');
    if (!codeValid) {
      throw new Error('验证码无效或已过期');
    }

    const existUser = await this.userModel.findOne({
      where: { phone },
    });

    if (existUser) {
      throw new Error('手机号已注册');
    }

    console.log(`[注册] 开始为手机号 ${phone} 创建用户`);

    const hashedPassword = await bcrypt.hash(password, this.SALT_ROUNDS);

    const user = this.userModel.create({
      username: `user_${Date.now()}`,
      password: hashedPassword,
      phone,
      nickname: nickname || phone,
      isActive: true,
    });

    await this.userModel.save(user);
    console.log(`[注册] 用户创建成功，ID: ${user.id}`);

    console.log(`[注册] 开始初始化用户 ${user.id} 的分类数据`);
    await this.categoryService.initUserCategories(user.id);
    console.log(`[注册] 用户 ${user.id} 分类初始化完成`);

    console.log(`[注册] 开始创建用户 ${user.id} 的默认账户`);
    await this.accountService.createDefaultAccounts(user.id);
    console.log(`[注册] 用户 ${user.id} 默认账户创建完成`);

    const token = this.generateToken({
      userId: user.id,
      username: user.username,
    });

    return {
      user: {
        id: user.id,
        username: user.username,
        phone: user.phone,
        nickname: user.nickname,
        avatarUrl: user.avatarUrl,
      },
      token,
    };
  }

  async login(options: ILoginOptions): Promise<{ user: Partial<User>; token: string }> {
    const { username, phone, password, code, wechatCode, wechatInfo } = options;

    let user: User | null = null;

    if (wechatCode) {
      user = await this.handleWechatLogin(wechatCode, wechatInfo);
    } else if (code && phone) {
      const codeValid = await this.smsService.verifyCode(phone, code, 'login');
      if (!codeValid) {
        throw new Error('验证码无效或已过期');
      }
      user = await this.userModel.findOne({ where: { phone } });
      if (!user) {
        console.log(`[验证码登录] 手机号 ${phone} 未注册，创建新用户`);
        const hashedPassword = await bcrypt.hash(`SMS_${code}_${Date.now()}`, this.SALT_ROUNDS);
        user = this.userModel.create({
          username: `user_${Date.now()}`,
          password: hashedPassword,
          phone,
          nickname: `用户${phone.slice(-4)}`,
          isActive: true,
        });
        await this.userModel.save(user);
        console.log(`[验证码登录] 用户创建成功，ID: ${user.id}`);
        await this.categoryService.initUserCategories(user.id);
        console.log(`[验证码登录] 用户 ${user.id} 分类初始化完成`);
        console.log(`[验证码登录] 开始创建用户 ${user.id} 的默认账户`);
        await this.accountService.createDefaultAccounts(user.id);
        console.log(`[验证码登录] 用户 ${user.id} 默认账户创建完成`);
      }
    } else if (password && (username || phone)) {
      user = await this.userModel.findOne({
        where: username ? { username } : { phone },
      });

      if (!user) {
        throw new Error('用户不存在');
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new Error('密码错误');
      }
    } else {
      throw new Error('请提供完整的登录信息');
    }

    if (!user) {
      throw new Error('用户不存在');
    }

    if (!user.isActive) {
      throw new Error('账户已被禁用');
    }

    user.lastLoginAt = new Date();
    await this.userModel.save(user);

    const token = this.generateToken({
      userId: user.id,
      username: user.username,
    });

    return {
      user: {
        id: user.id,
        username: user.username,
        phone: user.phone,
        nickname: user.nickname,
        avatarUrl: user.avatarUrl,
      },
      token,
    };
  }

  private async handleWechatLogin(wechatCode: string, wechatInfo?: { unionid?: string; nickname?: string; avatarUrl?: string }): Promise<User | null> {
    const wechatOpenid = `wechat_${wechatCode}`;

    let user = await this.userModel.findOne({ where: { wechatOpenid } });

    if (!user) {
      user = this.userModel.create({
        username: `wechat_${Date.now()}`,
        password: '',
        wechatOpenid,
        wechatUnionid: wechatInfo?.unionid,
        nickname: wechatInfo?.nickname || `用户${Date.now().toString(36)}`,
        avatarUrl: wechatInfo?.avatarUrl,
        isActive: true,
      });
      await this.userModel.save(user);
      console.log(`[微信登录] 用户创建成功，ID: ${user.id}`);
      await this.categoryService.initUserCategories(user.id);
      console.log(`[微信登录] 用户 ${user.id} 分类初始化完成`);
      console.log(`[微信登录] 开始创建用户 ${user.id} 的默认账户`);
      await this.accountService.createDefaultAccounts(user.id);
      console.log(`[微信登录] 用户 ${user.id} 默认账户创建完成`);
    } else if (wechatInfo) {
      if (wechatInfo.unionid) user.wechatUnionid = wechatInfo.unionid;
      if (wechatInfo.nickname) user.nickname = wechatInfo.nickname;
      if (wechatInfo.avatarUrl) user.avatarUrl = wechatInfo.avatarUrl;
      await this.userModel.save(user);
    }

    return user;
  }

  async bindWechat(userId: number, wechatCode: string, wechatInfo?: { unionid?: string; nickname?: string; avatarUrl?: string }): Promise<User> {
    const user = await this.userModel.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('用户不存在');
    }

    user.wechatOpenid = `wechat_${wechatCode}`;
    if (wechatInfo?.unionid) {
      user.wechatUnionid = wechatInfo.unionid;
    }
    if (wechatInfo?.nickname) {
      user.nickname = wechatInfo.nickname;
    }
    if (wechatInfo?.avatarUrl) {
      user.avatarUrl = wechatInfo.avatarUrl;
    }

    return this.userModel.save(user);
  }

  async bindPhone(userId: number, phone: string, code: string): Promise<User> {
    const codeValid = await this.smsService.verifyCode(phone, code, 'login');
    if (!codeValid) {
      throw new Error('验证码无效或已过期');
    }

    const user = await this.userModel.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('用户不存在');
    }

    const existPhone = await this.userModel.findOne({ where: { phone } });
    if (existPhone && existPhone.id !== userId) {
      throw new Error('手机号已被其他账户绑定');
    }

    user.phone = phone;
    return this.userModel.save(user);
  }

  async changePassword(userId: number, oldPassword: string, newPassword: string): Promise<boolean> {
    const user = await this.userModel.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('用户不存在');
    }

    const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isOldPasswordValid) {
      throw new Error('原密码错误');
    }

    user.password = await bcrypt.hash(newPassword, this.SALT_ROUNDS);
    await this.userModel.save(user);

    return true;
  }

  async logout(userId: number): Promise<void> {
  }

  generateToken(payload: ITokenPayload): string {
    return jwt.sign(payload, this.JWT_SECRET, { expiresIn: this.JWT_EXPIRES_IN });
  }

  verifyToken(token: string): ITokenPayload {
    try {
      return jwt.verify(token, this.JWT_SECRET) as ITokenPayload;
    } catch {
      throw new Error('Token无效或已过期');
    }
  }

  async getUserById(userId: number): Promise<User | null> {
    return this.userModel.findOne({ where: { id: userId } });
  }
}
