import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { Inject } from '@nestjs/common';
import { PageSortService } from '../services/page-sort.service';
import { CreatePageSort } from '../interfaces/page-sort.interface';
import { PageSort } from '../entities/page-sort.entity';

@Resolver()
export class PageSortResolver {

    constructor(
        @Inject(PageSortService) private readonly psService: PageSortService,
    ) { }

    @Query('getAllPageSort')
    async getAllPageSort() {
        const data = await this.psService.getAllPageSort();
        return { code: 200, message: '查询成功!', data };
    }

    @Query('getOnePageSort')
    async getOnePageSort(obj, body: { alias: string }) {
        const data = await this.psService.getOnePageSort(body.alias);
        return { code: 200, message: '查询成功!', data };
    }

    @Mutation('createPageSort')
    async createPageSort(obj, body: { pageSort: CreatePageSort }) {
        await this.psService.createPageSort(body.pageSort);
        return { code: 200, message: '创建页面分类成功!' };
    }

    @Mutation('updatePageSort')
    async updatePageSort(obj, body: { pageSort: PageSort }) {
        await this.psService.updatePageSort(body.pageSort);
        return { code: 200, message: '修改成功!' };
    }

    @Mutation('deletePageSort')
    async deletePageSort(obj, body: { id: number }) {
        await this.psService.deletePageSort(body.id);
        return { code: 200, message: '删除成功!' };
    }

}
