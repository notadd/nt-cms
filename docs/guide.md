## 结构设计

### 用户模块
`user`: 用户实体。一个用户可以对应多个`role`,即角色。
`role` 用户角色。一个角色可以对应多个`user`。

### cms模块
`classify`: 文章分类实体。每个分类可以有一个上级分类及多个下级分类。一个文章分类下可以有多篇`article`,即文章。分类除了基本属性外,还可以使用信息项功能生成你所需要的特殊属性。
`article`: 文章实体。每个文章必须属于一个分类。
`page-sort`: 页面分类,同文章分类。
`page`: 页面实体。用来控制页面上展现的内容,如'友情链接'、'关于我们'、'公司介绍'等。

### 插件
`picture-group`: 轮播图组实体。一个轮播图组中有多张图片。可以设置多个轮播图组灵活调用。
`picture`: 图片实体。

## API接口介绍

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

### 轮播图

**Query**:

- `findpG` 通过id查看图片组信息
- `findPicture` 通过id查看图片具体信息

**Mutation**:

- `addPicGroup` 新增图片组
- `addPicture` 新增图片组的图片

tips:系统已自动创建一个根分类,所以用户在创建顶级分类时"上级分类"应传'root',即:
```
    mutation{
        addClassify(classify:{
            label:"分类1",
            value:"classify_1",
            parent:{value:"root"}
        })
        {
            code
            message
        }
    }
```