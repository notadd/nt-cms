import { Injectable, HttpException } from '@nestjs/common';
import { CreateClassify } from '../interfaces/classify.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Classify } from '../entities/classify.entity';
import { Article } from '../entities/article.entity';
import { TreeRepository, Repository, In } from 'typeorm';
import { ClassifyItem } from '../entities/classify-item.entity';
import { Item } from '../entities/item.entity';

@Injectable()
export class ClassifyService {
    constructor(
        @InjectRepository(Classify) private readonly claRepository: TreeRepository<Classify>,
        @InjectRepository(Article) private readonly artRepository: Repository<Article>,
        @InjectRepository(ClassifyItem) private readonly ciRepository: Repository<ClassifyItem>,
        @InjectRepository(Item) private readonly itemRepository: Repository<Item>
    ) { }

    /**
     * 新增文章分类
     *
     * @param classify 新增分类实体
     */
    async addClassify(classify: CreateClassify) {
        try {
            const ignore = await this.claRepository.count();
            if (!classify.parent.id || ignore <= 0) {
                await this.claRepository.save(this.claRepository.create({ name: '总分类', alias: '总分类', onlyChildrenArt: true }));
                return { code: 200, message: '创建成功' };
            }
            if (classify.parent) {
                const exist = await this.claRepository.findOne({ id: classify.parent.id });
                if (!exist) {
                    return { code: 405, message: '当前分类父节点不存在' };
                }
                classify.parent = exist;
            }
            if (classify.alias !== 'all') {
                const result = await this.claRepository.findOne({ where: { alias: classify.alias } });
                if (result) {
                    throw new HttpException('别名重复!', 406);
                }
            }
            const exist = await this.claRepository.save(await this.claRepository.create(classify));
            if (classify.classifyItem) {
                for (const i of classify.classifyItem) {
                    await this.ciRepository.save(this.ciRepository.create({
                        name: i.name,
                        alias: i.alias,
                        required: i.required,
                        order: i.order,
                        classify: exist,
                        item: await this.itemRepository.findOne(i.itemId)
                    }));
                }
            }

        } catch (err) {
            throw new HttpException(err.toString(), 500);
        }
    }

    /**
     * 删除文章分类
     *
     * @param id 文章分类id
     */
    async delClassify(id: number) {
        const classify: Classify = await this.claRepository.findOne({ id });
        if (!classify) {
            return { code: 404, message: '当前分类不存在' };
        }
        const array = await this.getAllClassifyIds(id);
        const articles = await this.artRepository.count({ where: { classify: In(array) } });
        if (articles > 0) {
            throw new HttpException('当前分类下有文章,不能删除', 403);
        }
        array.splice(array.indexOf(id), 1);
        if (array.length) {
            throw new HttpException('当前分类下有子分类,不能删除', 403);
        }
        await this.claRepository.remove(classify);
        return { code: 200, message: '删除成功' };
    }

    /**
     * 获取该分类所有子分类id
     *
     * @param idNum 指定分类id
     */
    async getAllClassifyIds(idNum: number): Promise<number[]> {
        const array: number[] = [];
        const classify = await this.claRepository.findOne({ id: idNum });
        await this.claRepository.findDescendants(classify).then(a => {
            if (a) {
                a.map(a => {
                    array.push(a.id);
                });
            }
        });
        return array;
    }

    /**
     * 修改分类
     *
     * @param classify 被修改分类实体
     */
    async updateClassify(classify: Classify) {
        const exist = await this.claRepository.findOne({ id: classify.id });
        if (!exist) {
            return { code: 404, message: '当前分类不存在!' };
        }
        if (classify.alias && classify.alias !== exist.alias) {
            if (await this.claRepository.findOne({ where: { alias: classify.alias } })) {
                throw new HttpException('该分类别名已存在!', 409);
            }
        }
        const parent = await this.claRepository.findOne({ id: classify.parent.id });
        if (!parent) {
            throw new HttpException('该上级分类不存在', 404);
        }
        try {
            await this.claRepository.save(await this.claRepository.create(classify));
        } catch (err) {
            throw new HttpException(err.toString(), 500);
        }
    }


    /**
     * 查询所有分类
     *
     * @param id 不传时查询所有分类,传了则只查询该分类及其子分类
     */
    async getAllClassify(id: number) {
        if (id) {
            const exist = await this.claRepository.findOne(id);
            if (!exist) {
                throw new HttpException('该分类不存在!', 404);
            }
            // tslint:disable-next-line:max-line-length
            // const result = await this.claRepository.createDescendantsQueryBuilder('classify','classify',exist).orderBy('classify.order','ASC').getMany();
            // console.log(result);
            // return result;
            return await this.claRepository.findDescendantsTree(exist);
        } else {
            return await this.claRepository.findTrees();
        }
    }

    /**
     * 查询分类详情
     *
     * @param id 指定分类id
     */
    async getOneClassify(id: number) {
        const exist = await this.claRepository.findOne({ id });
        if (!exist) {
            throw new HttpException('该分类不存在!', 404);
        }
        const data1 = await this.claRepository.findAncestorsTree(exist);
        const data2 = await this.claRepository.createQueryBuilder('classify').relation(Classify, 'classifyItems').of(id).loadMany();
        const data = {
            id: data1.id,
            name: data1.name,
            alias: data1.alias,
            parent: data1.parent,
            onlyChildrenArt: data1.onlyChildrenArt,
            clasifyItem: data2
        };
        return data;
    }

    /**
     * 获取上级分类
     *
     * @param id 指定分类id
     */
    async getParentClassify(id: number) {
        const exist = await this.claRepository.findOne({ id });
        if (!exist) {
            throw new HttpException('该分类不存在!', 404);
        }
        const data = await this.claRepository.findAncestorsTree(exist);
        return { code: 200, message: '查询成功!', data: [data] };
    }

    /**
     * 移动分类下的文章至另一分类
     *
     * @param classifyId 原分类id
     * @param newClassifyId 需要移至分类id
     */
    async mobileArticles(classifyId: number, newClassifyId: number) {
        const exist = await this.claRepository.findOne({ where: { id: classifyId } });
        if (!exist) {
            return { code: 404, message: '原分类不存在!' };
        }
        const newClassify = await this.claRepository.findOne({ where: { id: newClassifyId } });
        if (!newClassify) {
            return { code: 404, message: '所选分类不存在!' };
        }
        const array = await this.getAllClassifyIds(classifyId);
        const ids = await this.artRepository.createQueryBuilder('art')
            .where('"art"."classifyId" in(:...id)', {
                id: array
            })
            .getMany();
        if (!ids.length) {
            return { code: 404, message: '原分类下不存在文章!' };
        }
        try {
            // 修改文章分类
            for (const i of ids) {
                await this.artRepository.update(i.id, { classify: newClassify });
            }
        } catch (err) {
            throw new HttpException(err.toString(), 500);
        }
    }

}