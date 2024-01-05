import Card from './Card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect } from 'react';
import Pagination from './Pagination';
import Canva from './Canva';

export default function Feedback({
  listaCadastro,
  usuario,
  onChangeListaCadastro,
  onChangeNewId,
  onChangeDadosFuncionario,
}) {
  //Variável para gravação de estado para a função pesquisar
  const [listaFiltrada, setListaFiltrada] = useState([]);
  const [dadosFuncionario, setDadosFuncionario] = useState([]);
  const [idFuncionario, setIdFuncionario] = useState(null);
  const [filter, setFilter] = useState('');
  const [funcionarioEscolhido, setFuncionarioEscolhido] = useState(false);
  const [avaliar, setAvaliar] = useState(false);
  const [historico, setHistorico] = useState(false);
  const [avaliar2, setAvaliar2] = useState(false);
  const [validacaoApagar, setValidacaoApagar] = useState(false);

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

  // useEffect para a ordenação por nome
  useEffect(() => {
    const dadosOrdenados = orderEmployeeData(dadosFuncionario);

    // Verifique se os dados ordenados são diferentes dos dados originais antes de atualizar o estado
    const isDifferent =
      JSON.stringify(dadosOrdenados) !== JSON.stringify(dadosFuncionario);

    // Atualize o estado apenas se os dados ordenados forem diferentes dos dados originais
    if (isDifferent) {
      setDadosFuncionario(dadosOrdenados);
    }
  }, [dadosFuncionario]);

  //Lógica para o controle da paginação
  const [page, setPage] = useState(1);
  var pageSize = 3;

  useEffect(() => {
    setPage(1);
  }, [listaCadastro]);

  const totalPage = Math.ceil(
    (listaFiltrada.length === 0 ? listaCadastro.length : listaFiltrada.length) /
      pageSize,
  );

  function orderEmployeeData(data) {
    return [...data].sort((a, b) => {
      const nomeA = a.nome.toUpperCase();
      const nomeB = b.nome.toUpperCase();
      if (nomeA < nomeB) return -1;
      if (nomeA > nomeB) return 1;
      return 0;
    });
  }

  useEffect(() => {
    const offset = (page - 1) * pageSize;
    const listaOrdenada =
      listaFiltrada.length === 0
        ? orderEmployeeData(listaCadastro)
        : orderEmployeeData(listaFiltrada);

    let dataToShow = listaOrdenada.slice(offset, offset + pageSize);

    console.table(dataToShow);
    setDadosFuncionario(dataToShow);
  }, [page, pageSize, listaCadastro, listaFiltrada]);

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
    setFuncionarioEscolhido(false);
    setDadosFuncionario(listaCadastro);
    setListaFiltrada(listaCadastro); // Redefinindo lista filtrada para lista completa
    setAvaliar(false);
    setAvaliar2(false);
    setHistorico(false);
  }

  //Seleciona pelo clique no card
  function selecionarFuncionario(id) {
    const funcionarioSelecionado = listaCadastro.find(
      (funcionario) => funcionario.id === id,
    );

    if (funcionarioSelecionado) {
      setDadosFuncionario([funcionarioSelecionado]);
      setIdFuncionario(id);
      setPage(1);
      setListaFiltrada([funcionarioSelecionado]);
      setFuncionarioEscolhido(true);
    } else {
      console.error(`Funcionário com o ID ${id} não encontrado.`);
    }
  }

  //Função para apagar funcionário
  async function apagar() {
    try {
      // Lógica para apagar o funcionário selecionado
      await axios.delete(`/deleteFuncionario/${idFuncionario}`);

      // Faz a requisição para obter a lista de funcionários atualizada
      const response = await axios.get('/cadastrados');
      const lista = response.data;
      const listaFiltrada2 = lista.filter(
        (item) => item.administrador === usuario,
      );
      const id = response.data.length ? lista[response.data.length - 1].id : 0;
      console.log(`Este é o id final: ${id}`);

      // Atualiza o estado dadosFuncionario com a lista filtrada recebida
      setDadosFuncionario(listaFiltrada2);
      setListaFiltrada(listaFiltrada2);
      onChangeListaCadastro(listaFiltrada2);
      onChangeNewId(id);

      // Agora que as operações assíncronas foram concluídas, atualiza a variável de controle
      setFuncionarioEscolhido(false);
    } catch (error) {
      // Tratar erros caso a deleção ou a requisição GET falhem
      console.error('Erro ao apagar o funcionário ou obter a lista:', error);
    }
  }

  //Função para renderizar a avaliação
  function onClickBotao1() {
    setAvaliar((current) => !current);
    setAvaliar2((current) => !current);
    setHistorico(false);
  }

  //Função para renderizar o Histórico
  function historicoBotao() {
    setHistorico((current) => !current);
    setAvaliar(false);
    setAvaliar2(false);
  }

  //Função para editar o funcionário
  function editar() {
    const dado = listaFiltrada.find((item) => item.id === idFuncionario);
    onChangeDadosFuncionario(dado);
    console.log(dado);
  }

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

          {dadosFuncionario.map((item) => (
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
          {dadosFuncionario.map((item) => (
            <div key={item.id}>
              <Card
                nome={item.nome}
                email={item.email}
                setor={item.setor}
                chefe={item.administrador}
                onClickBotao1={onClickBotao1}
                botao1="Avaliar"
                botao2="Histórico"
                historicoBotao={historicoBotao}
                botao3="Apagar"
                apagarBotao={apagar}
                botao4="Voltar"
                voltar={voltar}
                botao5="Editar"
                editar={editar}
              />
            </div>
          ))}
        </>
      )}

      {(avaliar || historico) && (
        <Canva
          historico={historico}
          avaliar2={avaliar2}
          idFuncionario={idFuncionario}
          onChangeId={(e) => setIdFuncionario(e)}
          listaCadastro={listaCadastro}
          onHistorico={(e) => setHistorico(e)}
          onAvaliacao={(e) => setAvaliar2(e)}
        />
      )}
    </>
  );
}
