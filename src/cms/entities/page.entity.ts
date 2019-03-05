import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Content } from './content.entity';
import { PageSort } from './page-sort.entity';

@Entity('page')
export class Page {
    @PrimaryGeneratedColumn({
        comment: '自增id'
    })
    id: number;

    @Column({
        comment: '页面名称'
    })
    name: string;

    @Column({
        comment: '页面别名'
    })
    alias: string;

    @Column({
        comment: '最后修改时间',
        nullable: true
    })
    lastUpdateTime: string;

    @Column({
        nullable: true
    })
    structure: string;

    @OneToMany(type => Content, content => content.page, { cascade: ['insert', 'update'] })
    contents: Content[];

    @ManyToOne(type => PageSort, pageSort => pageSort.pages)
    pageSort: PageSort;

}