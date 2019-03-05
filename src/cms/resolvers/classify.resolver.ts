import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { Inject } from '@nestjs/common';
import { ClassifyService } from '../services/classify.service';
import { CreateClassify } from '../interfaces/classify.interface';
import { Classify } from '../entities/classify.entity';

@Resolver()
export class ClassifyResolver {

    constructor(
        private readonly classifyService: ClassifyService,
    ) { }

    @Query('getAllClassify')
    async getAllClassify(obj, body: { id: number }) {
        const result = await this.classifyService.getAllClassify(body.id);
        return { code: 200, message: '查询成功!', data: result };
    }

    @Query('getOneClassify')
    async getOneClassify(obj, body: { value: string }) {
        const result = await this.classifyService.getOneClassify(body.value);
        return { code: 200, message: '查询成功!', data: result };
    }

    @Query('getParentClassify')
    async getParentClassify(obj, body: { id: number }) {
        const data = await this.classifyService.getParentClassify(body.id);
        return { code: 200, message: '查询成功!', data };
    }

    @Mutation('addClassify')
    async addClassify(obj, body: { classify: CreateClassify }) {
        await this.classifyService.addClassify(body.classify);
        return { code: 200, message: '创建分类成功' };
    }

    @Mutation('deleteClassify')
    async  deleteClassify(obj, body: { id: number }) {
        await this.classifyService.delClassify(body.id);
        return { code: 200, message: '删除分类成功' };
    }

    @Mutation('updateClassify')
    async updateClassify(obj, body: { classify: Classify }) {
        await this.classifyService.updateClassify(body.classify);
        return { code: 200, message: '更新分类成功' };
    }

    @Mutation('mobileArticles')
    async mobileArticles(obj, body: { oldId: number, newId: number }) {
        await this.classifyService.mobileArticles(body.oldId, body.newId);
        return { code: 200, message: '移动文章成功!' };
    }

}