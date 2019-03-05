import { Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PageSort } from '../entities/page-sort.entity';
import { TreeRepository, In } from 'typeorm';
import { Page } from '../entities/page.entity';
import { CreatePageSort } from '../interfaces/page-sort.interface';

@Injectable()
export class PageSortService {
    constructor(
        @InjectRepository(PageSort) private readonly psRepo: TreeRepository<PageSort>,
        @InjectRepository(Page) private readonly pageRepo: TreeRepository<Page>,
    ) { }

    async createPageSort(pageSort: CreatePageSort) {
        try {
            const ignore = await this.psRepo.count();
            if (!pageSort.parent.value || ignore <= 0) {
                await this.psRepo.save({ label: pageSort.label, value: pageSort.value });
                return { code: 200, message: '创建成功' };
            }
            if (pageSort.parent) {
                const exist = await this.psRepo.findOne({ where: { value: pageSort.parent.value } });
                if (!exist) {
                    throw new HttpException('当前分类父节点不存在!', 404);
                }
                pageSort.parent = exist;
            }
            const result = await this.psRepo.findOne({ where: { value: pageSort.value } });
            if (result) {
                throw new HttpException('别名重复!', 406);
            }
            await this.psRepo.save(this.psRepo.create(pageSort));
        } catch (error) {
            throw new HttpException(error.toString(), 400);
        }
    }

    async updatePageSort(pageSort: PageSort) {
        const exist = await this.psRepo.findOne(pageSort.id, { relations: ['parent'] });
        if (!exist) {
            throw new HttpException('该页面分类不存在!', 404);
        }
        if (pageSort.value && pageSort.value !== exist.value) {
            if (await this.psRepo.findOne({ value: pageSort.value })) {
                throw new HttpException('别名重复!', 406);
            }
        }
        const parent = await this.psRepo.findOne({ where: { value: pageSort.parent.value } });
        if (!parent) {
            throw new HttpException('该上级分类不存在!', 404);
        }
        try {
            pageSort.parent = parent;
            await this.psRepo.save(await this.psRepo.create(pageSort));
        } catch (error) {
            throw new HttpException(error.toString(), 400);
        }
    }

    async deletePageSort(id: number) {
        const pageSort = await this.psRepo.findOne(id);
        if (!pageSort) {
            throw new HttpException('该页面分类不存在!', 404);
        }
        const array = await this.getAllClassifyIds(id);
        const pages = await this.pageRepo.count({ where: { pageSort: In(array) } });
        if (pages > 0) {
            throw new HttpException('当前分类下有页面,不能删除', 403);
        }
        array.splice(array.indexOf(id), 1);
        if (array.length) {
            throw new HttpException('当前分类下有子分类,不能删除', 403);
        }
        await this.psRepo.remove(pageSort);
    }

    async getAllPageSort() {
        return await this.psRepo.findTrees();
    }

    async getOnePageSort(alias: string) {
        const exist = await this.psRepo.findOne({ where: { value: alias } });
        if (!exist) {
            throw new HttpException('该页面分类不存在!', 404);
        }
        const data = await this.psRepo.findDescendantsTree(exist);
        return data;
    }

    async getAllClassifyIds(idNum: number): Promise<number[]> {
        const array: number[] = [];
        const classify = await this.psRepo.findOne({ id: idNum });
        await this.psRepo.findDescendants(classify).then(a => {
            if (a) {
                a.map(a => {
                    array.push(a.id);
                });
            }
        });
        return array;
    }

}