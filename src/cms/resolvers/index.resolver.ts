import { Mutation, Query, Resolver, } from '@nestjs/graphql';
import { Index } from '../entities/index.entity';
import { IndexService } from '../services/index.service';

@Resolver()
export class IndexResolver {
    constructor(
        private readonly indexService: IndexService
    ) { }

    @Query('getIndex')
    async getIndex() {
        const result = await this.indexService.getIndex();
        return { code: 200, message: '查询成功!', data: result };
    }

    @Mutation('updateIndex')
    async updateIndex(obj, body: { index: Index }, context) {
        await this.indexService.updateIndex(body.index);
        return { code: 200, message: '修改成功!' };
    }

}