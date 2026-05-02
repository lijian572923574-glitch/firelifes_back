import 'dotenv/config';
import { DataSource } from 'typeorm';
import { Record } from './src/entity/record.entity';
import { Category } from './src/entity/category.entity';

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || '111.230.101.3',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'firelifes',
  password: process.env.DB_PASSWORD || '4pChWhGGbkYbbMSH',
  database: process.env.DB_NAME || 'firelifes',
  synchronize: true,
  logging: true,
  entities: [Record, Category],
});

async function initDb() {
  try {
    console.log('正在连接数据库...');
    await dataSource.initialize();
    console.log('✅ 数据库连接成功！');

    // 检查分类表并初始化
    const categoryRepo = dataSource.getRepository(Category);
    const categoryCount = await categoryRepo.count();
    
    if (categoryCount === 0) {
      console.log('正在初始化默认分类...');
      
      const defaultCategories: Category[] = [
        { id: 'expense_food', name: '餐饮', icon: '🍜', type: 'expense', sortOrder: 1 },
        { id: 'expense_shopping', name: '购物', icon: '🛍️', type: 'expense', sortOrder: 2 },
        { id: 'expense_daily', name: '日用', icon: '🧻', type: 'expense', sortOrder: 3 },
        { id: 'expense_transport', name: '交通', icon: '🚌', type: 'expense', sortOrder: 4 },
        { id: 'expense_snack', name: '零食', icon: '🍰', type: 'expense', sortOrder: 5 },
        { id: 'expense_sport', name: '运动', icon: '🚴', type: 'expense', sortOrder: 6 },
        { id: 'expense_entertainment', name: '娱乐', icon: '🎮', type: 'expense', sortOrder: 7 },
        { id: 'expense_communication', name: '通讯', icon: '📱', type: 'expense', sortOrder: 8 },
        { id: 'expense_clothing', name: '服饰', icon: '👔', type: 'expense', sortOrder: 9 },
        { id: 'expense_housing', name: '住房', icon: '🏠', type: 'expense', sortOrder: 10 },
        { id: 'expense_home', name: '居家', icon: '🛋️', type: 'expense', sortOrder: 11 },
        { id: 'expense_children', name: '孩子', icon: '👶', type: 'expense', sortOrder: 12 },
        { id: 'expense_elder', name: '长辈', icon: '👴', type: 'expense', sortOrder: 13 },
        { id: 'expense_social', name: '社交', icon: '💬', type: 'expense', sortOrder: 14 },
        { id: 'expense_travel', name: '旅行', icon: '✈️', type: 'expense', sortOrder: 15 },
        { id: 'expense_digital', name: '数码', icon: '💻', type: 'expense', sortOrder: 16 },
        { id: 'expense_car', name: '汽车', icon: '🚗', type: 'expense', sortOrder: 17 },
        { id: 'expense_medical', name: '医疗', icon: '💊', type: 'expense', sortOrder: 18 },
        { id: 'expense_book', name: '书籍', icon: '📚', type: 'expense', sortOrder: 19 },
        { id: 'expense_study', name: '学习', icon: '🎓', type: 'expense', sortOrder: 20 },
        { id: 'expense_gift_money', name: '礼金', icon: '🧧', type: 'expense', sortOrder: 21 },
        { id: 'expense_gift', name: '礼物', icon: '🎁', type: 'expense', sortOrder: 22 },
        { id: 'expense_office', name: '办公', icon: '💼', type: 'expense', sortOrder: 23 },
        { id: 'expense_repair', name: '维修', icon: '🔧', type: 'expense', sortOrder: 24 },
        { id: 'expense_donate', name: '捐赠', icon: '❤️', type: 'expense', sortOrder: 25 },
        { id: 'expense_lottery', name: '彩票', icon: '🎰', type: 'expense', sortOrder: 26 },
        { id: 'expense_family', name: '亲友', icon: '👨‍👩‍👧‍👦', type: 'expense', sortOrder: 27 },
        { id: 'expense_express', name: '快递', icon: '📦', type: 'expense', sortOrder: 28 },
        { id: 'income_salary', name: '工资', icon: '💼', type: 'income', sortOrder: 1 },
        { id: 'income_bonus', name: '奖金', icon: '🎁', type: 'income', sortOrder: 2 },
        { id: 'income_invest', name: '投资', icon: '📈', type: 'income', sortOrder: 3 },
        { id: 'income_gift_money', name: '礼金', icon: '🧧', type: 'income', sortOrder: 4 },
        { id: 'income_parttime', name: '兼职', icon: '👔', type: 'income', sortOrder: 5 },
        { id: 'income_financial', name: '理财', icon: '💰', type: 'income', sortOrder: 6 },
        { id: 'income_reimburse', name: '报销', icon: '📋', type: 'income', sortOrder: 7 },
        { id: 'income_other', name: '其他', icon: '📦', type: 'income', sortOrder: 8 },
      ];

      await categoryRepo.save(defaultCategories);
      console.log('✅ 默认分类初始化成功！');
    } else {
      console.log('ℹ️ 分类表已有数据，跳过初始化');
    }

    const recordCount = await dataSource.getRepository(Record).count();
    console.log(`ℹ️ 记账记录表记录数: ${recordCount}`);

    await dataSource.destroy();
    console.log('✅ 数据库初始化完成！');
  } catch (error) {
    console.error('❌ 数据库初始化失败:', error);
    process.exit(1);
  }
}

initDb();
