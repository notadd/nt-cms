export interface JwtPayload {
    loginName: string;
    options?: any;
}

export interface JwtReply {
    accessToken: string;
    expiresIn: number;
}