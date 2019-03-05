import { forwardRef, HttpException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SmsComponent } from '@notadd/addon-sms';
import { __ as t } from 'i18n';
import { Repository } from 'typeorm';
import * as _ from 'underscore';

import { AuthService } from '../auth/auth.service';
import { User } from '../entities/user.entity';
import { CreateUserInput, UpdateUserInput, UserInfoData } from '../interfaces/user.interface';
import { CryptoUtil } from '../utils/crypto.util';
import { RoleService } from './role.service';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private readonly userRepo: Repository<User>,
        @Inject(CryptoUtil) private readonly cryptoUtil: CryptoUtil,
        @Inject(forwardRef(() => AuthService)) private readonly authService: AuthService,
        @Inject(RoleService) private readonly roleService: RoleService,
        @Inject('SmsComponentToken') private readonly smsComponentProvider: SmsComponent,
    ) { }

    /**
     * Cteate a user
     *
     * @param user The user object
     */
    async createUser(createUserInput: CreateUserInput): Promise<void> {
        if (!(createUserInput.username || createUserInput.mobile || createUserInput.email)) {
            throw new HttpException(t('Please make sure the username, mobile phone number, and email exist at least one'), 406);
        }
        if (createUserInput.username && await this.userRepo.findOne({ where: { username: createUserInput.username } })) {
            throw new HttpException(t('Username already exists'), 409);
        }
        if (createUserInput.mobile && await this.userRepo.findOne({ where: { mobile: createUserInput.mobile } })) {
            throw new HttpException(t('Mobile already exists'), 409);
        }
        if (createUserInput.email && await this.userRepo.findOne({ where: { email: createUserInput.email } })) {
            throw new HttpException(t('Email already exists'), 409);
        }

        if (!createUserInput.mobile && createUserInput.username) {
            createUserInput.mobile = createUserInput.username;
        }

        createUserInput.password = await this.cryptoUtil.encryptPassword(createUserInput.password);
        if (createUserInput.email) createUserInput.email = createUserInput.email.toLocaleLowerCase();
        const user = await this.userRepo.save(this.userRepo.create(createUserInput));

        if (createUserInput.roleIds && createUserInput.roleIds.length) {
            await this.userRepo.createQueryBuilder('user').relation(User, 'roles').of(user).add(createUserInput.roleIds);
        }
    }

    /**
     * Add a role to the user
     *
     * @param userId The specified user id
     * @param roleId The specified role id
     */
    async addUserRole(userId: number, roleId: number) {
        await this.userRepo.createQueryBuilder('user').relation(User, 'roles').of(userId).add(roleId);
    }

    /**
     * Delete a role from the user
     *
     * @param userId The specified user id
     * @param roleId The specified role id
     */
    async deleteUserRole(userId: number, roleId: number) {
        await this.userRepo.createQueryBuilder('user').relation(User, 'roles').of(userId).remove(roleId);
    }

    /**
     * Delete user to recycle bin or ban user
     *
     * @param id The specified user id
     */
    async recycleOrBanUser(id: number, action: 'recycle' | 'ban'): Promise<void> {
        const user = await this.findOneById(id);
        if (action === 'recycle') {
            user.recycle = true;
        }
        if (action === 'ban') {
            user.banned = true;
        }
        await this.userRepo.save(user);
    }

    /**
     * Delete users in the recycle bin
     *
     * @param id The specified user id
     */
    async deleteUser(id: number | number[]): Promise<void> {
        const exist = <UserInfoData[]>await this.findUserInfoById(id);
        const a = exist.map(item => item.id);
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < a.length; i++) {
            const user = await this.userRepo.findOne(a[i], { relations: ['roles'] });
            await this.userRepo.createQueryBuilder('user').relation(User, 'roles').of(user).remove(user.roles);
            await this.userRepo.remove(user);
        }
    }

    /**
     * Revert user from which was banned or recycled
     *
     * @param id The specified user id
     */
    async revertBannedOrRecycledUser(id: number, status: 'recycled' | 'banned') {
        const user = await this.findOneById(id);
        if (status === 'recycled') {
            user.recycle = false;
        }
        if (status === 'banned') {
            user.banned = false;
        }
        await this.userRepo.save(user);
    }

    /**
     * Update user's information
     *
     * @param id The specified user id
     * @param updateUserInput The information to be update
     */
    async updateUserInfo(id: number, updateUserInput: UpdateUserInput): Promise<void> {
        const user = await this.userRepo.findOne(id);

        if (updateUserInput.username && updateUserInput.username !== user.username) {
            if (await this.userRepo.findOne({ where: { username: updateUserInput.username } })) {
                throw new HttpException(t('Username already exists'), 409);
            }
            await this.userRepo.update(user.id, { username: updateUserInput.username });
        }
        if (updateUserInput.mobile && updateUserInput.mobile !== user.mobile) {
            if (await this.userRepo.findOne({ where: { mobile: updateUserInput.mobile } })) {
                throw new HttpException(t('Mobile already exists'), 409);
            }
            await this.userRepo.update(user.id, { mobile: updateUserInput.mobile });
        }
        if (updateUserInput.email && updateUserInput.email !== user.email) {
            if (await this.userRepo.findOne({ where: { email: updateUserInput.email } })) {
                throw new HttpException(t('Email already exists'), 409);
            }
            await this.userRepo.update(user.id, { email: updateUserInput.email.toLocaleLowerCase() });
        }

        if (updateUserInput.password) {
            const newPassword = await this.cryptoUtil.encryptPassword(updateUserInput.password);
            await this.userRepo.update(user.id, { password: newPassword });
        }
        if (updateUserInput.roleIds && updateUserInput.roleIds.length) {
            updateUserInput.roleIds.forEach(async roleId => {
                await this.userRepo.createQueryBuilder('user').relation(User, 'roles').of(user).remove(roleId.before);
                await this.userRepo.createQueryBuilder('user').relation(User, 'roles').of(user).add(roleId.after);
            });
        }
    }

    /**
     * Query the user by role ID
     *
     * @param roleId The specified role id
     */
    async findByRoleId(roleId: number) {
        const users = await this.userRepo.createQueryBuilder('user')
            .leftJoinAndSelect('user.roles', 'roles')
            .where('roles.id = :roleId', { roleId })
            .andWhere('user.recycle = false')
            .getMany();
        if (!users.length) {
            throw new HttpException(t('No users belong to this role'), 404);
        }
        return this.findUserInfoById(users.map(user => user.id)) as Promise<UserInfoData[]>;
    }

    /**
     * Querying users and their associated information by username
     *
     * @param username username
     */
    async findOneWithRoles(loginName: string): Promise<User> {
        const user = await this.userRepo.createQueryBuilder('user')
            .leftJoinAndSelect('user.roles', 'roles')
            .where('user.username = :loginName', { loginName })
            .orWhere('user.mobile = :loginName', { loginName })
            .orWhere('user.email = :loginName', { loginName: loginName.toLocaleLowerCase() })
            .getOne();

        if (!user) {
            throw new HttpException(t('User does not exist'), 404);
        }
        return user;
    }

    /**
     * Querying user information by user ID
     *
     * @param id The specified user id
     */
    async findUserInfoById(id: number | number[]): Promise<UserInfoData | UserInfoData[]> {
        const userQb = this.userRepo.createQueryBuilder('user')
            .leftJoinAndSelect('user.roles', 'roles');

        if (id instanceof Array) {
            const userInfoData: UserInfoData[] = [];
            const users = await userQb.whereInIds(id).getMany();
            for (const user of users) {
                (userInfoData as UserInfoData[]).push(this.refactorUserData(user));
            }
            return userInfoData;
        } else {
            const user = await userQb.where('user.id = :id', { id }).getOne();
            return this.refactorUserData(user);
        }
    }

    /**
     * user login by username or email
     *
     * @param loginName loginName: username or email
     * @param password password
     */
    async login(loginName: string, password: string) {
        const user = await this.userRepo.createQueryBuilder('user')
            .leftJoinAndSelect('user.roles', 'roles')
            .where('user.username = :loginName', { loginName })
            .orWhere('user.mobile = :loginName', { loginName })
            .orWhere('user.email = :loginName', { loginName: loginName.toLocaleLowerCase() })
            .getOne();

        await this.checkUserStatus(user);
        if (!await this.cryptoUtil.checkPassword(password, user.password)) {
            throw new HttpException(t('invalid password'), 406);
        }

        const userInfoData = this.refactorUserData(user);

        const tokenInfo = await this.authService.createToken({ loginName });
        return { tokenInfo, userInfoData };
    }

    async checkPwd(loginName: string, password: string) {
        const user = await this.userRepo.createQueryBuilder('user')
            .where('user.username = :loginName', { loginName })
            .orWhere('user.mobile = :loginName', { loginName })
            .orWhere('user.email = :loginName', { loginName: loginName.toLocaleLowerCase() })
            .getOne();
        if (!await this.cryptoUtil.checkPassword(password, user.password)) {
            return false;
        }
        return true;
    }

    /**
     * user login by mobile (use tencent cloud sms service)
     *
     * @param mobile mobile
     * @param validationCode validationCode
     */
    async mobileLogin(mobile: string, validationCode: number) {
        await this.smsComponentProvider.smsValidator(mobile, validationCode);

        const user = await this.userRepo.findOne({ mobile }, { relations: ['roles'] });
        await this.checkUserStatus(user);

        const userInfoData = this.refactorUserData(user);

        const tokenInfo = await this.authService.createToken({ loginName: mobile });
        return { tokenInfo, userInfoData };
    }

    /**
     * Ordinary user registration
     *
     * @param username username
     * @param password password
     */
    async register(createUserInput: CreateUserInput): Promise<void> {
        createUserInput.roleIds = [1];
        await this.createUser(createUserInput);
    }

    private checkUserStatus(user: User) {
        if (!user) throw new HttpException(t('User does not exist'), 404);
        if (user.banned || user.recycle) throw new HttpException(t('User is banned'), 400);
    }

    /**
     * Query users by ID
     *
     * @param id The specified user id
     */
    private async findOneById(id: number): Promise<User> {
        const exist = this.userRepo.findOne(id);
        if (!exist) {
            throw new HttpException(t('User does not exist'), 404);
        }
        return exist;
    }

    /**
     * Refactor the user information data
     *
     * @param user The user object
     */
    private refactorUserData(user: User) {
        const userInfoData: UserInfoData = {
            id: user.id,
            username: user.username,
            email: user.email,
            mobile: user.mobile,
            banned: user.banned,
            recycle: user.recycle,
            createTime: user.createTime,
            updateTime: user.updateTime,
            userRoles: user.roles,
        };
        return userInfoData;
    }

    async findPassword(mobile: string, password: string): Promise<void> {
        const user = await this.userRepo.findOne({ where: { mobile } });
        if (!user) {
            throw new HttpException(t('User does not exist'), 404);
        }
        const newPassword = await this.cryptoUtil.encryptPassword(password);
        user.password = newPassword;
        await this.userRepo.save(await this.userRepo.create(user));
    }

}