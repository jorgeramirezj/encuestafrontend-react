import { getUserPolls } from "../_services/PollService";
import { useEffect, useState } from 'react';

const User = () => {

    // Creamos una pieza de estado - inicializada en 0 (cero)
    const [currentPage, setCurrentPage] = useState(0);

    useEffect(() => {
        fecthPolls();
    }, []);

    // creamos una funcion para traer las encuentas
    const fecthPolls = async () => {
        const res: any = await getUserPolls(currentPage);
        console.log(res);
    }

    return <div>User...</div>
}

export default User;