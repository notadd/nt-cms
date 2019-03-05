import { Injectable, Inject, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, TreeRepository } from 'typeorm';
import * as moment from 'moment';
import { Article } from '../entities/article.entity';
import { Classify } from '../entities/classify.entity';
import { InputArticle, UpdateArticle, ArtResult } from '../interfaces/article.interface';
import { ClassifyService } from './classify.service';
import { UserService, User } from 'src/user';
const _ = require('underscore');


@Injectable()
export class ArticleService {

    constructor(
        @InjectRepository(Article) private readonly artRepo: Repository<Article>,
        @InjectRepository(Classify) private readonly claRepo: TreeRepository<Classify>,
        @Inject(UserService)
        private readonly userService: UserService,
        @Inject(ClassifyService) private readonly classifyService: ClassifyService,
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
    ) { }


    /**
     * 创建文章
     *
     * @param art 文章实体
     */
    async createArticle(art: InputArticle, owner: number) {
        const classify = await this.claRepo.findOne({ value: art.classify.value });
        if (!classify) {
            throw new HttpException('该文章分类不存在!', 404);
        }
        art.owner = owner;
        art.classify = classify;
        await this.artRepo.save(this.artRepo.create(art));
        // if (art.infoKVs && art.infoKVs.length) {
        //     await this.createOrUpdateArtInfos(exist, art.infoKVs, 'create');
        // }
    }

    // tslint:disable-next-line:max-line-length
    // private async createOrUpdateArtInfos(art: Article, infoKVs: { artInfoKey: string, artInfoValue: string, id?: number }[], action: 'create' | 'update') {
    //     if (infoKVs.length) {
    //         if (action === 'create') {
    //             infoKVs.forEach(async infoKV => {
    //                 await this.aiRepo.save(this.aiRepo.create({ value: infoKV.artInfoValue, article: art, key: infoKV.artInfoKey }));
    //             });
    //             return;
    //         }
    //         infoKVs.forEach(async infoKV => {
    //             if (infoKV.id) {
    //                 this.aiRepo.update(infoKV.id, { value: infoKV.artInfoValue });
    //             } else {
    //                 await this.aiRepo.save(this.aiRepo.create({ value: infoKV.artInfoValue, article: art, key: infoKV.artInfoKey }));
    //             }
    //         });
    //     }
    // }

    /**
     * 修改文章
     *
     * @param art 修改文章实体(有id)
     *
     */
    async updateArticle(art: UpdateArticle, owner: number) {
        try {
            const article = await this.artRepo.findOne(art.id, { relations: ['artInfos'] });
            if (!article) {
                throw new HttpException('该文章不存在!', 404);
            }
            const classify = await this.claRepo.findOne({ value: art.classify.value });
            if (!classify) {
                throw new HttpException('该文章分类不存在!', 404);
            }
            const user = await this.userRepo.findOne({
                where: { id: owner },
                relations: ['roles']
            });
            if (user.roles.length && user.roles[0].id === 1) {
                // 改为待审核状态
                article.status = 0;
            }
            art.classify = classify;
            art.modifyAt = moment().format('YYYY-MM-DD HH:mm:ss');
            await this.artRepo.save(this.artRepo.create(art));
        } catch (error) {
            throw new HttpException(error.toString(), 500);
        }
    }


    /**
     * 批量将文章丢入回收站
     *
     * @param ids 文章id数组
     */
    async recycleArticleByIds(ids: number[]) {
        const articles: number[] = [];
        await this.artRepo.findByIds(ids).then(art => {
            art.map((key, value) => {
                articles.push(key.id);
            });
        });
        const noExist = _.difference(ids, articles);
        if (noExist.length > 0) {
            throw new HttpException(`id为${noExist}的文章不存在`, 404);
        }
        await this.artRepo.update(ids, { recycling: true });
    }

