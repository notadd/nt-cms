import * as moment from 'moment';
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinTable,
    ManyToMany,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

import { Role } from './role.entity';

@Entity('user')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        nullable: true,
        unique: true
    })
    username: string;

    @Column({
        unique: true,
        nullable: true
    })
    email: string;

    @Column({
        unique: true,
        nullable: true
    })
    mobile: string;

    @Column()
    password: string;

    @Column({
        nullable: true
    })
    avater: string;

    @Column({
        nullable: true
    })
    nickname: string;

    @Column({
        default: false
    })
    banned: boolean;

    @Column({
        default: false
    })
    recycle: boolean;

    @ManyToMany(type => Role, role => role.users, {
        onDelete: 'CASCADE'
    })
    @JoinTable()
    roles: Role[];

    @CreateDateColumn({
        transformer: {
            from: (date: Date) => {
                return moment(date).format('YYYY-MM-DD HH:mm:ss');
            },
            to: () => {
                return new Date();
            }
        }
    })
    createTime: string;

    @UpdateDateColumn({
        transformer: {
            from: (date: Date) => {
                return moment(date).format('YYYY-MM-DD HH:mm:ss');
            },
            to: () => {
                return new Date();
            }
        }
    })
    updateTime: string;
}