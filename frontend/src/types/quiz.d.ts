interface Option {
    id: number,
    option: string,
}

export interface Question {
    question: string,
    answer_id: number|null,
    options: Option [],
}

export interface Quiz {
    id?: number,
    slug?: string,
    title: string,
    tagline: string,
    description?: string,
    image_url:string,
    category: string,
    difficulty: string,
    duration: number,
    is_popular: boolean,
    is_new: boolean,
    questions_count?: number,
    questions?: Question[],
}
