import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from 'typeorm';
import { PictureGroup } from './pictureGroup.entity';

// 图片实体
@Entity('Picture')
export class Picture {
    @PrimaryGeneratedColumn({ comment: '自增主键', })
    id: number;

    @Column({ comment: '图片地址'})
    name: string;

    @Column({ comment: '图片跳转链接', nullable: true })
    Url: string;

    // 图片标题文字将作为图片Alt形式显示
    @Column({ comment: '图片名称,', nullable: true })
    title: string;

    // 展示顺序
    @Column({ comment: '排序', nullable: true })
    sequence: number;

    @ManyToOne(type => PictureGroup, pictureGroup => pictureGroup.pictures, { onDelete: 'CASCADE' })
    pictureGroup: PictureGroup;
}