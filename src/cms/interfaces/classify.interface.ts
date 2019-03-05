export interface CreateClassify {
    label: string;
    value: string;
    parent: { value: string };
    onlyChildrenArt: boolean;
    structure?: string;
    order?: number;
    itemJson?: JSON;
}