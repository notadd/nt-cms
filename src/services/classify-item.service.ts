import { Injectable, HttpException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ClassifyItem } from '../entities/classify-item.entity';
import { ClassifyItemInput, CreateClassifyItem } from '../interfaces/classify-item.interface';
import { ArtInfo } from '../entities/art-info.entity';
import { Item } from '../entities/item.entity';
import { Article } from '../entities/article.entity';
import { Classify } from '../entities/classify.entity';

@Injectable()
export class ClassifyItemService {
    constructor(
        @InjectRepository(ClassifyItem) private readonly ciRepo: Repository<ClassifyItem>,
        @InjectRepository(Item) private readonly itemRepo: Repository<Item>,
        @InjectRepository(Classify) private readonly claRepo: Repository<Classify>,
        @InjectRepository(ArtInfo) private readonly aiRepo: Repository<ArtInfo>,
        @InjectRepository(Article) private readonly artRepo: Repository<Article>,
    ) { }


    /**
     * 修改文章分类中的信息项
     *
     * @param classifyItem 需要修改的实体
     */
    async updateClassifyItem(classifyItem: ClassifyItemInput) {
        const exist = await this.ciRepo.findOne(classifyItem.id);
        const classify = await this.claRepo.findOne(classifyItem.classifyId);
        if (!exist) {
            throw new HttpException('该信息项不存在!', 404);
        }
        if (!classify) {
            throw new HttpException('该文章分类不存在!', 404);
        }
        if (classifyItem.alias && classifyItem.alias !== exist.alias) {
            if (await this.ciRepo.findOne({ where: { alias: classifyItem.alias, classify } })) {
                throw new HttpException('别名重复!', 406);
            }
        }
        const item = await this.itemRepo.findOne(classifyItem.itemId);
        await this.ciRepo.save(this.ciRepo.create({
            id: classifyItem.id,
            name: classifyItem.name,
            alias: classifyItem.alias,
            item,
            order: classifyItem.order,
            required: classifyItem.required,
            classify
        }));
    }

    /**
     * 删除文章分类中的信息项
     *
     * @param id 文章中信息项的id
     *
     */
    async deleteClassifyItem(id: number) {
        const exist = await this.ciRepo.findOne(id, { relations: ['classify', 'item'] });
        if (!exist) {
            throw new HttpException('该信息项不存在!', 404);
        }
        const arts = await this.artRepo.find({ where: { classify: exist.classify.id } });
        const ids = arts.map(item => item.id);
        const infos = await this.aiRepo.createQueryBuilder('artInfo')
            .leftJoinAndSelect('artInfo.article', 'Article')
            .where('artInfo.item = :item', { item: exist.item.id })
            .andWhere('Article.id IN(:...ids)', { ids })
            .getMany();
        await this.aiRepo.remove(infos);
        await this.ciRepo.remove(exist);
    }

    async createClassifyItem(classifyItem: CreateClassifyItem) {
        await this.ciRepo.save(this.ciRepo.create({
            name: classifyItem.name,
            alias: classifyItem.alias,
            item: await this.itemRepo.findOne(classifyItem.itemId),
            order: classifyItem.order,
            required: classifyItem.required,
            classify: await this.claRepo.findOne(classifyItem.classifyId)
        }));
    }

}