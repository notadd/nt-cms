import { DynamicModule, Global, Inject, Module, OnModuleInit } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ModulesContainer } from '@nestjs/core/injector/modules-container';
import { MetadataScanner } from '@nestjs/core/metadata-scanner';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { __ as t, configure as i18nConfigure } from 'i18n';
import { join } from 'path';
import { Repository } from 'typeorm';
import { AuthService } from './auth/auth.service';
import { AUTH_TOKEN_WHITE_LIST } from './constants/auth.constant';
import { Role } from './entities/role.entity';
import { User } from './entities/user.entity';
import { RoleResolver } from './resolvers/role.resolver';
import { UserResolver } from './resolvers/user.resolver';
import { EntityCheckService } from './services/entity-check.service';
import { RoleService } from './services/role.service';
import { UserService } from './services/user.service';
import { CryptoUtil } from './utils/crypto.util';
import { PagerUtil } from './utils/pager.util';
import { SmsModule } from '@notadd/addon-sms';

@Global()
@Module({
    imports: [
        TypeOrmModule.forFeature([ User, Role]),
        SmsModule
    ],
    controllers: [],
    providers: [
        AuthService,
        EntityCheckService,
        UserResolver, UserService,
        RoleResolver, RoleService,
        CryptoUtil, PagerUtil
    ],
    exports: [AuthService, UserService, RoleService]
})
export class UserModule implements OnModuleInit {
    private readonly metadataScanner: MetadataScanner;

    constructor(
        @Inject(UserService) private readonly userService: UserService,
        @Inject(ModulesContainer) private readonly modulesContainer: ModulesContainer,
        @InjectRepository(Role) private readonly roleRepo: Repository<Role>,
        @InjectRepository(User) private readonly userRepo: Repository<User>,
    ) {
        this.metadataScanner = new MetadataScanner();
    }

    static forRoot(options: { i18n: 'en-US' | 'zh-CN', authTokenWhiteList?: string[] }): DynamicModule {
        if (!existsSync('src/i18n')) {
            mkdirSync(join('src/i18n'));
            writeFileSync(join('src/i18n', 'zh-CN.json'), readFileSync(__dirname + '/i18n/zh-CN.json'));
            writeFileSync(join('src/i18n', 'en-US.json'), readFileSync(__dirname + '/i18n/en-US.json'));
        }
        i18nConfigure({
            locales: ['en-US', 'zh-CN'],
            defaultLocale: options.i18n,
            directory: 'src/i18n'
        });
        if (options.authTokenWhiteList) {
            options.authTokenWhiteList.push(...['IntrospectionQuery', 'login', 'adminLogin', 'register']);
        } else {
            options.authTokenWhiteList = ['IntrospectionQuery', 'login', 'adminLogin', 'register'];
        }
        return {
            providers: [{ provide: AUTH_TOKEN_WHITE_LIST, useValue: options.authTokenWhiteList }],
            module: UserModule
        };
    }

    async onModuleInit() {
        await this.createDefaultRole();
        await this.createSuperAdmin();
    }

    /**
     * Create a default ordinary user role
     */
    private async createDefaultRole() {
        const ordinary = await this.roleRepo.findOne({ where: { name: '普通用户' } });
        if (!ordinary) {
            await this.roleRepo.save(this.roleRepo.create({
                id: 1,
                name: t('ordinary user')
            }));
        }

        const admin = await this.roleRepo.findOne({ where: { name: '管理员' } });
        if (!admin) {
            await this.roleRepo.save(this.roleRepo.create({
                id: 2,
                name: '管理员'
            }));
        }
    }

    /**
     * Create a system super administrator
     */
    private async createSuperAdmin() {
        const sadmin = await this.userRepo.findOne({ where: { username: 'sadmin' } });
        if (sadmin) return;
        await this.userService.createUser({ username: 'sadmin', password: 'sadmin' });
    }

}