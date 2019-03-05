import { Column, JoinColumn, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import * as moment from 'moment';

@Entity('index')
export class Index {
    /*Id*/
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        nullable: true
    })
    name: string;

    @Column({
        nullable: true
    })
    filing: string;

    @Column({
        nullable: true
    })
    link: string;

    @Column({
        default: false
    })
    isCheckArticle: boolean;

    @Column({
        nullable: true,
        type: 'text'
    })
    code: string;

}


