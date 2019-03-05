import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserMessage } from '../entities/user-message.entity';

@Injectable()
export class UserMessageService {
    constructor(
        @InjectRepository(UserMessage)
        private readonly adRepo: Repository<UserMessage>,
    ) { }

    async findNoread(id: number) {
        let data = false;
        const exist = await this.adRepo.find({
            where: { owner: id, state: false }
        });
        if (exist && exist.length) {
            data = true;
        }
        return data;
    }

    async findAll(id: number, pageNumber: number, pageSize: number) {
        const data = await this.adRepo.find({
            where: { owner: id },
            order: { state: 'ASC', createdAt: 'DESC' },
            skip: (pageNumber - 1) * pageSize,
            take: pageSize,
        });
        return { data: data[0], total: data[1] };
    }

    async findOne(id: number) {
        const data = await this.adRepo.findOne({ id });
        return data;
    }

    async readOne(id: number) {
        const news = await this.adRepo.findOne({ id });
        news.state = true;
        await this.adRepo.save(this.adRepo.create(news));
    }

    async readAll(owner: number) {
        await this.adRepo.createQueryBuilder().update(UserMessage).set({ state: true }).where({ owner }).execute();
    }

    async del(id: number) {
        const news = await this.adRepo.findOne({ id });
        return this.adRepo.remove(this.adRepo.create(news));
    }

    async dels(ids: [number]) {
        const exist = await this.adRepo.findByIds(ids);
        return this.adRepo.remove(exist);
    }
}