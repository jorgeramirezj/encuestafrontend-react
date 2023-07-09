import { ChartData } from "chart.js";

export type User = {
    email: string,
    token: string,
    isAuthenticated: boolean
};

export type Poll = {
    id: string,
    errors: {},
    content: string,
    openend: boolean
    questions: Question[]
}

export type Question = {
    id: string,
    content: string,
    questionOrder: number,
    type: QuestionType,
    answers: Answer[]
}

export type Answer = {
    id: string,
    content: string
}

export type QuestionType = "RADIO" | "CHECKBOX" | "SELECT";

export type RouteType = "PRIVATE" | "PUBLIC" | "GUEST";

export type Route = {
    path: string,
    component: any,
    routeType: RouteType
}

export type UserAnswer = {
    questionId: number,
    answer: number | Array<number>,
    type: QuestionType
}

export type PollReplyDetails = {
    questionId: number,
    answerId: number
}

export type PollReply = {
    pollReplies: PollReplyDetails[],
    user: string,
    poll: number
}


export type PollResultDetail = {
    answer: string,
    result: number
}

export type PollResult = {
    question: string,
    details: PollResultDetail[]
}

export type PollChartData = {
    data: ChartData,
    title: string,
    questionId: number
}

export type ChartType = "PIE" | "BAR";