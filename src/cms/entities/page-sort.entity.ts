import {
    PrimaryGeneratedColumn,
    Column,
    Entity,
    OneToMany, Tree, TreeChildren, TreeParent
} from 'typeorm';
import { Page } from './page.entity';

@Entity('page_sort')
@Tree('nested-set')
export class PageSort {
    /*分类Id*/
    @PrimaryGeneratedColumn()
    id: number;

    /*分类名称*/
    @Column({
        nullable: false,
        length: 120,
    })
    name: string;

    @Column({
        comment: '分类别名',
        unique: true
    })
    alias: string;

    @TreeChildren()
    children: PageSort[];

    @TreeParent()
    parent: PageSort;

    @OneToMany(type => Page, page => page.pageSort)
    pages: Page[];
}
