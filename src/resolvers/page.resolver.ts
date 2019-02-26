import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { Inject } from '@nestjs/common';
import { PageService } from '../services/page.service';
import { PageInput, PageUpdateInput } from '../interfaces/page.interface';
import { Page } from '../entities/page.entity';

@Resolver()
export class PageResolver {
    constructor(
        @Inject(PageService) private readonly pageService: PageService,
    ) { }

    @Query('getAllPage')
    async getAllPage(obj, body: { name: string, alias: string, pageNumber: number, pageSize: number}) {
        const result = await this.pageService.getAllPage(body.name, body.alias, body.pageNumber, body.pageSize);
        return { code: 200, message: '查询成功!', data: result.data, total: result.total };
    }

    @Query('getOnePage')
    async getOnePage(obj, body: { alias: string }) {
        const a = await this.pageService.getOnePage(body.alias);
        return { code: 200, message: '查询成功!', data: a };
    }

    @Mutation('createPage')
    async createPage(obj, body: { page: PageInput }) {
        await this.pageService.createPage(body.page);
        return { code: 200, message: '创建成功!' };
    }

    @Mutation('updatePage')
    async updatePage(obj, body: { page: PageUpdateInput }) {
        await this.pageService.updatePage(body.page);
        return { code: 200, message: '修改成功!' };
    }

    @Mutation('deletePage')
    async deletePage(obj, body: { alias: [string] }) {
        await this.pageService.deletePage(body.alias);
        return { code: 200, message: '删除成功!' };
    }

}