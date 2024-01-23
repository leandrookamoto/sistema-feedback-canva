import { useState, useEffect } from 'react';
import Card from './Card';
import Pagination from './Pagination';
import Lista from './Lista';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';

export default function Planodeacao({ setorChefe, avalDoFuncionario }) {
  //Lembrar que se der bug de novo no CADASTRO fazer o useEffect para puxar os dados direto do banco
  //e isolar este componente.

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

  //Constantes para renderização do plano de ação
  const [plano, setPlano] = useState(false);
  const [gravarPlano, setGravarPlano] = useState(false);

  //Constantes que controlam o page
  const [page, setPage] = useState(1);
  const pageSize = 3;
  let totalPage = 1;
  try {
    totalPage = Math.ceil(listaCadastro.length / pageSize);
  } catch (error) {
    console.log('Erro do totalPage', error);
  }

   //useEffect para manter dados atualizados
   useEffect(()=>{
    async function fetchData(){
      const responseListaOriginal = await axios.get('/cadastrados/' + setorChefe);
      const listaOriginal = responseListaOriginal.data;
      setListaCadastro(listaOriginal);
    }

    fetchData();
  },[])

  let nomesDiferentes = [];
  const listaCadastrados = listaCadastro.filter((obj1) => {
    const obj2 = avalDoFuncionario.find((obj) => obj.nome === obj1.nome);
    if (!obj2 || obj1.nome !== obj2.nome) {
      nomesDiferentes.push(obj1);
      return false;
    }
    return true;
  });

  console.log('listaCadastrados', listaCadastrados);

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

  console.log('comparaCadastrados', comparaCadastrados);
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

  console.log('comparaAvaliacoesFuncionario', comparaAvaliacoesFuncionario);

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

  console.log('verificaDataFuncionario', verificaDataFuncionario);

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
  const listaFinal2 = listaFeedChefe3.filter((objetoA) => {
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
  function gravar() {
    setPlano(true);
  }

  //Função para editar a lista do plano de ação
  function editar() {
    setPlano(false);
  }

  function apagar(index) {
    let newInputs = [...inputs];
    newInputs.splice(index, 1);
    setInputs(newInputs);
  }

  //Funções para deixar os inputs dinâmicos
  const handleInputChange = (event, index) => {
    let newInputs = [...inputs];
    const novaLista = { plano: event.currentTarget.value, feito: false };
    newInputs[index] = novaLista;

    console.log('novaLista', novaLista);

    // Certifique-se de que o índice existe no array antes de acessar a propriedade
    if (newInputs[index]) {
      newInputs[index] = novaLista;
      setInputs(newInputs);
    }
  };

  const handleAddInput = () => {
    setInputs([...inputs, { value: '', feito: false }]);
  };

  function selecionarFuncionario(id) {
    setIdFuncionario(id);
    setGravarPlano(true);
  }

  return (
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
      {!gravarPlano && (
        <>
          {listaFinal2.map((item) => {
            return (
              <div key={item.id} onClick={() => selecionarFuncionario(item.id)}>
                <Card
                  nome={item.nome}
                  email={item.email}
                  setor={item.setor}
                  chefe={item.administrador}
                  botao1="Selecionar"
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

          <div className="mb-1 mt-6">
            <label htmlFor="exampleFormControlInput1" className="form-label">
              Plano
            </label>
            {inputs.map((input, index) => (
              <div key={index}>
                <input
                  type="text"
                  value={input.plano}
                  onChange={(event) => handleInputChange(event, index)}
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
          <div className='d-flex'>
            <button
              type="button"
              className="btn btn-primary"
              onClick={gravar}
            >
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
      {console.log('inputs', inputs)}
      {listaFinal2.length > 0 && plano && idFuncionario && gravarPlano && (
        <>
          <h5 className="mt-3">Plano de ação</h5>
          <Lista
            listaPlano={inputs.map((item) => item.plano)}
            onClickEdit={editar}
            onClickApagar={(index) => apagar(index)}
          />
        </>
      )}
    </>
  );
}