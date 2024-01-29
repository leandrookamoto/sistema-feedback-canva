import Chart from './Chart';
import './Home.css';
import { useState, useEffect } from 'react';

export default function Home({ usuario, listaCadastro, avalDoFuncionario }) {
  //Constantes para conseguir o ano atual
  const dataAtual = new Date();
  const anoAtual = dataAtual.getFullYear();
  //Constante responsável pela gravação do estado das avaliações realizadas para análise de metas
  const [avaliacoesRealizadas, setAvaliacoesRealizadas] = useState([]);
  // Obter o mês atual (retornado como um número, onde janeiro é 0 e dezembro é 11)
  const mesAtual = dataAtual.getMonth();
  //Constantes para gravação de estado
  const [mes,setMes] = useState(mesAtual);
  const [ano,setAno] = useState(anoAtual);

  // Lista de nomes dos meses
  const meses = [
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

  // Obter o nome do mês correspondente ao índice retornado por getMonth()
  const nomeMesAtual = meses[mes];

  const ultimosMeses = [];
  for (let i = mes; i > mes - 5; i--) {
    if (i >= 0) {
      ultimosMeses.unshift(meses[i]);
    }
  }

  //Constante para verificar o número da meta
  const meta = (listaCadastro.length * 0.86).toFixed(0);

  // Exibir o array resultante
  console.log(ultimosMeses);

  //useEffect responsável pela retirada das informações do banco de dados através do props listaCadastro
  useEffect(() => {
    const lista = listaCadastro.map((item) => item.avaliacoes);
    let novaLista = lista.filter((item) => Array.isArray(JSON.parse(item)));

    let arrayDeObjetos = [];

    for (let i = 0; i < novaLista.length; i++) {
      const item = novaLista[i];
      // Adiciona cada item (array) como um objeto ao arrayDeObjetos
      //Aqui faz o parse, pois os dados vem como JSON.stringfy do banco de dados
      arrayDeObjetos.push(JSON.parse(item));

      //gravação do local
      setAvaliacoesRealizadas(arrayDeObjetos);
    }
  }, []);

  //Funções principais
  function handleMeses(e){
    setMes(e.currentTarget.value);
  }

  //Lógica para o cálculo dos feedbacks feitos
  //Constantes para comparação das avaliações (se tem) e datas
  //Aqui puxa os dados de todos os funcionários que se cadastraram no feedback do funcionário
  //Os dados do banco vem por props com a const avalDoFuncionario
  let nomesDiferentes = [];
  const listaCadastrados = listaCadastro.filter((obj1) => {
    const obj2 = avalDoFuncionario.find((obj) => obj.nome === obj1.nome);
    if (!obj2 || obj1.nome !== obj2.nome) {
      nomesDiferentes.push(obj1);
      return false;
    }
    return true;
  });

  console.log('1 listaCadastrados', listaCadastrados);
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
  console.log('2 comparaCadastrados', comparaCadastrados);
  //Aqui pega os valores do banco de dados do app dos funcionários e faz o parse na chave avaliacoes
  //parar facilitar
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
  console.log('3 comparaAvaliacoesFuncionario', comparaAvaliacoesFuncionario);
  //Aqui pega as avaliações realizadas pelos funcionarios e retorna somente aquelas que forem iguais
  //as datas selecionadas pelo usuário
  const verificaDataFuncionario = comparaAvaliacoesFuncionario.filter(
    (objetoA) => {
      try {
        // Verifica se o objeto da Lista A possui a data e ano selecionados
        const possuiDataAno =
          Array.isArray(objetoA.avaliacoes) &&
          objetoA.avaliacoes.some(
            (avaliacao) =>
              avaliacao.ano === anoAtual && avaliacao.mes === nomeMesAtual,
          );

        // Retorna verdadeiro se as condições forem atendidas
        return possuiDataAno;
      } catch (error) {
        console.error('Erro ao fazer parsing do JSON:', error);
        return false;
      }
    },
  );
  console.log('4 verificaDataFuncionario', verificaDataFuncionario);

  const listaFeedChefe3 = comparaCadastrados.filter((objetoA) => {
    try {
      // Verifica se o objeto da Lista A possui a data e ano selecionados
      const possuiDataAno =
        Array.isArray(objetoA.avaliacoes) &&
        objetoA.avaliacoes.some(
          (avaliacao) =>
            avaliacao.ano === anoAtual && avaliacao.mes === nomeMesAtual,
        );

      // Retorna verdadeiro se as condições forem atendidas
      return possuiDataAno;
    } catch (error) {
      console.error('Erro ao fazer parsing do JSON:', error);
      return false;
    }
  });
  console.log('5 listaFeedChefe3', listaFeedChefe3);

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


  //Lógica para formar os dados para o gráfico
  const totaisPorMes = ultimosMeses.map((mes) => {
    const verificaDataFuncionarioMes = comparaAvaliacoesFuncionario.filter((objetoA) => {
      try {
        const possuiDataAno = Array.isArray(objetoA.avaliacoes) &&
          objetoA.avaliacoes.some(
            (avaliacao) => avaliacao.ano === ano && avaliacao.mes === mes,
          );
        return possuiDataAno;
      } catch (error) {
        console.error('Erro ao fazer parsing do JSON:', error);
        return false;
      }
    });
  
    const listaFeedChefeMes = comparaCadastrados.filter((objetoA) => {
      try {
        const possuiDataAno = Array.isArray(objetoA.avaliacoes) &&
          objetoA.avaliacoes.some(
            (avaliacao) => avaliacao.ano === anoAtual && avaliacao.mes === mes,
          );
        return possuiDataAno;
      } catch (error) {
        console.error('Erro ao fazer parsing do JSON:', error);
        return false;
      }
    });
  
    const listaFinalMes = listaFeedChefeMes.filter((objetoA) => {
      const objetoB = verificaDataFuncionarioMes.find(
        (objetoB) => objetoB.nome === objetoA.nome,
      );
      return objetoB;
    });
  
    return listaFinalMes.length;
  });
  
  console.log('totaisPorMes', totaisPorMes);

  //Data para a configuração do Chart.js
  const data = {
    labels: ultimosMeses,
    datasets: [
      {
        label: 'Feedbacks realizados',
        data: totaisPorMes,
        borderrowor: 'blue',
        backgroundrowor: 'blue',
      },
      {
        label: 'Metas',
        /*Aqui a meta é automaticamente preenchido de acordo com o número dos
        feedbacks de cima e de acordo com o número de funcionários cadastrados*/
        data: Array(5).fill(meta),
        borderrowor: 'red',
        backgroundrowor: 'red',
      },
    ],
  };

  return (
    <>
      <h5>Olá, {usuario}!</h5>
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
              onChange={handleMeses}
              value={mes}
            >
              <option selected>Escolha a data</option>
              {meses.map((item, index) => (
                <>
                  <option key={index} value={index}>
                    {item}
                  </option>
                </>
              ))}
            </select>
          </div>
      <h5>Números do mês atual: {nomeMesAtual}</h5>
      <div
        style={{
          width: '100%',
          height: '80px',
          display: 'flex',
        }}
      >
        <div
          style={{
            display: 'flex',
            width: '100%',
            marginRight: '10px',
            border: '1px solid rgb(204 204 204)',
          }}
        >
          <div
            style={{
              width: '40%',
              backgroundColor: '#1fc1ed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              fill="currentColor"
              class="bi bi-flag"
              viewBox="0 0 16 16"
            >
              <path d="M14.778.085A.5.5 0 0 1 15 .5V8a.5.5 0 0 1-.314.464L14.5 8l.186.464-.003.001-.006.003-.023.009a12 12 0 0 1-.397.15c-.264.095-.631.223-1.047.35-.816.252-1.879.523-2.71.523-.847 0-1.548-.28-2.158-.525l-.028-.01C7.68 8.71 7.14 8.5 6.5 8.5c-.7 0-1.638.23-2.437.477A20 20 0 0 0 3 9.342V15.5a.5.5 0 0 1-1 0V.5a.5.5 0 0 1 1 0v.282c.226-.079.496-.17.79-.26C4.606.272 5.67 0 6.5 0c.84 0 1.524.277 2.121.519l.043.018C9.286.788 9.828 1 10.5 1c.7 0 1.638-.23 2.437-.477a20 20 0 0 0 1.349-.476l.019-.007.004-.002h.001M14 1.221c-.22.078-.48.167-.766.255-.81.252-1.872.523-2.734.523-.886 0-1.592-.286-2.203-.534l-.008-.003C7.662 1.21 7.139 1 6.5 1c-.669 0-1.606.229-2.415.478A21 21 0 0 0 3 1.845v6.433c.22-.078.48-.167.766-.255C4.576 7.77 5.638 7.5 6.5 7.5c.847 0 1.548.28 2.158.525l.028.01C9.32 8.29 9.86 8.5 10.5 8.5c.668 0 1.606-.229 2.415-.478A21 21 0 0 0 14 7.655V1.222z" />
            </svg>
          </div>
          <div style={{ width: '60%', padding: '5px' }}>
            <div>Meta</div>
            <div>{meta}</div>
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            width: '100%',
            marginRight: '10px',
            border: '1px solid rgb(204 204 204)',
          }}
        >
          <div
            style={{
              width: '40%',
              backgroundColor: '#db4c3f',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              fill="currentColor"
              class="bi bi-calendar-check"
              viewBox="0 0 16 16"
            >
              <path d="M10.854 7.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708 0" />
              <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z" />
            </svg>
          </div>
          <div style={{ width: '60%', padding: '5px' }}>
            <div>Completos</div>
            <div>{listaFinal2.length}</div>
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            width: '100%',
            marginRight: '10px',
            border: '1px solid rgb(204 204 204)',
          }}
        >
          <div
            style={{
              width: '40%',
              backgroundColor: '#18a55d',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              fill="currentColor"
              class="bi bi-dash-circle"
              viewBox="0 0 16 16"
            >
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
              <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8" />
            </svg>
          </div>
          <div style={{ width: '60%', padding: '5px' }}>
          <div>Faltam</div>
            <div>{meta - listaFinal2.length}</div>
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            width: '100%',
            border: '1px solid rgb(204 204 204)',
          }}
        >
          <div
            style={{
              width: '40%',
              backgroundColor: '#f19b2c',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              fill="currentColor"
              class="bi bi-suitcase-lg-fill"
              viewBox="0 0 16 16"
            >
              <path d="M7 0a2 2 0 0 0-2 2H1.5A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14H2a.5.5 0 0 0 1 0h10a.5.5 0 0 0 1 0h.5a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2H11a2 2 0 0 0-2-2zM6 2a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1zM3 13V3h1v10zm9 0V3h1v10z" />
            </svg>
          </div>
          <div style={{ width: '60%', padding: '5px' }}>Férias</div>
        </div>
      </div>

      <section>
        <h5 className="mt-3">Gráfico das metas mensais do ano de {anoAtual}</h5>
        <Chart data={data} />
      </section>
    </>
  );
}
