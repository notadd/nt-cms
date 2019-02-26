# Notadd CMS

## 功能

- [x] 文章分类管理
- [x] 文章列表查询
- [x] 文章批量审核
- [x] 文章批量删除
- [x] 页面分类管理
- [x] 页面管理
- [x] 轮播图管理


## 环境要求：

Nodejs: 8+  

数据库： PostgreSQL 9.5+, MariaDB 10.2+, Mysql 5.7+, SQLite, Mongodb, MS SQL Server, Oracle (任意一种)

[1分钟安装环境](#install)

## 使用说明

gitclone源码;
- `git clone https://github.com/notadd/nt-cms.git`

进入项目目录下安装项目依赖

- `npm install`

创建项目需要的数据库并在`ormconfig.js`文件中配置数据库连接;

postgres:
```
    TypeOrmModule.forRoot({
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
    }),
```
mysql:
```
    TypeOrmModule.forRoot({
        type: 'mysql',
        host: 'localhost',
        port: '3306',
        username: 'test',
        password: 'test',
        database: 'test',
        synchronize: true,
        logging: true,
        entities: [
            'src/**/**.entity.ts'
        ]
    }),
```
sqlite: 
```
    TypeOrmModule.forRoot({
        type: 'sqlite',
        database: 'module_test'
    }) 
```

配置完成,运行项目
- `npm run start`
如果没有报错,打开浏览器访问: localhost:3000/graphql

## 实体定义
- `classify`: 文章分类。一个文章分类对应多篇文章。
- `article`: 文章。一篇文章对应一个文章分类。不同分类的文章需要输入的内容可能不同,详见信息项。
- `item`: 信息项。你可以设置你想要文章展示的项,并将其与文章分类相绑定。这样在添加对应分类的文章时,也需要添加该信息项的值。
- `page-sort`: 页面分类。等同于文章分类。
- `page`: 页面。页面的作用是控制页面上需要显示的内容,如:页面footer、header、友情链接、联系我们等部分的内容。
- `pictureGroup`: 轮播图组。可以设置多组轮播图,使其在不同的页面上展示。

## 常用接口介绍

### 文章分类

**Mutation**:

- `addClassify` 添加文章分类
- `deleteClassify` 删除文章分类

**Query**:

-`getAllClassify` 获取全部分类结构
-`getOneClassify` 获取单个文章分类数据

### 文章

**Mutation**:

- `createArticle` 创建文章
- `recycleArticleByIds` 批量将文章放入回收站
- `auditArticle` 批量审核文章

**Query**:

- `getAllArticle` 根据条件分页搜索文章
- `getRecycleArticle` 根据条件搜索回收站文章
- `getArticleById` 通过id获取文章详情

### 信息项

**Mutation**:

- `createItem` 创建信息项
- `deleteItem` 删除信息项

**Query**:

- `getAllItem` 获取所有信息项
- `getOneItem` 通过id获取信息项详情

### 轮播图

**Query**:

- `findpG` 通过id查看图片组信息

**Mutation**:

- `addPicGroup` 新增图片组
- `addPicture` 新增图片组的图片

## 项目结构

.
├── ormconfig.js            数据库配置
├── src
│   ├── cms.module.ts       cms模块配置
│   ├── entities            实体对象
│   ├── graphqls            graphql接口
│   ├── interceptors        拦截器
│   ├── interfaces          接口定义
│   ├── resolvers           resolver层
│   └── services            方法实现层
└── starter
    ├── app.module.ts       根模块
    └── main.ts             程序入口文件



## 环境安装

<span id="install">install</span>

**安装Node.js**

<details>
<summary>Windows</summary>

1. [点击下载 Node.js](https://npm.taobao.org/mirrors/node/v10.15.1/node-v10.15.1-x64.msi)
2. 安装Node.js

Powershell/CMD 可以打印出这个说明安装成功。（部分系统需要重启后环境变量才生效）

```
>> node -v
v10.15.1
>> npm -v
6.4
```
</details>

<details>
<summary>Macos</summary>

1. [点击下载 Node.js](https://npm.taobao.org/mirrors/node/v10.15.1/node-v10.15.1.pkg)
2. 安装Node.js

打印出这个说明安装成功。（部分系统需要重启后环境变量才生效）
```
>> node -v
v10.15.1
>> npm -v
6.4
```
</details>


<details>
<summary>Ubuntu/Debian （支持ARM及X86平台）</summary>

```
curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
sudo apt-get install -y nodejs
```
（如果安装缓慢，可以使用[国内镜像源](http://mirrors.ustc.edu.cn/help/nodesource.html)）
终端可以打出以下信息说明安装成功：
```
$ node -v
v10.15.1
$ npm -v
6.4
```
</details>

<details>
<summary>Centos/Redhat/Fedora （支持X86平台）</summary>

```
curl -sL https://rpm.nodesource.com/setup_10.x | bash -
```
（如果安装缓慢，可以使用[国内镜像源](http://mirrors.ustc.edu.cn/help/nodesource.html)）
终端可以打出以下信息说明安装成功：
```
$ node -v
v10.15.1
$ npm -v
6.4
```
</details>

<details>
<summary>使用 NVM 安装（支持 所有 Linux 及 Raspbian ，支持多版本管理）</summary>

```
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.34.0/install.sh | bash

```
如果没 curl ，可以使用 wget 安装
```
wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.34.0/install.sh | bash
```
使用 NVM 安装nodejs ：
```
nvm install --lts
```
终端可以打出以下信息说明安装成功：
```
$ node -v
v10.15.1
$ npm -v
6.4
```
</details>

<details>
<summary>使用 snap 安装（支持 所有 Linux ）</summary>

```
sudo snap install node --classic --channel=10

```
（如果提示 snap 不存在，请先安装 snapd）
终端可以打出以下信息说明安装成功：
```
$ node -v
v10.15.1
$ npm -v
6.4
```
</details>




**安装数据库**

<details>
<summary>Postgresql （推荐）</summary>

Windows 和 Mac 用户 [点击下载安装包](https://www.enterprisedb.com/downloads/postgres-postgresql-downloads)

Linux 用户使用 apt/yum 等直接安装:

```
apt install  postgresql
```
或者使用 snap :

```
snap install postgresql10
```
如果要开外部访问，以及其他配置，请参考 [postgresql配置]()
</details>
Sqlite3 无需安装，Mysql 及 其他数据库 请参考官方文档自行安装。


