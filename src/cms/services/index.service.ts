import { Injectable, Inject, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, TreeRepository } from 'typeorm';
import { Index } from '../entities/index.entity';
const _ = require('underscore');


@Injectable()
export class IndexService {

    constructor(
        @InjectRepository(Index) private readonly indexRepo: Repository<Index>
    ) { }

    async getIndex() {
        const data = await this.indexRepo.findOne();
        return data;
    }

    async updateIndex(index: Index) {
        try {
            index.id = 1;
            await this.indexRepo.save(this.indexRepo.create(index));
        } catch (error) {
            throw new HttpException(error.toString(), 500);
        }
    }

}