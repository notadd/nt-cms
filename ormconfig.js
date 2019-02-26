const SOURCE_PATH = process.env.NODE_ENV === 'development' ? 'packages' : 'src';
module.exports= {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: '123456',
  database: 'module_test',
  entities: ['src/**/**.entity.ts', 'node_modules/**/**.entity.js'],
  logger: 'advanced-console',
  logging: true,
  synchronize: true,
  dropSchema: false
}
