import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { AuthenticationError } from 'apollo-server-core';
import { __ as t } from 'i18n';
import * as jwt from 'jsonwebtoken';

import { AUTH_TOKEN_WHITE_LIST } from '../constants/auth.constant';
import { User } from '../entities/user.entity';
import { JwtPayload, JwtReply } from '../interfaces/jwt.interface';
import { UserService } from '../services/user.service';

@Injectable()
export class AuthService {
    constructor(
        @Inject(forwardRef(() => UserService)) private readonly userService: UserService,
        @Inject(AUTH_TOKEN_WHITE_LIST) private readonly authTokenWhiteList: [string],
    ) { }

    async createToken(payload: JwtPayload): Promise<JwtReply> {
        const accessToken = jwt.sign(payload, 'secretKey', { expiresIn: '1d' });
        return { accessToken, expiresIn: 60 * 60 * 24 };
    }

    async validateUser(req: any): Promise<User> {

        /**
         * whitelist
         */
        // tslint:disable-next-line:max-line-length
        if (req.body && ([
            'IntrospectionQuery', 'sayHello', 'login', 'getOnePage',
            'adminLogin', 'register', 'getAllArticle',
            'userGetArticles', 'getAllClassify', 'getArticleById', 'uploadProcess',

        ].some(item => req.body.query.includes(item)))) {
            return;
        }

        let token = req.headers.authorization as string;
        if (!token) {
            throw new AuthenticationError(t('Request header lacks authorization parameters，it should be: Authorization'));
        }

        if (token.slice(0, 6) === 'Bearer') {
            token = token.slice(7);
        } else {
            throw new AuthenticationError(t('The authorization code prefix is incorrect. it should be: Bearer'));
        }

        try {
            const decodedToken = <{ loginName: string }>jwt.verify(token, 'secretKey');
            const data = await this.userService.findOneWithRoles(decodedToken.loginName);
            return data;
        } catch (error) {
            if (error instanceof jwt.JsonWebTokenError) {
                throw new AuthenticationError(t('The authorization code is incorrect'));
            }
            if (error instanceof jwt.TokenExpiredError) {
                throw new AuthenticationError(t('The authorization code has expired'));
            }
        }
    }
}