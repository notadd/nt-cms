export interface PageInput {
    name: string;
    alias: string;
    pageSortAlias: string;
    contents: { name: string, alias: string, value: string }[];
    structure: string;
}

export interface PageUpdateInput {
    id: number;
    name: string;
    alias: string;
    contents: {
        name: string,
        alias: string,
        value: string
    }[];
    pageSortAlias: string;
    structure: string;
}