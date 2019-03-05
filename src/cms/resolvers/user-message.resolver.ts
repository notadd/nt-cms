import { Resolver, Query, Mutation } from '@nestjs/graphql';
import { Inject } from '@nestjs/common';
import { UserMessageService } from '../services/user-message.service';

@Resolver()
export class UserMessageResolver {
    constructor(
        @Inject(UserMessageService)
        private readonly adService: UserMessageService,
    ) { }


    @Query('findNoread')
    async findNoread(req, abc) {
        const data = await this.adService.findNoread(abc.id);
        return { code: 200, message: '查询成功!', data };
    }

    // 通过用户id查询所有个人消息
    @Query('findAdvices')
    async findAll(req, body: { id: number, pageNumber: number, pageSize: number }) {
        const data = (await this.adService.findAll(body.id, body.pageNumber, body.pageSize)).data;
        const total = (await this.adService.findAll(body.id, body.pageNumber, body.pageSize)).total;
        return { code: 200, message: '查询成功!', total, data };
    }

    // 通过id查看个人消息
    @Query('findAdvice')
    async findOne(req, abc) {
        const data = await this.adService.findOne(abc.id);
        return { code: 200, message: '查询成功!', data };
    }

    // 将消息设为已读
    @Mutation('readAdvice')
    async readOne(req, abc) {
        await this.adService.readOne(abc.id);
        return { code: 200, message: '设置成功!' };
    }

    // 通过用户id将所有消息设为已读
    @Mutation('readAdvices')
    async readAll(req, abc) {
        await this.adService.readAll(abc.owner);
        return { code: 200, message: '设置成功!' };
    }

    // 删除一条消息
    @Mutation('delAdvice')
    async del(req, abc) {
        await this.adService.del(abc.id);
        return { code: 200, message: '删除消息成功!' };
    }

    // 通过id批量删除
    @Mutation('delAdvices')
    async dels(req, body: { ids: [number] }) {
        await this.adService.dels(body.ids);
        return { code: 200, message: '删除多条消息成功!' };
    }

}