import { Mutation, Query, Resolver } from '@nestjs/graphql';
import { __ as t } from 'i18n';

import { CommonResult } from '../interfaces/common-result.interface';
import { RoleService } from '../services/role.service';

@Resolver()
export class RoleResolver {
    constructor(
        private readonly roleService: RoleService
    ) { }

    @Mutation('createRole')
    async createRole(req, body: { name: string }): Promise<CommonResult> {
        await this.roleService.createRole(body.name);
        return { code: 200, message: t('Create a role successfully') };
    }

    @Mutation('deleteRole')
    async deleteRole(req, body: { id: number }): Promise<CommonResult> {
        await this.roleService.deleteRole(body.id);
        return { code: 200, message: t('Delete role successfully') };
    }

    @Mutation('updateRole')
    async updateRole(req, body: { id: number, name: string }): Promise<CommonResult> {
        await this.roleService.updateRole(body.id, body.name);
        return { code: 200, message: t('Update role successfully') };
    }

    @Query('findRoles')
    async findRoles(): Promise<CommonResult> {
        const data = await this.roleService.findRoles();
        return { code: 200, message: t('Query all roles successfully'), data };
    }

}