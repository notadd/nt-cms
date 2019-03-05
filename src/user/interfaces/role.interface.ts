export interface RoleInfoData {
    id: number;
    name: string;
    permissions: {
        id: number;
        name: string;
        action: string;
        identify: string;
    }[];
    infoItems: {
        id: number;
        name: string;
        description: string;
        type: string;
    }[];
}