## 项目结构

```
.
├── ormconfig.js            数据库配置
├── src
│   ├── cms
│   │   ├── cms.module.ts   cms模块配置
│   │   ├── entities        实体对象
│   │   ├── graphqls        graphql接口
│   │   ├── interfaces      接口定义
│   │   ├── resolvers       resolver层
│   │   └── services        方法实现层
│   ├── interceptors        拦截器
│   └── user
│       ├── auth            用户验证模块
│       ├── user.module.ts  用户模块配置
│       └── utils           工具类
└── starter
    ├── app.module.ts       根模块
    └── main.ts             程序入口文件
```

## 分类信息项

什么是信息项?
我们可以看到,文章中只有标题、摘要、内容等基本属性,如果你想要给某一分类下的文章添加他自己独有的属性,那么就可以使用信息项来完成。
信息项通过`JSON Schema Form`实现,利用JSON自动生成表单。只需在后台编辑分类页面输入相应的JSON,即可在文章页面出现需要填写的项。后期会更新为可视化图形界面,只需拖动相应的表单图形至选项中即可。