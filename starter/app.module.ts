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
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: 'localhost',
            port: 5432,
            username: 'postgres',
            password: '123456',
            database: 'module_test',
            entities: ['src/**/**.entity.ts', 'node_modules/**/**.entity.js'],
            logger: 'advanced-console',
            logging: true,
            synchronize: true,
            dropSchema: false
        }),
        CmsModule
    ],
    controllers: [],
    providers: [],
    exports: []
})
export class AppModule { }