    /**
     * 批量永久删除文章
     *
     * @param ids 文章id数组
     *
     */
    async deleteArticleByIds(ids: number[]) {
        const articles: number[] = [];
        await this.artRepo.findByIds(ids).then(art => {
            art.map((key, value) => {
                articles.push(key.id);
            });
        });
        const noExist = _.difference(ids, articles);
        if (noExist.length > 0) {
            throw new HttpException(`id为${noExist}的文章不存在`, 404);
        }
        await this.artRepo.delete(ids);
    }


    /**
     * 批量恢复回收站中的文章
     *
     * @param ids 文章id数组
     */
    async recoverArticleByIds(ids: number[]) {
        const articles: number[] = [];
        await this.artRepo.findByIds(ids).then(art => {
            art.map((key, value) => {
                articles.push(key.id);
            });
        });
        const noExist = _.difference(ids, articles);
        if (noExist.length > 0) {
            throw new HttpException(`id为${noExist}的文章不存在`, 404);
        }
        await this.artRepo.update(ids, { recycling: false });
    }


    /**
     * 批量审核文章
     *
     * @param ids 审核文章id数组
     * @param status 审核操作.1:通过  2:拒绝
     * @param refuseReason 拒绝原因(拒绝文章时需输入)
     */
    async auditArticle(ids: number[], op: number, refuseReason: string) {
        const articles: number[] = [];
        const arts = await this.artRepo.findByIds(ids);
        arts.forEach((key, value) => {
            articles.push(key.id);
        });
        const noExist = _.difference(ids, articles);
        if (noExist.length > 0) {
            throw new HttpException(`id为${noExist}的文章不存在`, 404);
        }
        switch (op) {
            case 1:
                await this.artRepo.update(ids, { status: op });
                break;
            case 2:
                await this.artRepo.update(ids, { status: op, refuseReason });
                // for (let i = 0; i < ids.length; i++) {
                //     await this.mesRepo.save(this.mesRepo.create({
                //         content: `你的文章《${arts[i].title}》审核未通过,原因如下:${refuseReason}`,
                //         owner: arts[i].userId
                //     }));
                // }
                break;
            default:
                throw new HttpException('status参数错误', 405);
        }
    }

    /**
     * 后台搜索所有文章
     *
     * @param classifyId 文章分类id
     * @param createdAt 开始时间
     * @param endTime 截止时间
     * @param title 文章标题
     * @param username 文章作者用户名
     * @param top 是否置顶
     * @param pageNumber 页数
     * @param pageSize 每页显示数量
     */
    // tslint:disable-next-line:max-line-length
    async getAllArticle(classifyAlias: string, createdAt: string, endTime: string, title: string, username: string, top: boolean, pageNumber: number, pageSize: number) {
        const sqb = this.artRepo.createQueryBuilder('article')
            .where('article.status = :status', { status: 1 })
            .andWhere('article.recycling = false')
            .leftJoinAndSelect('article.classify', 'classify');
        if (classifyAlias) {
            const cla = await this.claRepo.findOne({ where: { value: classifyAlias } });
            if (!cla) {
                throw new HttpException('该分类不存在!', 404);
            }
            sqb.andWhere('article.classify = :classifyId', { classifyId: cla.id });
        }
        if (title) {
            sqb.andWhere('article.title Like :title', { title: `%${title}%` });
        }
        if (username) {
            sqb.andWhere('article.username = :username', { username });
        }
        if (createdAt) {
            const min = new Date(createdAt);
            sqb.andWhere('article.createdAt > :start', { start: min });
        }
        if (endTime) {
            const max = new Date(endTime);
            sqb.andWhere('article.createdAt < :end', { end: max });
        }
        if (top) {
            sqb.andWhere('article.top = :top', { top });
        }
        // tslint:disable-next-line:max-line-length
        const result = await sqb.skip(pageSize * (pageNumber - 1)).take(pageSize).orderBy({ 'article.top': 'DESC', 'article.modifyAt': 'DESC' }).getManyAndCount();
        const exist: ArtResult[] = [];
        for (const i of result[0]) {
            const classify = await this.claRepo.findOne(i.classify);
            const a = {
                id: i.id,
                title: i.title,
                classify,
                sourceUrl: i.sourceUrl,
                cover: i.cover,
                abstract: i.abstract,
                content: i.content,
                top: i.top,
                source: i.source,
                createAt: i.createdAt,
                username,
                status: i.status,
                recycling: i.recycling,
                createdAt: i.createdAt,
                modifyAt: i.modifyAt,
                artInfos: i.artInfos,
                keywords: i.keywords,
                structure: i.structure,
                hidden: i.hidden
            };
            exist.push(a);
        }
        return { exist, total: result[1] };
    }

