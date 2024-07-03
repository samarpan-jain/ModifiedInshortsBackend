interface Source{
    name:string;
}

export interface NewsDetails{
    title:string,
    description:string,
    content: string,
    url:string;
    image:string;
    publishedAt: string;
    source: Source
}

export enum News_Category {
    GENERAL = "general",
    WORLD = "world",
    NATION = "nation",
    BUSINESS = "business",
    TECHNOLOGY = "technology",
    ENTERTAINMENT = "entertainment",
    SPORTS = "sports",
    SCIENCE = "science",
    HEALTH = "health"
}