# 后端设计

## 文章解析

对于每篇文章的tags和authors，解析完成后和之前数据库中的该文章（若有）进行对比，来选择是增加到tags/author内，还是删除  

默认将文件夹作为category，设置一个default的author  

查询关键字全部用Slug，因为它是唯一不会更改的标示


## Slug生成


### Article

{Category(url编码)}-{Date(YYYY-mm-DD-HH-MM)}

### Author

{Author(url编码)}

### Tag

{Tag(url编码)}

### Category

{Category(url编码)}

## Database写入

