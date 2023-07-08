import axios from "axios";
import { CREATE_POLL_ENDPOINT, CREATE_POLL_REPLY_ENDPOINT, GET_POLL_WITH_QUESTIONS_ENDPOINT, GET_USER_POLLS_ENDPOINT } from '../utils/endpoints';
import { PollReply } from "../types";

export const savePoll = (data: any) => {
    return axios.post(CREATE_POLL_ENDPOINT, data);
}

export const getPollWithQuestions = (uuid: string) => {
    return axios.get(GET_POLL_WITH_QUESTIONS_ENDPOINT(uuid));
}

export const createPollReply = (pollReply: PollReply) => {
    return axios.post(CREATE_POLL_REPLY_ENDPOINT, pollReply);
}

export const getUserPolls = (page: number) => {
    return axios.get(GET_USER_POLLS_ENDPOINT(page));
}
