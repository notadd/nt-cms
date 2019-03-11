import { Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PictureGroup } from '../entities/picture-group.entity';
import { Repository } from 'typeorm';
import { Picture } from '../entities/picture.entity';

@Injectable()
export class PicGroupService {
    constructor(
        @InjectRepository(PictureGroup)
        private readonly pGRepo: Repository<PictureGroup>,
        @InjectRepository(Picture)
        private readonly picRepo: Repository<Picture>,
    ) { }

    async findpGs(currentPage: number, pageSize: number) {
        const data = await this.pGRepo.find({
            relations: ['pictures'],
            order: { id: 'ASC' },
            skip: (currentPage - 1) * pageSize,
            take: pageSize,
        });
        const total = await this.pGRepo.count();
        return { data, total };
    }

    async findOne(id: number) {
        const data = await this.pGRepo.findOne({
            where: { id },
            relations: ['pictures'],
        });
        return data;
    }

    async addPicture(id: number, pic: Picture) {
        const picGroup = await this.pGRepo.create(await this.pGRepo.findOne(id));
        await this.picRepo.save({
            name: pic.name,
            title: pic.title,
            Url: pic.Url,
            sequence: pic.sequence,
            pictureGroup: picGroup
        });
        return 'success';
    }

    async updatePicture(pic: Picture) {
        await this.picRepo.save(await this.picRepo.create(pic));
        return 'success';
    }

    async delPicture(id: number) {
        await this.picRepo.remove(await this.picRepo.findOne(id));
        return 'success';
    }

    async delPicGroup(id: number) {
        await this.pGRepo.remove(await this.pGRepo.findOne(id));
        return 'success';
    }

    async addPicGroup(name: string) {

        const exist = await this.pGRepo.findOne({ where: { name } });
        if (exist) {
            throw new HttpException('该图组已存在', 409);
        }
        return await this.pGRepo.save({ name });
    }

    async updatePicGroup(pG: PictureGroup) {
        await this.pGRepo.save(pG);
    }

    async findPicture(id: number) {
        const data = await this.picRepo.findOne(id);
        if (!data) {
            throw new HttpException('该图片不存在!', 404);
        }
        return data;
    }


}