    async userGetArticles(alias: string, pageNumber: number, pageSize: number) {
        const cla = await this.claRepo.findOne({ where: { value: alias, relations: ['parent'] } });
        const ids: number[] = [];
        if (cla.onlyChildrenArt) {
            const a = await this.classifyService.getAllClassifyIds(cla.id);
            const b = a.splice(a.indexOf(cla.id), 1);
            for (const i of b) {
                ids.push(i);
            }
        }
        else {
            const a = await this.classifyService.getAllClassifyIds(cla.id);
            for (const i of a) {
                ids.push(i);
            }
        }
        const sqb = this.artRepo.createQueryBuilder('article')
            .where('article.status = :status', { status: 1 })
            .andWhere('article.recycling = false')
            .andWhere('article.hidden = false')
            .andWhere('article.classify IN(:...ids)', { ids })
            .leftJoinAndSelect('article.classify', 'classify');
        // tslint:disable-next-line:max-line-length
        const result = await sqb.skip(pageSize * (pageNumber - 1)).take(pageSize).orderBy({ 'article.top': 'DESC', 'article.modifyAt': 'DESC' }).getManyAndCount();
        const exist = [];
        for (const i of result[0]) {
            const classify = await this.claRepo.findOne(i.classify);
            const a = {
                id: i.id,
                title: i.title,
                classify,
                cover: i.cover,
                abstract: i.abstract,
                content: i.content,
                createAt: i.createdAt,
                createdAt: i.createdAt,
                keywords: i.keywords,
                like: i.like,
                sourceUrl: i.sourceUrl,
                source: i.source
            };
            exist.push(a);
        }
        return { total: result[1], exist };
    }

    /**
     * 搜索回收站中文章
     *
     */
    // tslint:disable-next-line:max-line-length
    async getRecycleArticle(classifyAlias: string, createdAt: string, endTime: string, title: string, username: string, top: boolean, pageNumber: number, pageSize: number) {
        const sqb = this.artRepo.createQueryBuilder('article').where('article.recycling = :recycling', { recycling: true });
        if (classifyAlias) {
            const cla = await this.claRepo.findOne({ where: { value: classifyAlias } });
            if (!cla) {
                throw new HttpException('该分类不存在!', 404);
            }
            sqb.andWhere('article.classify = :classifyId', { classifyId: cla.id });
        }
        if (title) {
            sqb.andWhere('article.title Like :title', { title: `%${title}%` });
        }
        if (username) {
            sqb.andWhere('article.username = :username', { username });
        }
        if (createdAt) {
            const min = new Date(createdAt);
            const max = endTime ? new Date(endTime) : new Date();
            sqb.andWhere('article.createdAt > :start', { start: min });
            sqb.andWhere('article.createdAt < :end', { end: max });
        }
        // tslint:disable-next-line:max-line-length
        const result = await sqb.skip(pageSize * (pageNumber - 1)).take(pageSize).orderBy({ 'article.top': 'DESC', 'article.modifyAt': 'DESC' }).getMany();
        const exist: ArtResult[] = [];
        const total = await sqb.getCount();
        for (const i of result) {
            const classify = await this.claRepo.findOne(i.classify);
            const a = {
                id: i.id,
                title: i.title,
                classify,
                sourceUrl: i.sourceUrl,
                cover: i.cover,
                abstract: i.abstract,
                content: i.content,
                top: i.top,
                source: i.source,
                createAt: i.createdAt,
                username,
                status: i.status,
                recycling: i.recycling,
                createdAt: i.createdAt,
                structure: i.structure
            };
            exist.push(a);
        }
        return { exist, total };
    }


