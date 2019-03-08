export interface InputArticle {
    title: string;
    username: string;
    owner: number;
    classify: {
        value: string;
    };
    cover: string;
    abstract: string;
    content: string;
    top: number;
    hidden: boolean;
    status: number;
    source: string;
    sourceUrl: string;
    createAt: string;
    structure: string;
    artInfos: JSON;
}

export interface UpdateArticle {
    id: number;
    title: string;
    classify: {
        value: string;
    };
    sourceUrl: string;
    cover: string;
    abstract: string;
    content: string;
    top: number;
    hidden: boolean;
    source: string;
    structure: string;
    modifyAt?: string;
    status?: number;
    artInfos: JSON;
    username: string;
}

export  interface ArtResult {
    id: number;
    title: string;
    classify: {
        id: number;
        label: string;
        value: string;
        onlyChildrenArt: boolean;
    };
    sourceUrl: string;
    cover: string;
    structure: string;
    abstract: string;
    content: string;
    top: number;
    source: string;
    username: string;
    artInfos: JSON;
}