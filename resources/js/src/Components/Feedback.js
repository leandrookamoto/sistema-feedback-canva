import Card from './Card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect } from 'react';
import Pagination from './Pagination';
import Canva from './Canva';

export default function Feedback({ listaCadastro }) {
  //Variável para gravação de estado para a função pesquisar
  const [listaFiltrada, setListaFiltrada] = useState([]);
  const [dadosFuncionario, setDadosFuncionario] = useState([]);
  const [dadosFuncionarioSort, setDadosFuncionarioSort] = useState([]);
  const [idFuncionario, setIdFuncionario] = useState(null);
  const [filter, setFilter] = useState('');
  const [currentData, setCurrentData] = useState([]);
  const [funcionarioEscolhido, setFuncionarioEscolhido] = useState(false);
  const [avaliar, setAvaliar] = useState(false);
  const [historico, setHistorico] = useState(false);
  const [avaliar2, setAvaliar2] = useState(false);

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
  useEffect(() => {
    if (filter) {
      setPage(1);
    }
  }, [filter]);

  function is_Natural(n) {
    if (typeof n !== 'number') return 'Not a number';

    return n >= 0.0 && Math.floor(n) === n && n !== Infinity;
  }

  //UseEffect para fazer a ordenação por nome
  useEffect(() => {
    const dados = dadosFuncionario.sort((a, b) => {
      const nomeA = a.nome.toUpperCase();
      const nomeB = b.nome.toUpperCase();

      if (nomeA < nomeB) {
        return -1;
      }
      if (nomeA > nomeB) {
        return 1;
      }
      return 0;
    });

    setDadosFuncionarioSort(dados);
  }, [dadosFuncionario]);

  //Lógica para o controle da paginação
  const [page, setPage] = useState(1);
  const pageSize = 3;

  useEffect(() => {
    setPage(1); // Redefine a página para 1 sempre que a lista filtrada mudar
  }, [listaCadastro]);

  useEffect(() => {
    const offset = (page - 1) * pageSize;
    const dataToShow =
      listaFiltrada.length === 0
        ? listaCadastro.slice(offset, offset + pageSize)
        : listaFiltrada.slice(offset, offset + pageSize);

    setCurrentData(dataToShow);
  }, [page, pageSize, listaCadastro, listaFiltrada]);

  useEffect(() => {
    setDadosFuncionario(currentData);
  }, [currentData]);

  const totalPage = Math.ceil(
    (listaFiltrada.length === 0 ? listaCadastro.length : listaFiltrada.length) /
      pageSize,
  );

  const handleChange = (event, value) => {
    setPage(value);
  };

  //Função Capitalize
  //Função para padronizar a digitação dos inputs
  function capitalizeWords(sentence) {
    return sentence.toLowerCase().replace(/\b\w+/g, (match) => {
      if (match.toLowerCase() === 'de' || match.toLowerCase() === 'e') {
        return match.toLowerCase();
      } else {
        return match.charAt(0).toUpperCase() + match.slice(1); // Capitaliza as outras palavras
      }
    });
  }

  //Função de pesquisa
  function pesquisar(e) {
    const nova = capitalizeWords(e.currentTarget.value).trim();
    const mail = e.currentTarget.value.trim().toLowerCase();
    console.log(nova);
    const novaListaFiltrada = listaCadastro.filter(
      (item) => item.nome.includes(nova) || item.email.includes(mail),
    );
    console.log(listaFiltrada);
    setListaFiltrada(novaListaFiltrada);
    setPage(1);
  }

  //Função para voltar a tela do início da seleção dos funcionários
  function voltar() {
    setFuncionarioEscolhido((current) => !current);
    setDadosFuncionario(listaCadastro);
  }

  //Seleciona pelo clique no card
  function selecionarFuncionario(id) {
    const funcionarioSelecionado = listaCadastro.find(
      (funcionario) => funcionario.id === id,
    );

    if (funcionarioSelecionado) {
      // Define os dados do funcionário selecionado
      setDadosFuncionario([funcionarioSelecionado]);
      setIdFuncionario(id);

      // Redefine a página atual para 1 (ou outra página inicial)
      setPage(1);
      // Redefine os dados exibidos para conter apenas o funcionário selecionado
      setListaFiltrada([funcionarioSelecionado]); // ou outra lógica para exibir apenas o funcionário selecionado

      console.log(id);
      console.table([funcionarioSelecionado]);
    } else {
      console.error(`Funcionário com o ID ${id} não encontrado.`);
    }

    setFuncionarioEscolhido((current) => !current);
  }

  //Função para renderizar a avaliação
  function onClickBotao1() {
    setAvaliar(true);
    setAvaliar2(true);
  }

  console.log(avaliar);
  console.log(avaliar2);

  return (
    <>
      {!funcionarioEscolhido && (
        <>
          <h5>Escolha o funcionário</h5>

          <div style={estiloInput}>
            <FontAwesomeIcon icon={faSearch} style={estiloIcone} />
            <input
              type="text"
              placeholder="Pesquisar"
              onChange={pesquisar}
              style={{
                paddingLeft: '30px',
                width: '250px',
                borderRadius: '5px',
                border: '1px solid #ccc',
                height: '40px',
              }}
            />
          </div>

          {dadosFuncionarioSort.map((item) => (
            <div key={item.id} onClick={() => selecionarFuncionario(item.id)}>
              <Card
                nome={item.nome}
                email={item.email}
                setor={item.setor}
                chefe={item.administrador}
                botao1="Selecionar"
              />
            </div>
          ))}

          <Pagination
            page={page}
            handleChange={handleChange}
            totalPage={totalPage}
          />
        </>
      )}

      {funcionarioEscolhido && (
        <>
          {dadosFuncionarioSort.map((item) => (
            <div key={item.id}>
              <Card
                nome={item.nome}
                email={item.email}
                setor={item.setor}
                chefe={item.administrador}
                onClickBotao1={onClickBotao1}
                botao1="Avaliar"
                botao2="Histórico"
                historicoBotao={() => setHistorico((current) => !current)}
                botao3="Apagar"
                // apagarBotao={}
                botao4="Voltar"
                voltar={voltar}
              />
            </div>
          ))}
        </>
      )}

      {(avaliar || historico) && (
        <Canva
          historico={historico}
          avaliar2={avaliar2}
          onHistorico={(e) => setHistorico(e)}
          onAvaliacao={(e) => setAvaliar2(e)}
        />
      )}
    </>
  );
}
