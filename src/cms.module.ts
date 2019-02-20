import { Module, OnModuleInit, DynamicModule } from '@nestjs/common';
import { TypeOrmModule, InjectRepository } from '@nestjs/typeorm';
import { TreeRepository } from 'typeorm';
import { ErrorsInterceptor } from './interceptors/errors.interceptor';

import { APP_INTERCEPTOR } from '@nestjs/core';
import { Classify } from './entities/classify.entity';
import { ClassifyItem } from './entities/classify-item.entity';
import { Article } from './entities/article.entity';
import { ArtInfo } from './entities/art-info.entity';
import { Item } from './entities/item.entity';
import { PictureGroup } from './entities/pictureGroup.entity';
import { Picture } from './entities/picture.entity';
import { UserMessage } from './entities/user-message.entity';
import { Page } from './entities/page.entity';
import { PageSort } from './entities/page-sort.entity';
import { Content } from './entities/content.entity';
import { ArticleResolver } from './resolvers/article.resolver';
import { ArticleService } from './services/article.service';
import { ClassifyService } from './services/classify.service';
import { ClassifyResolver } from './resolvers/classify.resolver';
import { ClassifyItemResolver } from './resolvers/classify-item.resolver';
import { ClassifyItemService } from './services/classify-item.service';
import { ItemService } from './services/item.service';
import { ItemResolver } from './resolvers/item.resolver';
import { picGroupResolver } from './resolvers/picGroup.resolver';
import { PicGroupService } from './services/picGroup.service';
import { UserMessageService } from './services/user-message.service';
import { UserMessageResolver } from './resolvers/user-message.resolver';
import { PageService } from './services/page.service';
import { PageResolver } from './resolvers/page.resolver';
import { PageSortResolver } from './resolvers/page-sort.resolver';
import { PageSortService } from './services/page-sort.service';

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
