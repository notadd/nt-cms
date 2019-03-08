import { Column, JoinColumn, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import * as moment from 'moment';
import { Classify } from './classify.entity';
@Entity('article')
export class Article {
    /*文章Id*/
    @PrimaryGeneratedColumn()
    id: number;

    /*文章作者*/
    @Column({
        nullable: true,
        length: 120,
    })
    username: string;

    /*文章发布人id*/
    @Column({
        nullable: true
    })
    owner: number;

    /*文章标题*/
    @Column({
        nullable: true,
        length: 120,
    })
    title: string;

    /*关键词*/
    @Column({
        nullable: true
    })
    keywords: string;

    @Column({
        default: 0
    })
    like: number;

    /* 访问量*/
    @Column({
        default: 0
    })
    views: number;

    /*封面图片地址*/
    @Column({
        nullable: true,
        length: 500,
    })
    cover: string;


    /*摘要*/
    @Column({
        nullable: true,
        length: 500,
    })
    abstract: string;

    /*内容*/
    @Column({
        nullable: true,
        type: 'text',
    })
    content: string;

    /*置顶,0: 不置顶,1:分类置顶,2:全局置顶*/
    @Column({
        default: 0
    })
    top: number;

    /*来源*/
    @Column({
        nullable: true,
        length: 120,
    })
    source: string;

    /*文章状态, 0 待审核 1 审核通过 2  被拒绝  */
    @Column({
        default: 0
    })
    status: number;

    /*拒绝原因*/
    @Column({
        type: 'text',
        nullable: true
    })
    refuseReason: string;

    /*来源链接*/
    @Column({
        nullable: true,
        length: 200,
    })
    sourceUrl: string;

    /*删除(回收站)*/
    @Column({
        nullable: true,
        default: false
    })
    recycling: boolean;

    /* 是否隐藏文章*/
    @Column({
        default: false
    })
    hidden: boolean;

    @Column({
        nullable: true
    })
    structure: string;

    /*发布时间*/
    @Column({
        nullable: true,
        transformer: {
            from: (date) => {
                return moment(date).format('YYYY-MM-DD HH:mm:ss');
            },
            to: (date) => {
                date = date ? date : new Date();
                return moment(date).format('YYYY-MM-DD HH:mm:ss');
            }
        }
    })
    createdAt: string;

    /*修改时间*/
    @Column({
        nullable: true,
        transformer: {
            from: (date) => {
                return moment(date).format('YYYY-MM-DD HH:mm:ss');
            },
            to: (date) => {
                date = date ? date : new Date();
                return moment(date).format('YYYY-MM-DD HH:mm:ss');
            }
        }
    })
    modifyAt: string;

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
    artInfos: JSON;

    /*分类Id*/
    @ManyToOne(type => Classify, classify => classify.articles, { onDelete: 'CASCADE', cascade: true })
    @JoinColumn({
        name: 'classifyId',
        referencedColumnName: 'id'
    })
    classify: Classify;

}