    /**
     * 获取文章详情
     *
     * @param id 文章id
     */
    async getArticleById(id: number) {
        const artQb = await this.artRepo.createQueryBuilder('art')
            .leftJoinAndSelect('art.classify', 'classify');

        const art = await artQb.where('art.id = :id', { id }).getOne();
        art.views++;
        const classifyId = art.classify.id;
        const pre = await this.artRepo.createQueryBuilder()
            // tslint:disable-next-line:max-line-length
            .where('"id" = (select max(id) from public.article where "id" < :id and "classifyId" =:classifyId and "status" =:status and "recycling" =:recycling) ',
                { id, classifyId, status: 1, recycling: false }
            )
            .getOne();
        const next = await this.artRepo.createQueryBuilder()
            // tslint:disable-next-line:max-line-length
            .where('"id" = (select min(id) from public.article where "id" > :id and "classifyId" =:classifyId and "status" =:status and "recycling" =:recycling) ',
                { id, classifyId, status: 1, recycling: false }
            )
            .getOne();
        const data = await this.artRepo.save(this.artRepo.create(art));
        // .orderBy('item.order', 'ASC')
        // const data = this.refactorArticle(art, item);
        return { pre: pre ? pre.id : undefined, current: data, next: next ? next.id : undefined };
    }

    /**
     *
     * 搜索获取待审核文章
     *
     */
    // tslint:disable-next-line:max-line-length
    async getCheckArticle(classifyAlias: string, createdAt: string, endTime: string, title: string, username: string, top: boolean, pageNumber: number, pageSize: number) {
        const sqb = this.artRepo.createQueryBuilder('article')
            .where('article.recycling = :recycling', { recycling: false })
            .andWhere('article.status = :status', { status: 0 });
        if (classifyAlias) {
            const cla = await this.claRepo.findOne({ where: { value: classifyAlias } });
            if (!cla) {
                throw new HttpException('该分类不存在!', 404);
            }
            sqb.andWhere('article.classify = :classifyId', { classifyId: cla.id });
        }
        if (title) {
            sqb.andWhere('article.title Like :title', { title: `%${title}%` });
        }
        if (username) {
            sqb.andWhere('article.username = :username', { username });
        }
        if (createdAt) {
            const min = new Date(createdAt);
            const max = endTime ? new Date(endTime) : new Date();
            sqb.andWhere('article.createdAt > :start', { start: min });
            sqb.andWhere('article.createdAt < :end', { end: max });
        }
        const result = await sqb.skip(pageSize * (pageNumber - 1)).take(pageSize).orderBy({ 'article.modifyAt': 'ASC' }).getMany();
        const exist: ArtResult[] = [];
        const total = await sqb.getCount();
        for (const i of result) {
            const classify = await this.claRepo.findOne(i.classify);
            const a = {
                id: i.id,
                title: i.title,
                classify,
                sourceUrl: i.sourceUrl,
                cover: i.cover,
                abstract: i.abstract,
                content: i.content,
                top: i.top,
                source: i.source,
                createAt: i.createdAt,
                username,
                status: i.status,
                recycling: i.recycling,
                createdAt: i.createdAt,
                keywords: i.keywords,
                like: i.like,
                structure: i.structure
            };
            exist.push(a);
        }
        return { exist, total };
    }


    private addDate(dates, days) {
        if (days === undefined || days === '') {
            days = 1;
        }
        const date = new Date(dates);
        date.setDate(date.getDate() + days);
        const month = date.getMonth() + 1;
        const day = date.getDate();
        return date.getFullYear() + '-' + this.getFormatDate(month) + '-' + this.getFormatDate(day);
    }

    private getFormatDate(arg) {
        if (arg === undefined || arg === '') {
            return '';
        }
        let re = arg + '';
        if (re.length < 2) {
            re = '0' + re;
        }
        return re;
    }

}