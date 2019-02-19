import { Module, OnModuleInit, DynamicModule } from '@nestjs/common';
import { TypeOrmModule, InjectRepository } from '@nestjs/typeorm';
import { Classify } from './cms/entities/classify.entity';
import { PageSort } from './cms/entities/page-sort.entity';
import { TreeRepository } from 'typeorm';
import { ClassifyService } from './cms/services/classify.service';
import { PageSortService } from './cms/services/page-sort.service';
import { ErrorsInterceptor } from './interceptors/errors.interceptor';

import { APP_INTERCEPTOR } from '@nestjs/core';
import { ArticleResolver } from './cms/resolvers/article.resolver';
import { ArticleService } from './cms/services/article.service';
import { ClassifyResolver } from './cms/resolvers/classify.resolver';
import { ClassifyItemResolver } from './cms/resolvers/classify-item.resolver';
import { ClassifyItemService } from './cms/services/classify-item.service';
import { ItemService } from './cms/services/item.service';
import { ItemResolver } from './cms/resolvers/item.resolver';
import { picGroupResolver } from './cms/resolvers/picGroup.resolver';
import { UserMessageResolver } from './cms/resolvers/user-message.resolver';
import { PageResolver } from './cms/resolvers/page.resolver';
import { PageSortResolver } from './cms/resolvers/page-sort.resolver';
import { PageService } from './cms/services/page.service';
import { UserMessageService } from './cms/services/user-message.service';
import { PicGroupService } from './cms/services/picGroup.service';
import { ClassifyItem } from './cms/entities/classify-item.entity';
import { Article } from './cms/entities/article.entity';
import { ArtInfo } from './cms/entities/art-info.entity';
import { Item } from './cms/entities/item.entity';
import { PictureGroup } from './cms/entities/pictureGroup.entity';
import { Picture } from './cms/entities/picture.entity';
import { UserMessage } from './cms/entities/user-message.entity';
import { Page } from './cms/entities/page.entity';
import { Content } from './cms/entities/content.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Classify, ClassifyItem, Article, ArtInfo, Item, PictureGroup, Picture, UserMessage, Page, PageSort, Content
        ]),
    ],
    controllers: [],
    providers: [
        { provide: APP_INTERCEPTOR, useClass: ErrorsInterceptor },
        ArticleResolver, ArticleService,
        ClassifyResolver, ClassifyService,
        ClassifyItemResolver, ClassifyItemService,
        ItemResolver, ItemService,
        picGroupResolver, PicGroupService,
        UserMessageResolver, UserMessageService,
        PageResolver, PageService,
        PageSortResolver, PageSortService
    ],
    exports: [ArticleService, ClassifyService, ClassifyItemService, ItemService, PicGroupService, UserMessageService, PageService, PageSortService]
})
export class CmsModule implements OnModuleInit {
    constructor(
        @InjectRepository(Classify) private readonly claRepository: TreeRepository<Classify>,
        @InjectRepository(PageSort) private readonly psRepository: TreeRepository<PageSort>,
        private readonly classifyService: ClassifyService,
        private readonly pageSortService: PageSortService,
    ) { }

    async onModuleInit() {
        await this.createRootClassify();
        await this.createPageSortClassify();
    }

    private async createRootClassify() {
        const root = await this.claRepository.findOne({ where: { alias: '总分类' } });
        if (!root) {
            await this.classifyService.addClassify({ name: '总分类', alias: '总分类', parent: { id: 0 }, onlyChildrenArt: true, order: 1 });
        }
    }

    private async createPageSortClassify() {
        const root = await this.psRepository.findOne({ where: { alias: '总分类' } });
        if (!root) {
            await this.pageSortService.createPageSort({ name: '总分类', alias: '总分类', parent: { id: 0 } });
        }
    }

}
