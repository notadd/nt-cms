import {
    PrimaryGeneratedColumn,
    Column,
    Entity,
    OneToMany, Tree, TreeChildren, TreeParent, ManyToOne
} from 'typeorm';
import { Article } from './article.entity';

@Entity('classify')
@Tree('nested-set')
export class Classify {
    /*分类Id*/
    @PrimaryGeneratedColumn()
    id: number;

    /*分类名称*/
    @Column({
        nullable: true,
        length: 120,
    })
    label: string;

    @Column({
        comment: '分类别名',
        nullable: true
    })
    value: string;

    @Column({
        nullable: true
    })
    order: number;

    @Column({
        comment: '只显示子级分类文章',
        default: false
    })
    onlyChildrenArt: boolean;

    @Column({
        nullable: true
    })
    structure: string;

    @TreeChildren()
    children: Classify[];

    @TreeParent()
    parent: Classify;


    @OneToMany(type => Article, article => article.classify)
    articles: Article[];

    // 信息项JSON表单
    @Column({
        nullable: true,
        type: 'varchar',
        transformer: {
            from: (data) => {
                if (data) {
                    return JSON.parse(data);
                } else {
                    // tslint:disable-next-line:no-null-keyword
                    return null;
                }
            },
            to: (data) => {
                data = data ? JSON.stringify(data) : undefined;
                return data;
            }
        }
    })
    itemJson: JSON;

}
