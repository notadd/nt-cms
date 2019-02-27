import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import {CmsModule} from '../src/cms.module';
import { GraphqlConfig } from './graphql.config';

@Module({
    imports: [
        GraphQLModule.forRootAsync({
            useClass: GraphqlConfig
        }),
        TypeOrmModule.forRoot(),
        CmsModule
    ],
    controllers: [],
    providers: [],
    exports: []
})
export class AppModule { }