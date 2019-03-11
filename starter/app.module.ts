import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphqlConfig } from './graphql.config';
import { CmsModule } from '../src/cms/cms.module';
import { UserModule } from '../src/user/user.module';

@Module({
    imports: [
        GraphQLModule.forRootAsync({
            useClass: GraphqlConfig
        }),
        TypeOrmModule.forRoot(),
        CmsModule,
        UserModule
    ],
    controllers: [],
    providers: [],
    exports: []
})
export class AppModule { }