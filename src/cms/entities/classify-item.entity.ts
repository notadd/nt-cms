import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, ManyToOne } from 'typeorm';
import { Classify } from './classify.entity';
import { Item } from './item.entity';

@Entity('classify_item')
export class ClassifyItem {
    @PrimaryGeneratedColumn({
        comment: '自增id'
    })
    id: number;

    @Column({
        comment: '显示名称'
    })
    name: string;

    @Column({
        comment: '别名'
    })
    alias: string;

    @Column({
        comment: '是否必填',
        default: false
    })
    required: boolean;

    @Column({
        comment: '排序'
    })
    order: number;

    @ManyToOne(type => Classify, classify => classify.classifyItems)
    classify: Classify;

    @ManyToOne(type => Item, item => item.itemClassifys)
    item: Item;

}