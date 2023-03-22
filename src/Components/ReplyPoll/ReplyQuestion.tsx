import { FC } from "react";
import { Question } from "../../types";
import { Form } from "react-bootstrap";
import { UserAnswer } from '../../types/index';

// Creamos una interfaz para definir que datos va a recibir nuestro componente funcinal
interface ReplyQuestionProps {
    question: Question,
    changeCallback: Function
}

const ReplyQuestion:FC<ReplyQuestionProps> = ({question, changeCallback}) => {

    // rendenizar las respuestas de la pregunta
    const renderAnswers =() => {
        switch(question.type){
            case "RADIO":
            case "CHECKBOX": {
                return question.answers.map(answer => {
                    return <div key={answer.id}className="mb-2">
                        <Form.Check
                            onChange={(e) => {
                                const data: UserAnswer = {
                                    questionId: parseInt(question.id),
                                    answer: parseInt(e.target.value),
                                    type: question.type
                                };
                                changeCallback(data);
                            }}
                            value={answer.id}
                            type={question.type === "RADIO" ? "radio" : "checkbox"}
                            name={question.id}
                            id={answer.id}
                            label={answer.content}
                        />
                    </div>
                });
            }
            case "SELECT": {
                return <div className="mb-2">
                    <Form.Control
                        as="select"
                        onChange={(e) => {
                            const data: UserAnswer = {
                                questionId: parseInt(question.id),
                                answer: parseInt(e.target.value),
                                type: question.type
                            };
                            changeCallback(data);
                        }}
                        className="form-select"
                    >
                        <option value="">Seleccione una opción</option>
                        {
                            question.answers.map(answer => (
                                <option value={answer.id} key={answer.id}>
                                    {answer.content}
                                </option>
                            ))
                        }
                    </Form.Control>
                </div>
            }
        }
    }

    return (
        <div className="mb-4">
            <h6>{question.content}</h6>
            { renderAnswers() }
        </div>
    );
}

export default ReplyQuestion;