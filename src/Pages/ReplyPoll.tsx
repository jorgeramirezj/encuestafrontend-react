import { FC } from "react";
import { RouteComponentProps } from "react-router-dom";
import Poll from "../Components/ReplyPoll/Poll";

interface RouteParams {
    id: string
}

interface ReplyPollProps extends RouteComponentProps<RouteParams> {

}

// Volvemos un componente funciona con "FC"
const ReplyPoll:FC<ReplyPollProps> = (props) => {

    const pollUUID = props.match.params.id;

    return <Poll id={pollUUID}></Poll>
}

export default ReplyPoll;