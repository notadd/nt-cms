import { Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Page } from '../entities/page.entity';
import { Repository, Like } from 'typeorm';
import { Content } from '../entities/content.entity';
import * as moment from 'moment';
import { PageSort } from '../entities/page-sort.entity';
import { PageInput } from '../interfaces/page.interface';

@Injectable()
export class PageService {
    constructor(
        @InjectRepository(Page) private readonly pageRepo: Repository<Page>,
        @InjectRepository(PageSort) private readonly psRepo: Repository<PageSort>,
        @InjectRepository(Content) private readonly contentRepo: Repository<Content>,
    ) { }

    async createPage(page: PageInput) {
        const ps = await this.psRepo.findOne(page.pageSortId);
        if (!ps) {
            throw new HttpException('该页面分类不存在!', 404);
        }
        const exist = await this.pageRepo.findOne({ where: { alias: page.alias } });
        if (exist) {
            throw new HttpException('别名重复!', 406);
        }
        const time = moment().format('YYYY-MM-DD HH:mm:ss');
        try {
            const result = await this.pageRepo.save(this.pageRepo.create({
                name: page.name,
                alias: page.alias,
                lastUpdateTime: time,
                pageSort: ps
            }));
            for (const i of page.contents) {
                await this.contentRepo.save(this.contentRepo.create({
                    name: i.name,
                    alias: i.alias,
                    value: i.value,
                    page: result
                }));
            }
        } catch (error) {
            throw new HttpException(error.toString(), 400);
        }
    }

    async updatePage(page: Page) {
        const exist = await this.pageRepo.findOne(page.id, { relations: ['contents'] });
        const pageSort = await this.psRepo.findOne({ where: { id: page.pageSort } });
        if (!pageSort) {
            throw new HttpException('该页面分类不存在!', 404);
        }
        exist.pageSort = pageSort;
        if (page.alias && page.alias !== exist.alias) {
            if (await this.pageRepo.findOne({ where: { alias: page.alias, pageSort: page.pageSort } })) {
                throw new HttpException('页面别名重复!', 406);
            }
        }
        if (page.contents) {
            const same = await this.contentRepo.find({ where: { page: page.id } });
            await this.contentRepo.remove(same);
        }
        await this.pageRepo.save(this.pageRepo.create(page));
    }

    async deletePage(id: number) {
        const exist = await this.pageRepo.findOne(id);
        await this.pageRepo.remove(exist);
    }

    async getAllPage(pageNumber: number, pageSize: number, name: string) {
        const result = await this.pageRepo.findAndCount({
            where: {
                name: Like(`%${name ? name : ''}%`)
            },
            order: { lastUpdateTime: 'DESC' },
            relations: ['contents'],
            skip: pageSize * (pageNumber - 1),
            take: pageSize
        });
        return { data: result[0], total: result[1] };
    }

    async getOnePage(alias: string) {
        const result = await this.pageRepo.findOne({ where: { alias }, relations: ['contents', 'pageSort'] });
        const a = {
            id: result.id,
            name: result.name,
            alias: result.alias,
            lastUpdateTime: result.lastUpdateTime,
            contents: result.contents.length ? result.contents.map(item => {
                return {
                    id: item.id,
                    name: item.name,
                    alias: item.alias,
                    value: item.value
                };
            }) : [],
            pageSortId: result.pageSort.id
        };
        return a;
    }

}