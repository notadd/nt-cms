export interface CreateClassify {
    label: string;
    value: string;
    parent: { value: string };
    onlyChildrenArt: boolean;
    order: number;
    classifyItem?: {
        name: string;
        alias: string;
        required: boolean;
        order: number;
        itemId: number;
    }[];
}