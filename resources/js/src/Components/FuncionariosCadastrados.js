import {useState} from 'react';

export default function FuncionariosCadastrados(){
    const [filter, setFilter]=useState('');
    const [pessoas, setPessoas]=useState([]);
    const [page, setPage] = useState(1);
    var pageSize = 12;

}