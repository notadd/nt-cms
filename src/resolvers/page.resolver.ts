import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { Inject } from '@nestjs/common';
import { PageService } from '../services/page.service';
import { PageInput } from '../interfaces/page.interface';
import { Page } from '../entities/page.entity';

@Resolver()
export class PageResolver {
    constructor(
        @Inject(PageService) private readonly pageService: PageService,
    ) { }

    @Query('getAllPage')
    async getAllPage(obj, body: { pageNumber: number, pageSize: number, name: string }) {
        return await this.pageService.getAllPage(body.pageNumber, body.pageSize, body.name);
    }

    @Query('getOnePage')
    async getOnePage(obj, body: { alias: string }) {
        const a = await this.pageService.getOnePage(body.alias);
        return a;
    }

    @Mutation('createPage')
    async createPage(obj, body: { page: PageInput }) {
        return await this.pageService.createPage(body.page);
    }

    @Mutation('updatePage')
    async updatePage(obj, body: { page: Page }) {
        return await this.pageService.updatePage(body.page);
    }

    @Mutation('deletePage')
    async deletePage(obj, body: { id: number }) {
        return await this.pageService.deletePage(body.id);
    }

}