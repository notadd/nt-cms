import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule, InjectRepository } from '@nestjs/typeorm';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TreeRepository } from 'typeorm';
import { ErrorsInterceptor } from '../interceptors/errors.interceptor';
import { Article } from './entities/article.entity';
import { Classify } from './entities/classify.entity';
import { ArticleResolver } from './resolvers/article.resolver';
import { ArticleService } from './services/article.service';
import { ClassifyResolver } from './resolvers/classify.resolver';
import { ClassifyService } from './services/classify.service';
import { picGroupResolver } from './resolvers/picGroup.resolver';
import { PicGroupService } from './services/picGroup.service';
import { PictureGroup } from './entities/pictureGroup.entity';
import { Picture } from './entities/picture.entity';
import { Page } from './entities/page.entity';
import { PageResolver } from './resolvers/page.resolver';
import { PageService } from './services/page.service';
import { PageSort } from './entities/page-sort.entity';
import { PageSortResolver } from './resolvers/page-sort.resolver';
import { PageSortService } from './services/page-sort.service';
import { Content } from './entities/content.entity';
import { Index } from './entities/index.entity';
import { IndexResolver } from './resolvers/index.resolver';
import { IndexService } from './services/index.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Classify, Article, PictureGroup, Picture, Page, PageSort, Content, Index
        ]),
    ],
    providers: [
        { provide: APP_INTERCEPTOR, useClass: ErrorsInterceptor },
        ArticleResolver, ArticleService,
        ClassifyResolver, ClassifyService,
        picGroupResolver, PicGroupService,
        PageResolver, PageService,
        PageSortResolver, PageSortService,
        IndexResolver, IndexService
    ]
})
export class CmsModule implements OnModuleInit {
    constructor(
        @InjectRepository(Classify) private readonly claRepo: TreeRepository<Classify>,
        @InjectRepository(PageSort) private readonly psRepo: TreeRepository<PageSort>,
        @InjectRepository(Index) private readonly indexRepo: TreeRepository<Index>,
        private readonly classifyService: ClassifyService,
        private readonly pageSortService: PageSortService,
    ) { }

    async onModuleInit() {
        await this.createRootClassify();
        await this.createPageSortClassify();
        await this.createIndex();
    }

    private async createRootClassify() {
        const root = await this.claRepo.findOne({ where: { value: 'root' } });
        if (!root) {
            await this.classifyService.addClassify({ label: '总分类', value: 'root', parent: { value: '' }, onlyChildrenArt: true, order: 1, structure: '' });
        }
    }

    private async createPageSortClassify() {
        const root = await this.psRepo.findOne({ where: { value: 'root' } });
        if (!root) {
            await this.pageSortService.createPageSort({ label: '总分类', value: 'root', parent: { value: '' }, structure: '' });
        }
    }

    private async createIndex() {
        const root = await this.indexRepo.findOne();
        if (!root) {
            await this.indexRepo.save(await this.indexRepo.create({ name: '', filing: '', link: '', code: '' }));
        }
    }

}