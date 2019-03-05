import { HttpException, Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { __ as t } from 'i18n';
import { EntityManager } from 'typeorm';

@Injectable()
export class EntityCheckService {
    constructor(
        @InjectEntityManager() private entityManager: EntityManager
    ) { }

    async checkNameExist(entityClass: any, name: string) {
        const exist = await this.entityManager.findOne(entityClass, { name });
        if (exist) {
            throw new HttpException(t('Name already exists'), 409);
        }
    }
}