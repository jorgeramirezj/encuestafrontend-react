import { FC, useEffect, useState } from 'react';
import { getPollWithQuestions, createPollReply } from '../../_services/PollService';
import { PollReplyDetails, Question } from '../../types';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import ReplyQuestion from './ReplyQuestion';
import { UserAnswer } from '../../types/index';
import { Alert, Button, Spinner } from 'react-bootstrap';
import { Check2Circle } from 'react-bootstrap-icons';
import { useHistory } from 'react-router-dom';

interface PollProps {
    id: string
}

// Obenter el ID de nuestra interface de esta forma
const Poll:FC<PollProps> = ({id}) => {

    // Creamos un estado para esa POLL
    const [poll, setPoll] = useState<any>(null);
    const [user, setUser] = useState("");
    // Manejar los errores del backend
    const [errors, setErrors] = useState<any>({});
    // Creamos una pieza de estado: para contender los mensajes de validacion
    const [userAnswers, setuserAnswers] = useState<any>({});
    // Constante de alerta cuando ha sido todo OK
    const [isPollAnswered, setIsPollAnswered] = useState(false);
    // Pieza de estado para el tema de spinner de envio
    const [sendingData, setSendingData] = useState(false);
    const history = useHistory();

    useEffect(() => {
        fetchPoll();
    }, []);

    const fetchPoll = async () => {
        try{
            const res: any = await getPollWithQuestions(id);
            
            console.log(res.data);

            // Ordenamos realmente antes de ser asignadas al state
            const data = res.data;
            data.questions = data.questions.sort((a: Question, b: Question) => a.questionOrder - b.questionOrder);

            // Seteamos los datos
            setPoll(data);
        } catch (error: any){
            console.error(error);
            // TODO redireccionar a pagina principal cuando la encuesta no existe
            if(error.response.status === 500){
                history.replace("/");
            }
        }
    }

    const handleQuestionChange = (answer: UserAnswer) => {
        // Hacemos una copia para no hacer cambios directos en el state
        const answers = {...userAnswers}
        switch(answer.type){
            case "RADIO":
            case "SELECT": {
                answers[answer.questionId] = {questionId: answer.questionId, answerId: answer.answer};
                break;
            }
            case "CHECKBOX": {
                // Cuando Existe
                if(answers[answer.questionId]){
                    const arr = answers[answer.questionId].answers;
                    const index = arr.indexOf(answer.answer);
                    if(index === -1){
                        arr.push(answer.answer);
                    } else {
                        arr.length < 2 ? delete answers[answer.questionId]: arr.splice(index, 1);
                    }
                // Cuando No Existe
                } else {
                    answers[answer.questionId] = { questionId: answer.questionId, answers: [answer.answer]}
                }
                break;
            }
        }
        setuserAnswers(answers);
        //console.log(answers);
    }

    // Una funcion para renderizar el cuestionario
    const renderQuestions = () => {
        return poll.questions.map((question: Question) => <ReplyQuestion
            changeCallback={handleQuestionChange}
            question={question} key={question.id}
        ></ReplyQuestion>);
    }

    // Funcion para enviar nuestra data al backend (las respuestas)
    const prepareForm = () => {
        setErrors({});

        if(Object.keys(userAnswers).length !== poll.questions.length){
            // No se ha respodido todas las preguntas
            setErrors((current: any) => {
                return {...current, allQuestionsAnswered: "Por favor responda todas las preguntas"}
            });
            return;
        }

        let replies: PollReplyDetails[] = [];

        for(let key in userAnswers){
            if(userAnswers[key].answers){
                userAnswers[key].answers.forEach((id:number) => replies.push({
                    questionId: userAnswers[key].questionId, answerId: id
                }));
            } else {
                replies.push(userAnswers[key]);
            }
        }

        //console.log(answers);
        sendForm(replies);
    }

    const sendForm =async (replies: PollReplyDetails[]) => {
        try {
            setSendingData(true);
            await createPollReply({
                pollReplies: replies,
                poll: poll.id,
                user: user
            });
            setSendingData(false);
            setIsPollAnswered(true);
        } catch (errors: any) {
            if(errors.response){
                errors.response.status === 400 && setErrors(errors.response.data.errors)
            }
        }
    }

    return (
        <Container>
            <Row>
                <Col sm="10" md="10" lg="8" className='mx-auto mt-5 mb-5'>
                    {
                        isPollAnswered && 
                        <div className='d-flex align-items-center flex-column poll-answered-container'>
                            <Check2Circle className='success-icon'></Check2Circle>
                            <Alert show={isPollAnswered} variant='success'>
                                Muchas gracias por tu respuesta!
                            </Alert>
                        </div>
                    }
                    {
                        poll && !isPollAnswered && <>
                            <h2>{ poll.content }</h2><hr></hr>
                            <Form.Group className='mb-3' controlId='user'>
                                <Form.Label>Nombre</Form.Label>
                                <Form.Control
                                    value={user}
                                    onChange={e => setUser(e.target.value)}
                                    type="text"
                                    placeholder='e.g. Jorge Alberto'
                                    isInvalid={!!errors.user}
                                />
                                <Form.Control.Feedback type='invalid'>
                                    {errors.user}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <div>
                                { renderQuestions() }
                            </div>

                            <Button type="submit" onClick={prepareForm}>
                                    {sendingData ? <>
                                        <Spinner
                                            animation="border"
                                            as="span"
                                            size="sm"
                                            role="status"
                                            aria-hidden="true"
                                        ></Spinner>&nbsp;
                                        <span>Enviando respuesta...</span>
                                    </> : <>Responder encuesta</>}
                                </Button>

                            {
                                errors.allQuestionsAnswered && <Alert className='mt-4' variant='danger'>
                                    {errors.allQuestionsAnswered}
                                </Alert>
                            }
                        </>
                    }
                </Col>
            </Row>
        </Container>
    )
}

export default Poll;