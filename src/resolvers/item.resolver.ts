import { Resolver, Mutation, Args } from '@nestjs/graphql';
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
        return await this.itemService.createItem(body.item);
    }

    @Mutation('updateItem')
    async updateItem(obj, body: { item: Item }) {
        return await this.itemService.updateItem(body.item);
    }

    @Mutation('deleteItem')
    async deleteItem(obj, body: { id: number }) {
        return await this.itemService.deleteItem(body.id);
    }

}