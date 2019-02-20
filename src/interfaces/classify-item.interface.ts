export interface ClassifyItemInput {
    id: number;
    name: string;
    alias: string;
    required: boolean;
    order: number;
    itemId: number;
    classifyId: number;
}

export interface CreateClassifyItem {
    name: string;
    alias: string;
    required: boolean;
    order: number;
    itemId: number;
    classifyId: number;
}