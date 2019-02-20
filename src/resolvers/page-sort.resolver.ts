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
        return await this.psService.getAllPageSort();
    }

    @Query('getOnePageSort')
    async getOnePageSort(obj, body: { id: number }) {
        return await this.psService.getOnePageSort(body.id);
    }

    @Mutation('createPageSort')
    async createPageSort(obj, body: { pageSort: CreatePageSort }) {
        await this.psService.createPageSort(body.pageSort);
        return { code: 200, message: '创建页面分类成功!' };
    }

    @Mutation('updatePageSort')
    async updatePageSort(obj, body: { pageSort: PageSort }) {
        return await this.psService.updatePageSort(body.pageSort);
    }

    @Mutation('deletePageSort')
    async deletePageSort(obj, body: { id: number }) {
        return await this.psService.deletePageSort(body.id);
    }

}
