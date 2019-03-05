import { HttpException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { __ as t } from 'i18n';
import { Repository } from 'typeorm';

import { Role } from '../entities/role.entity';
import { EntityCheckService } from './entity-check.service';

@Injectable()
export class RoleService {
    constructor(
        @Inject(EntityCheckService) private readonly entityCheckService: EntityCheckService,
        @InjectRepository(Role) private readonly roleRepo: Repository<Role>,
    ) { }

    /**
     * Create a role
     *
     * @param name The role's name
     */
    async createRole(name: string) {
        await this.entityCheckService.checkNameExist(Role, name);
        await this.roleRepo.save(this.roleRepo.create({ name }));
    }

    /**
     * Update the specified role's name
     *
     * @param id The specified role's id
     * @param name The name to be update
     */
    async updateRole(id: number, name: string) {
        const role = await this.roleRepo.findOne(id);
        if (!role) {
            throw new HttpException(t('The role id of %s does not exist', id.toString()), 404);
        }

        if (name !== role.name) {
            await this.entityCheckService.checkNameExist(Role, name);
        }

        role.name = name;
        await this.roleRepo.save(role);
    }

    /**
     * Delete role
     *
     * @param id The specified role's id
     */
    async deleteRole(id: number) {
        const role = await this.roleRepo.findOne(id, { relations: ['permissions'] });
        if (!role) {
            throw new HttpException(t('The role id of %s does not exist', id.toString()), 404);
        }

        try {
            await this.roleRepo.remove(role);
        } catch (err) {
            throw new HttpException(t('Database error %s', err.toString()), 500);
        }
    }

    /**
     * Query all roles
     */
    async findRoles() {
        return this.roleRepo.find();
    }

}