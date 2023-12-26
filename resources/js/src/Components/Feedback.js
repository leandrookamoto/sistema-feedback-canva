import Card  from './Card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import {useState, useEffect} from 'react';
import Pagination from './Pagination';
import Canva from './Canva';



export default function Feedback({listaCadastro}){
    //Variável para gravação de estado para a função pesquisar
    const [listaFiltrada, setListaFiltrada] = useState([]);


    //Variáveis para o estilo do search input
    const estiloInput = {
        position: 'relative',
        display: 'inline-block',
      };
    
      const estiloIcone = {
        position: 'absolute',
        top: '50%',
        left: '10px', // Ajuste a posição do ícone conforme necessário
        transform: 'translateY(-50%)',
        color: 'gray',
      };


      //useEffect para o controle da paginação
      useEffect(()=>{
        if(filter){
          setPage(1);
        }
      },[filter]);
    
        function is_Natural(n) 
          {
           if (typeof n !== 'number') 
                return 'Not a number'; 
                
         return (n >= 0.0) && (Math.floor(n) === n) && n !== Infinity;
            }


        //Lógica para o controle da paginação
        const [page, setPage] = useState(1);
        const pageSize = 3;


        useEffect(() => {
            setPage(1); // Redefine a página para 1 sempre que a lista filtrada mudar
          }, [listaCadastro]);


        function pesquisar(e) {
    const busca = e.currentTarget.value.trim().toLowerCase();
    const novaListaFiltrada = listaCadastro.filter(
      (item) =>
        item.nome.toLowerCase().includes(busca) || // Verifica se o nome inclui a busca
        item.email.toLowerCase().includes(busca) // Verifica se o email inclui a busca
    );
    setListaFiltrada(novaListaFiltrada);
    setPage(1); // Redefine a página para 1 ao iniciar uma nova pesquisa
  }

  const offset = (page - 1) * pageSize;
  const currentData = listaFiltrada.length === 0 ? listaCadastro.slice(offset, offset + pageSize) : listaFiltrada.slice(offset, offset + pageSize);
  const totalPage = Math.ceil((listaFiltrada.length === 0 ? listaCadastro.length : listaFiltrada.length) / pageSize);

  const handleChange = (event, value) => {
    setPage(value);
  };
        const [filter, setFilter]=useState('');
        
      


        //Função Capitalize
      function capitalizeWords(sentence) {
        return sentence.toLowerCase().replace(/(^|\s)\S/g, (match) => match.toUpperCase());
      }

      //Função de pesquisa
      function pesquisar(e){
        const nova = capitalizeWords(e.currentTarget.value).trim();
        const mail = e.currentTarget.value.trim().toLowerCase();
        console.log(nova);
          const novaListaFiltrada = listaCadastro.filter((item)=>item.nome.includes(nova)||item.email.includes(mail));
          console.log(listaFiltrada)
          setListaFiltrada(novaListaFiltrada);
          setPage(1);
      }


    return(<>
        <h5>Escolha o funcionário</h5>
        <Canva/>


        <div style={estiloInput}>
                  <FontAwesomeIcon icon={faSearch} style={estiloIcone} />
                  <input
                    type="text"
                    placeholder="Pesquisar"
                    onChange={pesquisar}
                    style={{
                      paddingLeft: '30px', // Ajuste o espaçamento à esquerda para acomodar o ícone
                      width: '250px', // Ajuste a largura do input conforme necessário
                      borderRadius: '5px',
                      border: '1px solid #ccc',
                      height: '40px',
                    }}

                    
                  />
                </div>
        {/* Aqui é a renderização da lista de funcionários */}
        {currentData.map((item,index)=><div key={index} onClick={()=>selecionarFuncionario(index)}>
                <Card
                 nome={item.nome}
                 email={item.email}
                 setor={item.setor}
                 chefe={item.administrador}
                 avaliarBotao={()=>setHistorico(true)}
                 botao1='Selecionar'
                 />
                 </div>
                    )}


               

                <Pagination
                        page={page}
                        handleChange={handleChange}
                        totalPage={totalPage}
                    />
    </>)
}