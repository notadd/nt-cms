import { Resolver, Args, Mutation } from '@nestjs/graphql';
import { Inject } from '@nestjs/common';
import { ClassifyItemService } from '../services/classify-item.service';
import { CreateClassifyItem, ClassifyItemInput } from '../interfaces/classify-item.interface';


@Resolver()
export class ClassifyItemResolver {

    constructor(
        @Inject(ClassifyItemService) private readonly ciService: ClassifyItemService
    ) { }

    @Mutation('createClassifyItem')
    async createClassifyItem(obj, body: { classifyItem: CreateClassifyItem }) {
        return await this.ciService.createClassifyItem(body.classifyItem);
    }

    @Mutation('updateClassifyItem')
    async updateClassifyItem(obj, body: { classifyItem: ClassifyItemInput }) {
        return await this.ciService.updateClassifyItem(body.classifyItem);
    }

    @Mutation('deleteClassifyItem')
    async deleteClassifyItem(obj, body: { id: number }) {
        return await this.ciService.deleteClassifyItem(body.id);
    }

}