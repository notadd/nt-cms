import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Article } from './article.entity';
import { Item } from './item.entity';

@Entity('art_info')
export class ArtInfo {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        comment: '值'
    })
    value: string;

    @ManyToOne(type => Article, article => article.artInfos, {
        onDelete: 'CASCADE'
    })
    article: Article;

    @ManyToOne(type => Item, item => item.artInfos, {
        onDelete: 'CASCADE'
    })
    item: Item;

}