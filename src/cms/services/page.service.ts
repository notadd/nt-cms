import { Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Page } from '../entities/page.entity';
import { Repository, Like } from 'typeorm';
import { Content } from '../entities/content.entity';
import * as moment from 'moment';
import { PageSort } from '../entities/page-sort.entity';
import { PageInput, PageUpdateInput } from '../interfaces/page.interface';

@Injectable()
export class PageService {
    constructor(
        @InjectRepository(Page) private readonly pageRepo: Repository<Page>,
        @InjectRepository(PageSort) private readonly psRepo: Repository<PageSort>,
        @InjectRepository(Content) private readonly contentRepo: Repository<Content>,
    ) { }

    async createPage(page: PageInput) {
        const ps = await this.psRepo.findOne({ where: { value: page.pageSortAlias } });
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
                pageSort: ps,
                structure: page.structure
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

    async updatePage(page: PageUpdateInput) {
        const exist = await this.pageRepo.findOne(page.id, { relations: ['contents'] });
        const pageSort = await this.psRepo.findOne({ where: { value: page.pageSortAlias } });
        if (!pageSort) {
            throw new HttpException('该页面分类不存在!', 404);
        }
        if (page.alias !== exist.alias) {
            if (await this.pageRepo.findOne({ where: { alias: page.alias, pageSort } })) {
                throw new HttpException('页面别名重复!', 406);
            }
        }
        const same = await this.contentRepo.find({ where: { page: page.id } });
        await this.contentRepo.remove(same);
        await this.pageRepo.save(this.pageRepo.create(page));
    }

    async deletePage(alias: [string]) {
        const pages: number[] = [];
        for (const i of alias) {
            const a = await this.pageRepo.findOne({ where: { alias: i } });
            if (!a) {
                throw new HttpException(`${alias}页面不存在`, 404);
            }
            pages.push(a.id);
        }
        await this.pageRepo.delete(pages);
    }

    async getAllPage(name: string, alias: string, pageNumber: number, pageSize: number) {
        const sqb = this.pageRepo.createQueryBuilder('page')
            .leftJoinAndSelect('page.contents', 'contents')
            .leftJoinAndSelect('page.pageSort', 'pageSort');
        if (name) {
            sqb.andWhere('page.name Like :name', { name: `%${name}%` });
        }
        if (alias) {
            sqb.andWhere('page.alias = :alias', { alias });
        }
        const result = await sqb.skip(pageSize * (pageNumber - 1)).take(pageSize).orderBy({ 'page.lastUpdateTime': 'DESC' }).getManyAndCount();
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
                    name: item.name,
                    alias: item.alias,
                    value: item.value
                };
            }) : [],
            pageSortValue: result.pageSort.value,
            structure: result.structure
        };
        return a;
    }

}