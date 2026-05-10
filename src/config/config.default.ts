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
  keys: '1777301155723_3734',
  koa: {
    port: 7001,
  },
  validation: {
    validators: {
      joi,
    },
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'firelifes_jwt_secret_key_2024',
    expiresIn: '7d',
  },
  tencentSms: {
    appId: process.env.TENCENT_SMS_APP_ID || '1401120582',
    appKey: process.env.TENCENT_SMS_APP_KEY || '16ed2f6bc3860942b9b65e3687953ff5',
    signName: process.env.TENCENT_SMS_SIGN || 'fire生活家',
    templateId: process.env.TENCENT_SMS_TEMPLATE || '1234567',
  },
  typeorm: {
    dataSource: {
      default: {
        type: 'postgres',
        host: process.env.DB_HOST || '111.230.101.3',
        port: parseInt(process.env.DB_PORT || '5432'),
        username: process.env.DB_USERNAME || 'firelifes',
        password: process.env.DB_PASSWORD || '4pChWhGGbkYbbMSH',
        database: process.env.DB_NAME || 'firelifes',
        schema: 'firelifes',
        synchronize: true,
        logging: false,
        entities: [Record, Category, CategoryGroup, Icon, User, UserCategoryCustomization, UserCategoryGroup, UserIcon, SmsCode, Ad, Account],
      },
    },
  },
} as MidwayConfig;
