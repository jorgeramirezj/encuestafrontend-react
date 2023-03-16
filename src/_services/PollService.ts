import axios from "axios";
import { CREATEPOLL_ENDPOINT } from '../utils/endpoints';

export const savePoll = (data: any) => {
    return axios.post(CREATEPOLL_ENDPOINT, data);
}