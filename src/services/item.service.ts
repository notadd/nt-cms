import { Injectable, HttpException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { InputItem } from '../interfaces/item.interface';
import { Item } from '../entities/item.entity';

@Injectable()
export class ItemService {
    constructor(
        @InjectRepository(Item) private readonly itemRepo: Repository<Item>,
    ) { }

    /**
     * 创建信息项
     *
     * @param item 创建的信息项实体
     */
    async createItem(item: InputItem) {
        try {
            await this.itemRepo.save(this.itemRepo.create(item));
        } catch (error) {
            throw new HttpException('出现了意外错误' + error.toString(), 500);
        }
    }

    /**
     * 修改信息项
     *
     * @param item 修改的信息项实体
     */
    async updateItem(item: Item) {
        const result = await this.itemRepo.findOne(item.id);
        if (!result) {
            throw new HttpException('该信息项不存在!', 404);
        }
        try {
            await this.itemRepo.update(item.id, item);
        } catch (error) {
            throw new HttpException('出现了意外错误' + error.toString(), 500);
        }
    }

    /**
     * 删除信息项
     *
     * @param id 删除的信息项id
     */
    async deleteItem(id: number) {
        try {
            await this.itemRepo.delete(id);
        } catch (error) {
            throw new HttpException('出现了意外错误' + error.toString(), 500);
        }
    }

    async getAllItem(pageNumber: number, pageSize: number) {
        const result = await this.itemRepo.findAndCount({
            order: { id: 'ASC' },
            skip: (pageNumber - 1) * pageSize,
            take: pageSize,
        });
        return { data: result[0], total: result[1] };
    }

    async getOneItem(id: number) {
        return await this.itemRepo.findOne(id);
    }

}