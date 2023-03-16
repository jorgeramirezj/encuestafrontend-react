import { FC, useEffect } from "react";
import { usePollDispatch, usePollState } from "../../context/pollContext";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import { QUESTION_TYPE_OPTIONS } from "../../utils/constants";
import { PlusCircle, PlusLg, Trash } from "react-bootstrap-icons";
import ReactTooltip from 'react-tooltip';
import Answer from "./Answer";

interface QuestionaProps {
    index: number
}

const Question:FC<QuestionaProps> = ({ index }) => {

    const poll = usePollState();
    const pollDispatch = usePollDispatch();

    const question = poll.questions[index];

    const errors: any = poll.errors;
    const errorKey = `questions[${index}]`;

    // Para que ReactTooltip sea agregado en cada pregunta y respuesta
    useEffect(() => {
        ReactTooltip.rebuild();
    }, [question.answers.length]);

    // Mapear cada una de las answer que tiene la pregunta actual
    const renderAnswers = () => {
        return question.answers.map((answer, answerIndex) => (
                <Answer 
                    key={answer.id} 
                    questionIndex={index} 
                    answerIndex={answerIndex} />
            )
        )
    }

    return (
        <Card className="mt-3">
            <Card.Body>
                <Row>
                    <Col sm="12" md="6" className="mb-4">
                        <Form.Control
                            type="text"
                            placeholder="Pregunta"
                            onChange={(e) => pollDispatch({
                                type: "questioncontent",
                                payload: {
                                    content: e.target.value,
                                    index: index
                                }
                            })}
                            value={question.content}
                            isInvalid={!!errors[`${errorKey}.content`]}
                        />
                        <Form.Control.Feedback type="invalid">
                            { errors[`${errorKey}.content`] }
                        </Form.Control.Feedback>
                    </Col>
                    <Col sm="12" md="6" className="mb-4">
                        <Form.Control
                            as="select"
                            className="form-select"
                            value={question.type}
                            onChange={(e) => {
                                pollDispatch({
                                    type: "changequestiontype",
                                    payload: {
                                        index: index,
                                        value: e.target.value
                                    }
                                })
                            }}
                            isInvalid={!!errors[`${errorKey}.type`]}
                        >
                            <option>Tipo de pregunta</option>
                            {
                                QUESTION_TYPE_OPTIONS.map(option => (
                                    <option key={option.value} value={option.value}>{option.name}</option>
                                ))
                            }
                        </Form.Control>
                        <Form.Control.Feedback type="invalid">
                            { errors[`${errorKey}.type`] }
                        </Form.Control.Feedback>
                    </Col>
                </Row>

                <Container>
                    { renderAnswers() }

                    <Button size="sm" className="mt-2" variant="outline-primary"
                        onClick={() => pollDispatch({
                            type: "newanswer",
                            index
                        })}
                    ><PlusLg/>Añadir respuesta
                    </Button>
                </Container>

                <hr/>

                <div className="d-flex justify-content-end">
                    <span data-tip="Añadir pregunta">
                        <PlusCircle className="option-question-icon ms-1"
                            onClick={() => pollDispatch({
                                type: "newquestion",
                                index: index
                            })}
                        ></PlusCircle>
                    </span>
                    <span data-tip="Eliminar pregunta">
                        <Trash className="option-question-icon ms-1"
                            onClick={() => pollDispatch({
                                type: "removequestion",
                                questionId: question.id
                            })}
                        ></Trash>
                    </span>
                </div>

                <ReactTooltip place="left" effect="solid"/>

            </Card.Body>
        </Card>
    );
}

export default Question;