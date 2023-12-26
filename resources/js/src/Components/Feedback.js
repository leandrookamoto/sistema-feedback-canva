import Card  from './Card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';


export default function Feedback({listaCadastro}){
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
      }


    return(<>
        <h5>Escolha o funcionário</h5>
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
        {listaCadastro.map((funcionario, index) => (
                  <div key={index}>
                    <Card
                      nome={funcionario.nome}
                      email={funcionario.email}
                      setor={funcionario.setor}
                      chefe={funcionario.administrador}
                    />
                    </div>
                  ))}
    </>)
}