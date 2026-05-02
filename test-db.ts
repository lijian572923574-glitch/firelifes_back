import 'dotenv/config';
import { DataSource } from 'typeorm';
import { Record } from './src/entity/record.entity';
import { Category } from './src/entity/category.entity';
import { CategoryGroup } from './src/entity/category_group.entity';
import { Icon } from './src/entity/icon.entity';

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || '111.230.101.3',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'firelifes',
  password: process.env.DB_PASSWORD || '4pChWhGGbkYbbMSH',
  database: process.env.DB_NAME || 'firelifes',
  schema: 'firelifes',
  synchronize: true,
  logging: true,
  entities: [Record, Category, CategoryGroup, Icon],
});

async function testConnection() {
  try {
    console.log('正在连接数据库...');
    await dataSource.initialize();
    console.log('✅ 数据库连接成功！');

    const queryRunner = dataSource.createQueryRunner();
    const tables = await queryRunner.query(`
      SELECT table_schema, table_name
      FROM information_schema.tables
      WHERE table_schema = 'firelifes'
      ORDER BY table_name
    `);

    console.log('\n📋 firelifes schema 下的表:');
    tables.forEach(t => {
      console.log(`   - ${t.table_schema}.${t.table_name}`);
    });

    // 检查每个表的记录数
    const tablesInfo = ['icons', 'category_groups', 'categories', 'records'];
    for (const table of tablesInfo) {
      try {
        const result = await queryRunner.query(`SELECT COUNT(*) as count FROM "${table}"`);
        console.log(`   ${table}: ${result[0].count} 条记录`);
      } catch (e) {
        console.log(`   ${table}: 表不存在或查询失败`);
      }
    }

    await dataSource.destroy();
    console.log('\n✅ 测试完成');
  } catch (error) {
    console.error('❌ 失败:', error);
    process.exit(1);
  }
}

testConnection();
