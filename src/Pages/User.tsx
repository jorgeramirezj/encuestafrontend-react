import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Table from "react-bootstrap/Table";
import { deletePoll, getUserPolls, togglePollOpened } from "../_services/PollService";
import { useEffect, useState } from 'react';
import { List, Share, Trash } from "react-bootstrap-icons";
import ReactTooltip from "react-tooltip";
import Switch from "../UI/Switch";
import ReactPaginate from "react-paginate";
import copy from "copy-to-clipboard";
import { BASE_URL } from "../utils/constants";
import ToastContainer from 'react-bootstrap/ToastContainer';
import Toast from 'react-bootstrap/Toast';
import { confirmAlert } from "react-confirm-alert";
import { Link } from "react-router-dom";

const User = () => {

    // Creamos una pieza de estado - inicializada en 0 (cero)
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalRecords,setTotalRecords] = useState(0);
    const [showToast, setShowToast] = useState(false);
    const [polls, setPolls] = useState<any>([]);

    // Esta es una forma de hacer que un useEffect haga un cambio
    // En este caso, al cambiar el "currentPage" hara que se ejecute el "useEffect"
    useEffect(() => {
        fecthPolls();
    }, [currentPage]);

    // creamos una funcion para traer las encuentas
    const fecthPolls = async () => {
        const res: any = await getUserPolls(currentPage);
        setPolls(res.data.polls);
        setTotalPages(res.data.totalPages);
        setTotalRecords(res.data.totalRecords);
        // Esto hace fetching de las encuestas
        ReactTooltip.rebuild();
    }

    const handlePollToggle = async (id: number) => {
        // Copiamos nuestas polls, esto es una COPIA sin modificar directamente el STATE
        const _polls = [...polls];
        const poll = _polls.find(poll => poll.id === id);
        poll.opened = !poll.opened;
        setPolls(_polls);
        await togglePollOpened(poll.pollId);
    }

    const handlePageChange = (selectedItem: {selected: number}) => {
        setCurrentPage(selectedItem.selected);
    }

    const handleDeletePoll = (pollId: string) => {
        confirmAlert({
            // Esta es una forma de recibir una FUNCION por PROPIEDAD
            customUI: ({onClose}) => {
                return (
                    <div className="custom-ui">
                        <h2>Eliminar encuesta</h2>
                        <p>¿QUieres eliminar esta encueta?</p>
                        <Button variant="outline-primary" size="sm" className="me-2"
                        onClick={async () => {
                            await deletePoll(pollId);
                            currentPage === 0 ? fecthPolls() : setCurrentPage(0);
                            onClose();
                        }}
                        >Si, Eliminar!</Button>
                        <Button variant="outline-primary" size="sm" onClick={onClose}>No</Button>
                    </div>
                );
            }
        })
    }

    const renderTable = () => {
        return <Table className="mt-4 polls-table" striped bordered hover responsive>
            <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Recibir más respuestas</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                {
                    polls.map((poll: any) => {
                        return (
                            <tr key={poll.id}>
                                <td>{poll.content}</td>
                                <td>
                                    <Switch
                                        label={!!poll.opened ? "Activado" : "Cerrado"}
                                        checked={!!poll.opened}
                                        id={poll.pollId}
                                        onChange={() => {handlePollToggle(poll.id)}}
                                    >
                                    </Switch>
                                </td>
                                <td className="polls-table-controls">
                                    <span data-tip="Compartir encuesta"
                                    onClick={() => {
                                        copy(`${BASE_URL}/replypoll/${poll.pollId}`);
                                        setShowToast(true);
                                    }}
                                    ><Share></Share></span>
                                    <span data-tip="Ver resultados"><List></List></span>
                                    <span data-tip="Eliminar encuesta"
                                    onClick={() => handleDeletePoll(poll.pollId)}
                                    ><Trash></Trash></span>
                                </td>
                            </tr>
                        )
                    })
                }
            </tbody>
        </Table>
    }

    // ReactTooltip -> Para mostrar unos mensajes en los iconos
    return (
        <Container className="mt-5">
            <Row>
                <Col sm="10" md="10" lg="8" className="mx-auto">
                    <h5>Mis encuestas</h5>
                    {
                        totalRecords > 0 && polls ?
                        <>
                        { renderTable() }
                        <ReactPaginate
                            pageCount={totalPages}
                            forcePage={currentPage}
                            marginPagesDisplayed={2}
                            pageRangeDisplayed={2}
                            previousLabel="Anterior"
                            nextLabel="Siguiente"
                            containerClassName="pagination justify-content-end"
                            previousClassName="page-item"
                            previousLinkClassName="page-link"
                            nextClassName="page-item"
                            nextLinkClassName="page-link"
                            pageClassName="page-item"
                            pageLinkClassName="page-link"
                            activeClassName="active"
                            breakLabel="..."
                            onPageChange={handlePageChange}
                        ></ReactPaginate>
                        
                        <ReactTooltip place="top" effect="solid"/>
    
                        <ToastContainer position="bottom-center">
                            <Toast show={showToast} delay={5000} autohide onClose={() => setShowToast(false)}>
                                <Toast.Header closeButton={false}>Compartido!</Toast.Header>
                                <Toast.Body>Enlace copiado al portapapeles</Toast.Body>
                            </Toast>
                        </ToastContainer>
                        </>
                        :
                        <span className="d-block mt-5">No tienes encuestas <Link to="/createpoll">comienza</Link> a crear</span> 
                    }                    
                </Col>
            </Row>
        </Container>
    );
}

export default User;