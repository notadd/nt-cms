创建项目需要的数据库并在`ormconfig.js`文件中配置数据库连接;

<details>
<summary>postgres:</summary>

```
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
```
</details>

<details>
<summary>mysql:</summary>

```
    const SOURCE_PATH = process.env.NODE_ENV === 'development' ? 'packages' : 'src';
    module.exports= {
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'test',
        password: 'test',
        database: 'module_test',
        entities: [
            'src/**/**.entity.ts'
        ]
        logging: true,
        synchronize: true
    }
```
</details>
<details>
<summary>sqlite:</summary>


```
    const SOURCE_PATH = process.env.NODE_ENV === 'development' ? 'packages' : 'src';
    module.exports= {
        type: 'sqlite',
        database: 'cms_test.db',
        storage: 'src/entities/*.entity.ts',
        synchronize: true,
        entities:[
            'src/entities/*.entity.ts'
        ]
    }
```
</details>

