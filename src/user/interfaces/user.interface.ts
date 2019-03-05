export interface UserInfoData {
    id: number;
    username: string;
    email: string;
    mobile: string;
    banned: boolean;
    recycle: boolean;
    createTime: string;
    updateTime: string;
    userRoles: {
        id: number;
        name: string
    }[];
}

export interface CreateUserInput {
    username?: string;
    email?: string;
    mobile?: string;
    password: string;
    roleIds?: number[];
    nickname?: string;
    avater?: string;
}

export interface UpdateUserInput {
    username?: string;
    email?: string;
    mobile?: string;
    password?: string;
    roleIds?: {
        before: number;
        after: number;
    }[];
    nickname: string;
    avater: string;
}