import { useState, useEffect, useRef } from 'react';
import Card from './Card';
import Pagination from './Pagination';
import Lista from './Lista';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import Dialog from './Dialog';

export default function Planodeacao({
  setorChefe,
  avalDoFuncionario,
  anoPai,
  mesPai,
  emailPai,
}) {
  //Lembrar que se der bug de novo no CADASTRO fazer o useEffect para puxar os dados direto do banco
  //e isolar este componente.

  //Constantes para controle do Dialog
  const erase = 'Tem certeza?';
  const [openErase, setOpenErase] = useState(false);
  const [eraseLast, setEraseLast] = useState(false);
  const [newIndexButton, setNewIndexButton] = useState(null);

  //Variáveis para o estilo do search input
  const estiloInput = {
    position: 'relative',
    display: 'inline-block',
  };
  const estiloIcone = {
    position: 'absolute',
    top: '50%',
    left: '10px',
    transform: 'translateY(-50%)',
    color: 'gray',
  };

  //Constantes para controle de data
  const [mes, setMes] = useState('');
  const anoAtual = new Date().getFullYear();
  const [idFuncionario, setIdFuncionario] = useState(null);
  const [ano, setAno] = useState(anoAtual);
  const data = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
  ];
  //Constantes para gravação de estado
  const [inputs, setInputs] = useState([{ value: '', feito: false }]);
  const [listaCadastro, setListaCadastro] = useState([]);
  const [newIndex, setNewIndex] = useState(null);
  const [listaRender, setListaRender] = useState([]);

  //Constantes para renderização do plano de ação
  const [plano, setPlano] = useState(false);
  const [gravarPlano, setGravarPlano] = useState(false);
  const [inputsFiltrados, setInputsFiltrados] = useState([]);

  //const para evitar o useEffect no inicio
  const montagemInicial = useRef(true);

  //Constantes que controlam o page
  const [page, setPage] = useState(1);
  const pageSize = 3;
  let totalPage = 1;
  try {
    totalPage = Math.ceil(listaFinal2.length / pageSize);
  } catch (error) {
    console.log('Erro do totalPage', error);
  }

  //Função responsável por pegar os dados do banco e deixar atualizado neste componente
  async function fetchData() {
    const responseListaOriginal = await axios.get('/cadastrados/' + setorChefe);
    const listaOriginal = responseListaOriginal.data;
    setListaCadastro(listaOriginal);
  }

  //useEffect para manter dados atualizados
  useEffect(() => {
    fetchData();
  }, []);

  //useEffect para evitar o bug da troca de data
  useEffect(() => {
    setListaRender([]);
  }, [ano, mes]);

  //useEffect para receber os dados do componente Pendentes
  useEffect(() => {
    if (montagemInicial.current) {
      montagemInicial.current = false;
      return;
    }
    setAno(anoPai);
    setMes(mesPai);
    pesquisar(emailPai);
  }, [anoPai, mesPai, emailPai]);

  //useEffect para filtrar o inputs
  useEffect(() => {
    const lista = inputs.filter((item) => item.mes == mes && item.ano == ano);
    setInputsFiltrados(lista);
    atualizaInputs();
    //Função para manter os dados atualizados
    fetchData();
  }, [inputs]);

  let nomesDiferentes = [];
  const listaCadastrados = listaCadastro.filter((obj1) => {
    const obj2 = avalDoFuncionario.find((obj) => obj.nome === obj1.nome);
    if (!obj2 || obj1.nome !== obj2.nome) {
      nomesDiferentes.push(obj1);
      return false;
    }
    return true;
  });

  //Aqui somente faz o parse das avaliações para facilitar, pois vem como stringfy do banco
  const comparaCadastrados = listaCadastrados.map((objeto) => {
    if (objeto.avaliacoes && typeof objeto.avaliacoes === 'string') {
      try {
        return { ...objeto, avaliacoes: JSON.parse(objeto.avaliacoes) };
      } catch (error) {
        return objeto;
      }
    }
    return objeto;
  });

  //Aqui pega os valores do banco de dados do app dos funcionários e faz o parse na chave avaliacoes
  //para facilitar
  let comparaAvaliacoesFuncionario = avalDoFuncionario.map((objeto) => {
    // Verifica se o objeto tem a chave 'avaliacoes' e se o valor é uma string JSON
    if (objeto.avaliacoes && typeof objeto.avaliacoes === 'string') {
      try {
        // Tenta fazer o parse da string JSON e atribuir de volta à chave 'avaliacoes'
        return { ...objeto, avaliacoes: JSON.parse(objeto.avaliacoes) };
      } catch (error) {
        // Se não for uma string JSON válida, mantém o valor original
        return objeto;
      }
    }
    // Se não tiver a chave 'avaliacoes' ou se o valor não for uma string, mantém o objeto original
    return objeto;
  });

  //Aqui pega as avaliações realizadas pelos funcionarios e retorna somente aquelas que forem iguais
  //as datas selecionadas pelo usuário
  const verificaDataFuncionario = comparaAvaliacoesFuncionario.filter(
    (objetoA) => {
      try {
        // Verifica se o objeto da Lista A possui a data e ano selecionados
        const possuiDataAno =
          Array.isArray(objetoA.avaliacoes) &&
          objetoA.avaliacoes.some(
            (avaliacao) => avaliacao.ano === ano && avaliacao.mes === mes,
          );

        // Retorna verdadeiro se as condições forem atendidas
        return possuiDataAno;
      } catch (error) {
        console.error('Erro ao fazer parsing do JSON:', error);
        return false;
      }
    },
  );

  const listaFeedChefe3 = comparaCadastrados.filter((objetoA) => {
    try {
      // Verifica se o objeto da Lista A possui a data e ano selecionados
      const possuiDataAno =
        Array.isArray(objetoA.avaliacoes) &&
        objetoA.avaliacoes.some(
          (avaliacao) => avaliacao.ano === ano && avaliacao.mes === mes,
        );

      // Retorna verdadeiro se as condições forem atendidas
      return possuiDataAno;
    } catch (error) {
      console.error('Erro ao fazer parsing do JSON:', error);
      return false;
    }
  });

  console.log('listaFeedChefe3', listaFeedChefe3);

  //Aqui faz a comparação se existe o valor do verificaDataFuncionario e do listaChefe2, pois se existir
  //significa que ambos fizeram o feedback e retorna numa lista final
  let listaFinal2 = listaFeedChefe3.filter((objetoA) => {
    // Verifica se o objeto da Lista A possui um objeto correspondente na Lista B
    const objetoB = verificaDataFuncionario.find(
      (objetoB) => objetoB.nome === objetoA.nome,
    );
    // Retorna true apenas se não houver correspondência na Lista B
    return objetoB;
  });

  console.log('listaFinal2', listaFinal2);

  const handleData = (e) => {
    setMes(e.currentTarget.value);
  };

  function handleChange(event, value) {
    setPage(Math.min(value, totalPage));
  }

  //Funções principais
  async function gravar() {
    setPlano(true);

    //Função para deixar os dados atualizados
    fetchData();
  }

  //Lógica da lista de tudo completo!
  //Aqui pega as avaliações realizadas pelos funcionarios e retorna somente aquelas que forem iguais
  //as datas selecionadas pelo usuário
  let comparaPlanoFuncionario = listaCadastro.map((objeto) => {
    // Verifica se o objeto tem a chave 'avaliacoes' e se o valor é uma string JSON
    if (objeto.plano && typeof objeto.plano === 'string') {
      try {
        // Tenta fazer o parse da string JSON e atribuir de volta à chave 'avaliacoes'
        return { ...objeto, plano: JSON.parse(objeto.plano) };
      } catch (error) {
        // Se não for uma string JSON válida, mantém o valor original
        return objeto;
      }
    }
    // Se não tiver a chave 'avaliacoes' ou se o valor não for uma string, mantém o objeto original
    return objeto;
  });

  console.log('comparaPlanoFuncionario', comparaPlanoFuncionario);

  const verificaDataFuncionarioPlano = comparaPlanoFuncionario.filter(
    (objetoA) => {
      try {
        // Verifica se o objeto da Lista A possui a data e ano selecionados
        const possuiDataAno =
          Array.isArray(objetoA.plano) &&
          objetoA.plano.some((item) => item.ano === ano && item.mes === mes);
        // Retorna verdadeiro se as condições forem atendidas
        return possuiDataAno;
      } catch (error) {
        console.error('Erro ao fazer parsing do JSON:', error);
        return false;
      }
    },
  );

  console.log('verificaDataFuncionarioPlano', verificaDataFuncionarioPlano);

  const verificaDataPlano = verificaDataFuncionarioPlano.map((item) => {
    // Crie uma cópia do objeto original
    const newObj = { ...item };

    // Aplique o filtro apenas na chave "plano"
    newObj.plano = item.plano.filter(
      (planoItem) => planoItem.ano == ano && planoItem.mes == mes,
    );

    return newObj;
  });

  console.log('verificaDataPlano', verificaDataPlano);

  const verificaDataPlano2 = verificaDataPlano.filter((item) =>
    item.plano.every((planoItem) => planoItem.feito === true),
  );
  const emails = verificaDataPlano2.map((item) => item.email);
  listaFinal2 = listaFinal2.map((item) => {
    const newItem = { ...item };
    newItem.completo = emails.includes(newItem.email);
    return newItem;
  });
  console.log('listaFinal2', listaFinal2);

  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  let currentDisplayList3 =
    listaRender.length > 0
      ? orderEmployeeData(listaRender).slice(startIndex, endIndex)
      : orderEmployeeData(listaFinal2).slice(startIndex, endIndex);

  // Função de pesquisa
  async function pesquisar(e) {
    try {
      let listaOriginal = [];
      if (e.length > 0) {
        // Faz a requisição e aguarda a resolução da Promessa
        const responseListaOriginal = await axios.get(
          '/cadastrados/' + setorChefe,
          console.log('Está fazendo a requisição'),
        );

        // Obtém os dados da resposta
        listaOriginal = responseListaOriginal.data;
      }

      const orderedList = orderEmployeeData(listaFinal2);
      let nova;
      let mail;

      try {
        nova = capitalizeWords(e.currentTarget.value).trim();
        mail = e.currentTarget.value.trim().toLowerCase();
      } catch {
        // Lida com o erro de captura de valor
      }

      let novaListaFiltrada = [];

      try {
        novaListaFiltrada = orderedList.filter(
          (item) => item.nome.includes(nova) || item.email.includes(mail),
        );

        if (novaListaFiltrada.length === 0) {
          const novaLista = listaOriginal.filter((item) => item.email === e);
          console.log('listaCadastro', listaCadastro);
          console.log('novaLista', novaLista);

          if (novaLista.length > 0) {
            setListaRender(novaLista);
            setPage(1);
            return;
          }
        }

        setListaRender(novaListaFiltrada);
        setPage(1);
      } catch (error) {
        console.log('Erro do pesquisar', error);
      }
    } catch (error) {
      console.error('Erro ao obter dados:', error);
    }
  }

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

  //Função para editar a lista do plano de ação
  function editar(index) {
    const lista = inputsFiltrados[index];
    setPlano(false);
    const novoIndex = inputs.findIndex(
      (item) => item.ano == ano && item.mes == mes && lista.plano == item.plano,
    );
    setNewIndex(novoIndex);
    //Função para deixar os dados atualizados
    fetchData();
  }

  //Função apagar
  function apagar(index) {
    console.log('index',index);
  
    if (inputs.length> 1||eraseLast) {
      setOpenErase(false);
  
      const lista = newIndexButton ? inputsFiltrados[newIndexButton] : inputsFiltrados[index];
      const novoIndex = inputs.findIndex(
        (item) => item.ano === ano && item.mes === mes && lista.plano === item.plano
      );
  
      let newInputs = [...inputs];
      newInputs.splice(novoIndex, 1);
      setInputs(newInputs);
      
      setNewIndexButton(null);
      
    } else {
      setEraseLast(true);
      setOpenErase(true);
      setNewIndexButton(index);
    }

            
 
  }

  
  
  //Funções para deixar os inputs dinâmicos
  const handleInputChange = (event) => {
    let newInputs = [...inputs];
    const novaLista = {
      plano: event.currentTarget.value,
      feito: false,
      ano: ano,
      mes: mes,
    };
    if (newIndex) {
      newInputs[newIndex] = novaLista;
    }

    // Certifique-se de que o índice existe no array antes de acessar a propriedade
    if (newInputs[newIndex]) {
      newInputs[newIndex] = novaLista;
      setInputs(newInputs);
    }
  };

  function voltar() {
    setGravarPlano(false);
    setInputs([]);
    setPlano(false);
  }

  const handleAddInput = () => {
    setNewIndex(inputs.length);
    setInputs([...inputs, { value: '', feito: false, ano: ano, mes: mes }]);
  };

  function selecionarFuncionario(id) {
    setIdFuncionario(id);
    setGravarPlano(true);
    const lista = listaCadastro.filter((item) => item.id == id);

    let newPlan = [];
    try {
      newPlan = JSON.parse(lista[0].plano);
      if (newPlan.length > 0) {
        const lista = newPlan.filter(
          (item) => item.mes == mes && item.ano == ano,
        );
        if (lista.length > 0) {
          setPlano(true);
        } else {
          setPlano(false);
        }
        setInputs(newPlan);
      }
    } catch (error) {
      console.log('Erro no parse do plano', error);
    }
  }

  //Função para deixar o input atualizado
  async function atualizaInputs() {
    console.log('eraseLast', eraseLast);
    if (inputs.length > 0 || eraseLast) {
      try {
        await axios.put(`/cadastro/${idFuncionario}/update-plano`, {
          plano: inputs,
        });
        console.log('Gravado com sucesso!');
      } catch (error) {
        console.log('Erro ao fazer a gravação do plano', error);
      }
      setEraseLast(false);
    }
  }

  //Função auxiliar para a ordenação dos funcionários por nome
  function orderEmployeeData(data) {
    return [...data].sort((a, b) => {
      const nomeA = a.nome.toUpperCase();
      const nomeB = b.nome.toUpperCase();
      if (nomeA < nomeB) return -1;
      if (nomeA > nomeB) return 1;
      return 0;
    });
  }

  return (
    <>
      {!gravarPlano && (
        <>
          <div className="container w-100 mb-3">
            <h5>Escolha a data</h5>
            <div className="container text-center">
              <div className="row align-items-start mb-1">
                <div
                  className={
                    anoAtual - 2 === ano
                      ? 'col border p-1 bg-dark text-white'
                      : 'col border p-1'
                  }
                  style={{ cursor: 'pointer' }}
                  onClick={() => setAno(anoAtual - 2)}
                >
                  {anoAtual - 2}
                </div>
                <div
                  className={
                    anoAtual - 1 === ano
                      ? 'col border p-1 bg-dark text-white'
                      : 'col border p-1'
                  }
                  style={{ cursor: 'pointer' }}
                  onClick={() => setAno(anoAtual - 1)}
                >
                  {anoAtual - 1}
                </div>
                <div
                  className={
                    anoAtual === ano
                      ? 'col border p-1 bg-dark text-white'
                      : 'col border p-1'
                  }
                  style={{ cursor: 'pointer' }}
                  onClick={() => setAno(anoAtual)}
                >
                  {anoAtual}
                </div>
                <div
                  className={
                    anoAtual + 1 === ano
                      ? 'col border p-1 bg-dark text-white'
                      : 'col border p-1'
                  }
                  style={{ cursor: 'pointer' }}
                  onClick={() => setAno(anoAtual + 1)}
                >
                  {anoAtual + 1}
                </div>
                <div
                  className={
                    anoAtual + 2 === ano
                      ? 'col border p-1 bg-dark text-white'
                      : 'col border p-1'
                  }
                  style={{ cursor: 'pointer' }}
                  onClick={() => setAno(anoAtual + 2)}
                >
                  {anoAtual + 2}
                </div>
              </div>
            </div>
            <select
              className="form-select mb-2"
              aria-label="Default select example"
              onChange={handleData}
              value={mes}
            >
              <option selected>Escolha a data</option>
              {data.map((item, index) => (
                <>
                  <option key={index} value={item}>
                    {item}
                  </option>
                </>
              ))}
            </select>
          </div>
        </>
      )}
      {!gravarPlano && (
        <>
          {(!ano || !mes) && (
            <h5 style={{ color: 'rgb(34 155 175)' }}>Favor colocar a data!</h5>
          )}
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
          {currentDisplayList3.map((item) => {
            return (
              <div key={item.id} onClick={() => selecionarFuncionario(item.id)}>
                <Card
                  nome={item.nome}
                  email={item.email}
                  setor={item.setor}
                  chefe={item.administrador}
                  botao1={!item.completo ? 'Selecionar' : 'Completo'}
                />
              </div>
            );
          })}

          <Pagination
            page={page}
            handleChange={handleChange}
            totalPage={totalPage}
          />
        </>
      )}

      {/* Parte da renderização do plano de ação */}
      {listaFinal2.length > 0 && !plano && idFuncionario && gravarPlano && (
        <>
          <h5>Plano de ação</h5>
          <h6>
            {mes}/{ano}
          </h6>
          <div className="mb-1 mt-6" style={{ marginTop: '-5px' }}>
            {inputsFiltrados.map((input, index) => (
              <div key={index}>
                <input
                  type="text"
                  value={input.plano}
                  onChange={(event) => handleInputChange(event)}
                  placeholder="Colocar o plano de ação. Ex: Fazer treinamentos"
                  className="form-control mb-2"
                />
              </div>
            ))}
            <AddCircleRoundedIcon
              style={{ color: '#0d6efd', fontSize: '40px', cursor: 'pointer' }}
              onClick={handleAddInput}
            />
          </div>
          <div className="d-flex">
            <button type="button" className="btn btn-primary" onClick={gravar}>
              Gravar
            </button>
            <button
              type="button"
              class="btn btn-primary ml-3"
              onClick={() => setGravarPlano(false)}
            >
              Voltar
            </button>
          </div>
        </>
      )}

      {listaFinal2.length > 0 && plano && idFuncionario && gravarPlano && (
        <>
          <h5 className="mt-3">Plano de ação</h5>
          <h6>
            {mes}/{ano}
          </h6>
          <Lista
            listaPlano={inputs}
            onClickEdit={(index) => editar(index)}
            onClickApagar={(index) => apagar(index)}
            ano={ano}
            mes={mes}
          />
          <button type="button" class="btn btn-primary mt-3" onClick={voltar}>
            Voltar
          </button>
        </>
      )}
      <Dialog
        open={openErase}
        descricao={erase}
        handleClose={() => setOpenErase(false)}
        Title="Atenção"
        button="Não"
        button2="Sim"
        handleButton={apagar}
      />
    </>
  );
}
