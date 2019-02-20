import { Inject } from '@nestjs/common';
import { Resolver, Mutation, Query } from '@nestjs/graphql';
import { PictureGroup } from '../entities/pictureGroup.entity';
import { Picture } from '../entities/picture.entity';
import { PicGroupService } from '../services/picGroup.service';

@Resolver('picGroupResolver')
// tslint:disable-next-line:class-name
export class picGroupResolver {
    constructor(
        @Inject(PicGroupService)
        private readonly pGService: PicGroupService,
    ) { }

    @Query('findpGs')
    async findpGs(req, body: { currentPage: number, pageSize: number }) {
        const data = (await this.pGService.findpGs(body.currentPage, body.pageSize)).data;
        const total = (await this.pGService.findpGs(body.currentPage, body.pageSize)).total;
        return { code: 200, message: '查询成功!', total, data };
    }

    @Query('findpG')
    async findpG(req, abc) {
        const data = await this.pGService.findOne(abc.id);
        return { code: 200, message: '查询成功!', data };
    }

    @Mutation('addPicGroup')
    async save(req, abc) {
        await this.pGService.addPicGroup(abc.name);
        return { code: 200, message: '创建成功' };
    }


    @Mutation('addPicture')
    async addPicture(req, body: { pic: Picture, id: number }) {
        await this.pGService.addPicture(body.id, body.pic);
        return { code: 200, message: '添加成功' };
    }

    @Mutation('updatePicture')
    async updatePicture(req, body: { pic: Picture }) {
        await this.pGService.updatePicture(body.pic);
        return { code: 200, message: '修改成功' };
    }

    @Mutation('delPicture')
    async delPicture(req, abc) {
        await this.pGService.delPicture(abc.id);
        return { code: 200, message: '删除成功' };
    }

    @Mutation('delPicGroup')
    async delPicGroup(req, abc) {
        await this.pGService.delPicGroup(abc.id);
        return { code: 200, message: '删除成功' };
    }

    @Mutation('updatePicGroup')
    async updatePicGroup(req, body: { pG: PictureGroup }) {
        await this.pGService.updatePicGroup(body.pG);
        return { code: 200, message: '修改成功' };
    }

}