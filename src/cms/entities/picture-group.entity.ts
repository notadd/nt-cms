import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Picture } from './picture.entity';

// 图组实体
@Entity('picture_group')
export class PictureGroup {
  @PrimaryGeneratedColumn({ comment: '自增主键', })
  id: number;

  @Column({ comment: '图组名称', length: 20 }) // , unique : true })
  name: string;

  @OneToMany(type => Picture, picture => picture.pictureGroup)
  pictures: Picture[];
}