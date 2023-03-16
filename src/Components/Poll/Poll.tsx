import { usePollDispatch, usePollState } from "../../context/pollContext";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Spinner from "react-bootstrap/Spinner";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";
import Question from "./Question";
// DragDropContext => un contexto para saber donde vamos 
// Droppable => para preguntas
// Draggable => para preguntas
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd"
import { v4 as uuid } from 'uuid';
import { savePoll } from "../../_services/PollService";
import { useState } from "react";

const Poll = () => {
    
    const [showToast, setShowToast] = useState(false);
    const [sendingData, setSendingData] = useState(false);

    const poll = usePollState();
    const pollDispatch = usePollDispatch();

    const errors: any = poll.errors;

    // Render questions
    const renderQuestions = () => {
        return poll.questions.map((question, index) => {
            return <Draggable key={question.id} draggableId={question.id} index={index}>
                {
                    (provided) => (
                        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                            <Question index={index}></Question>
                        </div>
                    )
                }
            </Draggable>
        });
    }

    //console.log(poll.questions);

    const handleOnDragEnd = (result: DropResult) => {
        //console.log(result);
        if (!result.destination) return;
        if (result.source.index === result.destination.index) return;
        pollDispatch({
            type: "orderquestions",
            payload: {
                source: result.source.index,
                destination: result.destination.index
            }
        });
    }

    const createPoll = async() => {
        const data = {
            content: poll.content,
            isOpened: poll.openend, 
            questions: poll.questions
        };

        try {
            setSendingData(true);
            await savePoll(data);
            pollDispatch({ type: 'resetformpoll' });
            setShowToast(true);
        } catch(errors: any){
            if(errors.response && errors.response.status === 400){
                pollDispatch({
                    type: 'seterrors',
                    errors: errors.response.data.errors
                });
            }
        }
        setSendingData(false);
    }

    return (
    <Container className="mt-5 mb-5">
        <Row>
            <Col className="mx-auto" sm="10" ms="10" lg="8">
                <FloatingLabel controlId="poll-content" label="Titulo de la encuesta">
                    <Form.Control
                    value={poll.content}
                    onChange={(e) => pollDispatch({
                        type:"pollcontent",
                        content: e.target.value
                    })}
                    size="lg"
                    type="text"
                    placeholder="Titulo de la encuesta"
                    isInvalid={!!errors?.content}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors?.content}
                    </Form.Control.Feedback>
                </FloatingLabel>

                <DragDropContext onDragEnd={handleOnDragEnd}>
                    <Droppable droppableId={uuid()}>
                        {
                            (provided) => (
                                <div {...provided.droppableProps} ref={provided.innerRef}>
                                    { renderQuestions() }
                                    { provided.placeholder }
                                </div>
                            )
                        }
                    </Droppable>
                </DragDropContext>

                <Button 
                    size="lg"
                    variant="outline-primary"
                    onClick={createPoll}
                    className="mt-5">
                        {sendingData ? <>
                            <Spinner
                                animation="border"
                                as="span"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                            ></Spinner>&nbsp;
                            <span>Iniciando sesión...</span>
                        </> : <>Crear encuesta</>}
                        </Button>
            </Col>
        </Row>

        <ToastContainer position="bottom-center">
            <Toast onClose={() => {setShowToast(false)}} show={showToast} delay={5000} autohide>
                <Toast.Header closeButton={false}>
                    <span>La encuesta ha sido creada</span>
                </Toast.Header>
                <Toast.Body>Puedes copiar el enlace desde el panel</Toast.Body>
            </Toast>
        </ToastContainer>
    </Container>
    );
}

export default Poll;