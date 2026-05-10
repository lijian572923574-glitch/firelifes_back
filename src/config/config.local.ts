import { MidwayConfig } from '@midwayjs/core';
import joi from '@midwayjs/validation-joi';
import 'dotenv/config';
import { Record } from '../entity/record.entity';
import { Category } from '../entity/category.entity';
import { CategoryGroup } from '../entity/category_group.entity';
import { Icon } from '../entity/icon.entity';
import { User } from '../entity/user.entity';
import { UserCategoryCustomization } from '../entity/user_category_customization.entity';
import { UserCategoryGroup } from '../entity/user_category_group.entity';
import { UserIcon } from '../entity/user_icon.entity';
import { SmsCode } from '../entity/sms_code.entity';
import { Ad } from '../entity/ad.entity';
import { Account } from '../entity/account.entity';

export default {
  keys: 'firelifes_local_dev_key_2024',
  koa: {
    port: 7001,
  },
  validation: {
    validators: {
      joi,
    },
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'firelifes_local_jwt_secret_key_2024',
    expiresIn: '7d',
  },
  tencentSms: {
    appId: process.env.TENCENT_SMS_APP_ID || '',
    appKey: process.env.TENCENT_SMS_APP_KEY || '',
    signName: process.env.TENCENT_SMS_SIGN || '',
    templateId: process.env.TENCENT_SMS_TEMPLATE || '',
  },
  typeorm: {
    dataSource: {
      default: {
        type: 'postgres',
        host: process.env.DB_HOST || '111.230.101.3',
        port: parseInt(process.env.DB_PORT || '5432'),
        username: process.env.DB_USERNAME || 'firelifes_dev',
        password: process.env.DB_PASSWORD || 'Lj@pg1991',
        database: process.env.DB_NAME || 'firelifes_dev',
        schema: 'firelifes',
        synchronize: true,
        logging: true,
        entities: [Record, Category, CategoryGroup, Icon, User, UserCategoryCustomization, UserCategoryGroup, UserIcon, SmsCode, Ad, Account],
      },
    },
  },
} as MidwayConfig;
