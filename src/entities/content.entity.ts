import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Page } from './page.entity';

@Entity('content')
export class Content {
    @PrimaryGeneratedColumn({
        comment: '自增id'
    })
    id: number;

    @Column({
        comment: '显示名称',
        nullable: true
    })
    name: string;

    @Column({
        comment: '别名',
        unique: true
    })
    alias: string;

    @Column({
        comment: '页面内容',
        type: 'text',
        nullable: true
    })
    value: string;

    @ManyToOne(type => Page, page => page.contents, { onDelete: 'CASCADE', cascade: true })
    page: Page;

}