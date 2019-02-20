import { Mutation, Query, Resolver, } from '@nestjs/graphql';
import { ArticleService } from '../services/article.service';
import { InputArticle, UpdateArticle } from '../interfaces/article.interface';

@Resolver()
export class ArticleResolver {
    constructor(
        private readonly articleService: ArticleService
    ) { }

    @Query('getAllArticle')
    async getAllArticle(obj, body: { classifyId: number, createdAt: string, endTime: string, title: string, username: string, top: boolean, pageNumber: number, pageSize: number }) {
        const result = await this.articleService.getAllArticle(body.classifyId, body.createdAt, body.endTime, body.title, body.username, body.top, body.pageNumber, body.pageSize);
        return { code: 200, message: '查询成功!', data: result.exist, total: result.total };
    }

    @Query('userGetArticles')
    async userGetArticles(obj, body: { alias: string, pageNumber: number, pageSize: number }) {
        const result = await this.articleService.userGetArticles(body.alias, body.pageNumber, body.pageSize);
        return { code: 200, message: '查询成功!', data: result.exist, total: result.total };
    }

    @Query('getRecycleArticle')
    async getRecycleArticle(obj, body: { classifyId: number, createdAt: string, endTime: string, title: string, username: string, top: boolean, pageNumber: number, pageSize: number }) {
        const result = await this.articleService.getRecycleArticle(body.classifyId, body.createdAt, body.endTime, body.title, body.username, body.top, body.pageNumber, body.pageSize);
        return { code: 200, message: '查询成功!', data: result.exist, total: result.total };
    }

    @Query('getCheckArticle')
    async getCheckArticle(obj, body: { classifyId: number, createdAt: string, endTime: string, title: string, username: string, top: boolean, pageNumber: number, pageSize: number }) {
        const result = await this.articleService.getCheckArticle(body.classifyId, body.createdAt, body.endTime, body.title, body.username, body.top, body.pageNumber, body.pageSize);
        return { code: 200, message: '查询成功!', data: result.exist, total: result.total };
    }

    @Query('getArticleById')
    async getArticleById(obj, body: { id: number }) {
        return await this.articleService.getArticleById(body.id);
    }

    @Mutation('createArticle')
    async createArticle(obj, body: { article: InputArticle }, context) {
        if (!context.user.roles.length || context.user.roles[0].id === 2) {
            body.article.status = 1;
        }
        if (context.user.banned || context.user.recycling) {
            return { code: 403, message: '您的账户暂不可用,请联系管理员' };
        }
        await this.articleService.createArticle(body.article);
        return { code: 200, message: '创建成功!' };
    }

    @Mutation('updateArticle')
    async updateArticle(obj, body: { article: UpdateArticle }, context) {
        if (context.user.banned || context.user.recycling) {
            return { code: 403, message: '您的账户暂不可用,请联系管理员' };
        }
        await this.articleService.updateArticle(body.article);
        return { code: 200, message: '修改成功!' };
    }

    @Mutation('recycleArticleByIds')
    async recycleArticleByIds(obj, body: { ids: number[] }) {
        await this.articleService.recycleArticleByIds(body.ids);
        return { code: 200, message: '删除成功!' };
    }

    @Mutation('deleteArticleByIds')
    async deleteArticleByIds(obj, body: { ids: number[] }) {
        await this.articleService.deleteArticleByIds(body.ids);
        return { code: 200, message: '删除成功!' };
    }

    @Mutation('recoverArticleByIds')
    async recoverArticleByIds(obj, body: { ids: number[] }) {
        await this.articleService.recoverArticleByIds(body.ids);
        return { code: 200, message: '恢复成功!' };
    }

    @Mutation('auditArticle')
    async auditArticle(obj, body: { ids: number[], op: number, refuseReason: string }) {
        await this.articleService.auditArticle(body.ids, body.op, body.refuseReason);
        return { code: 200, message: '审核成功!' };
    }


}