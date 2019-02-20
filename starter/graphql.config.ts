import { GqlModuleOptions, GqlOptionsFactory } from '@nestjs/graphql';
import { Injectable, Inject } from '@nestjs/common';
import * as GraphQLJSON from 'graphql-type-json';

@Injectable()
export class GraphqlConfig implements GqlOptionsFactory {
    constructor(
    ) {}
    createGqlOptions(): GqlModuleOptions {
        return {
            typePaths: ['./**/*.types.graphql'],
            resolvers: { JSON: GraphQLJSON },
            context: ({ req }) => ({ req })
        };
    }
}