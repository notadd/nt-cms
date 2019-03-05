import { HttpException, Inject } from '@nestjs/common';
import { Mutation, Query, Resolver } from '@nestjs/graphql';
import { __ as t } from 'i18n';

import { CommonResult } from '../interfaces/common-result.interface';
import { CreateUserInput, UpdateUserInput, UserInfoData } from '../interfaces/user.interface';
import { UserService } from '../services/user.service';
import { PagerUtil } from '../utils/pager.util';

@Resolver()
export class UserResolver {
    constructor(
        @Inject(UserService) private readonly userService: UserService,
        @Inject(PagerUtil) private readonly pagerUtil: PagerUtil,
    ) { }

    @Query('checkPwd')
    async checkPwd(req, body: { username: string, password: string }) {
        const data = await this.userService.checkPwd(body.username, body.password);
        return { code: 200, message: '验证完毕', data };
    }

    @Query('login')
    async login(req, body: { username: string, password: string }): Promise<CommonResult> {
        let data;
        if (isNaN(Number(body.password))) {
            data = await this.userService.login(body.username, body.password);
        } else if (!isNaN(Number(body.password))) {
            data = await this.userService.mobileLogin(body.username, parseInt(body.password));
        }
        return { code: 200, message: t('Login success'), data: data.tokenInfo };
    }

    @Query('adminLogin')
    async adminLogin(req, body: { username: string, password: string }): Promise<CommonResult> {
        let data;
        if (isNaN(Number(body.password))) {
            data = await this.userService.login(body.username, body.password);
        } else if (!isNaN(Number(body.password))) {
            data = await this.userService.mobileLogin(body.username, parseInt(body.password));
        }
        const userInfoData = data.userInfoData;
        if (userInfoData.username !== 'sadmin' && userInfoData.userRoles.map(v => v.id).includes(1)) {
            throw new HttpException(t('You are not authorized to access'), 401);
        }
        return { code: 200, message: t('Login success'), data: data.tokenInfo };
    }

    @Mutation('register')
    async register(req, body: { registerUserInput: CreateUserInput }): Promise<CommonResult> {
        await this.userService.register(body.registerUserInput);
        return { code: 200, message: t('Registration success') };
    }

    @Mutation('createUser')
    async createUser(req, body: { createUserInput: CreateUserInput }): Promise<CommonResult> {
        await this.userService.createUser(body.createUserInput);
        return { code: 200, message: t('Create user successfully') };
    }

    @Mutation('addUserRole')
    async addUserRole(req, body: { userId: number, roleId: number }): Promise<CommonResult> {
        await this.userService.addUserRole(body.userId, body.roleId);
        return { code: 200, message: t('Add user role successfully') };
    }

    @Mutation('deleteUserRole')
    async deleteUserRole(req, body: { userId: number, roleId: number }): Promise<CommonResult> {
        await this.userService.deleteUserRole(body.userId, body.roleId);
        return { code: 200, message: t('Delete user role successfully') };
    }

    @Mutation('banUser')
    async banUser(req, body: { userId: number }): Promise<CommonResult> {
        await this.userService.recycleOrBanUser(body.userId, 'recycle');
        return { code: 200, message: t('Ban user successfully') };
    }

    @Mutation('recycleUser')
    async recycleUser(req, body: { userId: number }): Promise<CommonResult> {
        await this.userService.recycleOrBanUser(body.userId, 'recycle');
        return { code: 200, message: t('Delete user to recycle bin successfully') };
    }

    @Mutation('deleteRecycledUser')
    async deleteRecycledUser(req, body: { userId: number[] }): Promise<CommonResult> {
        await this.userService.deleteUser(body.userId);
        return { code: 200, message: t('Delete user in the recycle bin successfully') };
    }

    @Mutation('revertBannedUser')
    async revertBannedUser(req, body: { userId: number }): Promise<CommonResult> {
        await this.userService.revertBannedOrRecycledUser(body.userId, 'banned');
        return { code: 200, message: t('Revert banned user successfully') };
    }

    @Mutation('revertRecycledUser')
    async revertRecycledUser(req, body: { userId: number }): Promise<CommonResult> {
        await this.userService.revertBannedOrRecycledUser(body.userId, 'recycled');
        return { code: 200, message: t('Revert recycled user successfully') };
    }

    @Mutation('updateUserInfoById')
    async updateUserInfo(req, body: { userId: number, updateUserInput: UpdateUserInput }): Promise<CommonResult> {
        await this.userService.updateUserInfo(body.userId, body.updateUserInput);
        return { code: 200, message: t('Update user information successfully') };
    }

    @Mutation('updateCurrentUserInfo')
    async updateCurrentUserInfo(req, body: { updateCurrentUserInput: UpdateUserInput }, context): Promise<CommonResult> {
        await this.userService.updateUserInfo(context.user.id, body.updateCurrentUserInput);
        return { code: 200, message: t('Update current login user information successfully') };
    }

    @Query('findUserInfoByIds')
    async findUserInfoById(req, body: { userIds: number[] }): Promise<CommonResult> {
        const data = await this.userService.findUserInfoById(body.userIds) as UserInfoData[];
        return { code: 200, message: t('Query the specified users information successfully'), data };
    }

    @Query('findCurrentUserInfo')
    async findCurrentUserInfo(req, body, context): Promise<CommonResult> {
        const data = await this.userService.findUserInfoById(context.user.id) as UserInfoData;
        return { code: 200, message: t('Query the current login user information successfully'), data };
    }

    @Query('findUsersInRole')
    async findUsersInRole(req, body: { roleId: number }): Promise<CommonResult> {
        const data = await this.userService.findByRoleId(body.roleId);
        return { code: 200, message: t('Query the user under the role successfully'), data };
    }

    @Mutation('findPassword')
    async findPassword(req, body: { mobile: string, password: string }): Promise<CommonResult> {
        await this.userService.findPassword(body.mobile, body.password);
        return { code: 200, message: t('Update user information successfully') };
    }

}