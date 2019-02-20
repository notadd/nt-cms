export interface PageInput {
    name: string;
    alias: string;
    pageSortId: number;
    contents: { name: string, alias: string, value: string }[];
}