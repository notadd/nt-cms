import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { Inject } from '@nestjs/common';
import { ItemService } from '../services/item.service';
import { InputItem } from '../interfaces/item.interface';
import { Item } from '../entities/item.entity';

@Resolver()
export class ItemResolver {

    constructor(
        @Inject(ItemService) private readonly itemService: ItemService,
    ) { }

    @Mutation('createItem')
    async createItem(obj, body: { item: InputItem }) {
        await this.itemService.createItem(body.item);
        return { code: 200, message: '创建成功!' };
    }

    @Mutation('updateItem')
    async updateItem(obj, body: { item: Item }) {
        await this.itemService.updateItem(body.item);
        return { code: 200, message: '修改成功!' };
    }

    @Mutation('deleteItem')
    async deleteItem(obj, body: { id: number }) {
        await this.itemService.deleteItem(body.id);
        return { code: 200, message: '删除成功!' };
    }

    @Query('getAllItem')
    async getAllItem(obj, body: { pageNumber: number, pageSize: number }) {
        const result = await this.itemService.getAllItem(body.pageNumber, body.pageSize);
        return { code: 200, message: '查询成功!', data: result.data, total: result.total };
    }

    @Query('getOneItem')
    async getOneItem(obj, body: { id: number }) {
        const data = await this.itemService.getOneItem(body.id);
        return { code: 200, message: '查询成功!', data };
    }

}