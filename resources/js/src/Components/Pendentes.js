import * as React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Check from '@mui/icons-material/Check';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PersonIcon from '@mui/icons-material/Person';
import AssignmentIcon from '@mui/icons-material/Assignment';
import Card from './Card';
import Box from '@mui/material/Box';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import Pagination from './Pagination';
import StepConnector, {
  stepConnectorClasses,
} from '@mui/material/StepConnector';
import { useState, useEffect, useRef, useMemo } from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Dialog from './Dialog';
import { Link as ScrollLink, animateScroll } from 'react-scroll';

//Parte do Material UI responsável pelo stepper
const QontoConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 10,
    left: 'calc(-50% + 16px)',
    right: 'calc(50% + 16px)',
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: '#784af4',
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: '#784af4',
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderColor:
      theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
    borderTopWidth: 3,
    borderRadius: 1,
  },
}));

const QontoStepIconRoot = styled('div')(({ theme, ownerState }) => ({
  color: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#eaeaf0',
  display: 'flex',
  height: 22,
  alignItems: 'center',
  ...(ownerState.active && {
    color: '#784af4',
  }),
  '& .QontoStepIcon-completedIcon': {
    color: '#784af4',
    zIndex: 1,
    fontSize: 18,
  },
  '& .QontoStepIcon-circle': {
    width: 8,
    height: 8,
    borderRadius: '50%',
    backgroundColor: 'currentColor',
  },
}));

function QontoStepIcon(props) {
  const { active, completed, className } = props;

  return (
    <QontoStepIconRoot ownerState={{ active }} className={className}>
      {completed ? (
        <Check className="QontoStepIcon-completedIcon" />
      ) : (
        <div className="QontoStepIcon-circle" />
      )}
    </QontoStepIconRoot>
  );
}

QontoStepIcon.propTypes = {
  /**
   * Whether this step is active.
   * @default false
   */
  active: PropTypes.bool,
  className: PropTypes.string,
  /**
   * Mark the step as completed. Is passed to child components.
   * @default false
   */
  completed: PropTypes.bool,
};

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)',
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)',
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor:
      theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
    borderRadius: 1,
  },
}));

const ColorlibStepIconRoot = styled('div')(({ theme, ownerState }) => ({
  backgroundColor:
    theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#ccc',
  zIndex: 1,
  color: '#fff',
  width: 50,
  height: 50,
  display: 'flex',
  borderRadius: '50%',
  justifyContent: 'center',
  alignItems: 'center',
  ...(ownerState.active && {
    backgroundImage:
      'linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)',
    boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
  }),
  ...(ownerState.completed && {
    backgroundImage:
      'linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)',
  }),
}));

function ColorlibStepIcon(props) {
  const { active, completed, className } = props;

  const icons = {
    1: <PlayArrowIcon />,
    2: <PersonIcon />,
    3: <AssignmentIcon />,
  };

  return (
    <ColorlibStepIconRoot
      ownerState={{ completed, active }}
      className={className}
    >
      {icons[String(props.icon)]}
    </ColorlibStepIconRoot>
  );
}

ColorlibStepIcon.propTypes = {
  /**
   * Whether this step is active.
   * @default false
   */
  active: PropTypes.bool,
  className: PropTypes.string,
  /**
   * Mark the step as completed. Is passed to child components.
   * @default false
   */
  completed: PropTypes.bool,
  /**
   * The label displayed in the step icon.
   */
  icon: PropTypes.node,
};

const steps = ['Início', 'Feedback funcionário', 'Plano de Ação'];

//O function component do React
export default function Pendentes({
  avalDoFuncionario,
  onChangeComponenteFeedBack,
  onChangeDados,
  setorChefe,
  onChangeComponentePlano,
  dadosUsuarioLogado,
}) {
  //Constantes do material UI para renderização dos steps
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set());
  //Constantes para gravação de estado
  const [listaRender, setListaRender] = useState([]);
  const [listaRender2, setListaRender2] = useState([]);
  const [listaCadastro, setListaCadastro] = useState([]);
  const [listaConfereFeedChefe, setListaConfereFeedChefe] = useState([]);
  const [listaParseAvaliacoes, setListaParseAvaliacoes] = useState([]);
  //Constantes para controle de data
  const dataAtual = new Date();
  const anoAtual = dataAtual.getFullYear();
  const [ano, setAno] = useState(dataAtual.getFullYear());
  const [openPlano, setOpenPlano] = useState(false);

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

  const mesAtual = dataAtual.getMonth();
  const [mes, setMes] = useState(data[mesAtual]);
  //Constantes que controlam o page
  const [page, setPage] = useState(1);
  const pageSize = 3;
  let totalPage = 1;
  try {
    totalPage = Math.ceil(listaRender.length / pageSize);
  } catch (error) {
    console.log('Erro do totalPage', error);
  }
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
  //Constantes para controle do Dialog
  const [open, setOpen] = useState(false);
  const [contagem, setContagem] = useState(3);
  const [openEmail, setOpenEmail] = useState(false);
  const descricaoFeed = `Você será encaminhado em ${contagem} segundos para o menu de feedback, onde poderá fornecer suas avaliações sobre o desempenho do colaborador.`;
  const sucessoEmail = 'Aviso por e-mail enviado com sucesso!';
  const descricaoPlano = `Você será encaminhado em ${contagem} segundos para o menu de plano de ação, onde poderá fornecer suas avaliações sobre o desempenho do colaborador.`;

  //useEffect para manter dados atualizados
  useEffect(() => {
    async function fetchData() {
      const responseListaOriginal = await axios.get(
        '/cadastrados/' + setorChefe,
      );
      const listaOriginal = responseListaOriginal.data;
      setListaCadastro(listaOriginal);

      const novasAvaliacoes = listaOriginal.map((objeto) => {
        if (objeto.avaliacoes && typeof objeto.avaliacoes === 'string') {
          try {
            return { ...objeto, avaliacoes: JSON.parse(objeto.avaliacoes) };
          } catch (error) {
            return objeto;
          }
        }
        return objeto;
      });
      
      setListaParseAvaliacoes(novasAvaliacoes);
    }

    fetchData();
  }, []);
  //Lógica da lista do primeiro step
  /*Formação da LISTA DO início do processo que são os funcionários 
  que o gestor ainda não realizou o feedback canva
  Fazendo o parse da chave avaliacoes para facilitar o processo, pois vem do banco de dados
  como stringfy*/

  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  //Renderização do primeiro step
  let currentDisplayList = orderEmployeeData(listaRender).slice(
    startIndex,
    endIndex,
  );

  //Lógica da lista do segundo step
  //Esta const pega a lista e verifica se há avaliações registradas do gestor na data selecionada

  const listaFeedChefe = listaParseAvaliacoes.filter((objeto) => {
    try {
      const avaliacoesArray = objeto.avaliacoes;
      return (
        Array.isArray(avaliacoesArray) &&
        avaliacoesArray.some(
          (avaliacao) => avaliacao.ano === ano && avaliacao.mes === mes,
        )
      );
    } catch (error) {
      console.error('Erro ao fazer parsing do JSON:', error);
      return false;
    }
  });
  console.log('listaFeedChefe', listaFeedChefe);

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

  //Esta const exclui do comparaCadastrados pessoas que tiverem dados do mês selecionado
  // Filtra o array de objetos
  const excluiMesFuncionario = comparaAvaliacoesFuncionario.filter((item) => {
    const temMesProcurado =
      item.avaliacoes &&
      item.avaliacoes.some(
        (avaliacao) => avaliacao.ano === ano && avaliacao.mes === mes,
      );

    return temMesProcurado;
  });

  //Aqui faz uma lista para comparação abaixo dos funcionários que fizeram feedback na mesma data
  //do que o gestor programa de feedback dos funcionários e excluindo caso sejam iguais, pois
  //isso significa que não está faltando o feedback do funcionário para a data escolhida
  const listaFeedChefe2 = excluiMesFuncionario.filter((objetoA) => {
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

  // Verifica se o nome do objeto da Lista A está presente na Lista B
  const listaFinal = listaFeedChefe.filter((objetoA) => {
    // Verifica se o objeto da Lista A possui um objeto correspondente na Lista B
    const objetoB = listaFeedChefe2.find(
      (objetoB) => objetoB.nome === objetoA.nome,
    );
    // Retorna true apenas se não houver correspondência na Lista B
    return !objetoB;
  });

  //Controles da paginação do segundo step coloquei aqui para evitar erro
  const [page2, setPage2] = useState(1);
  let totalPage2 = 1;
  try {
    totalPage2 = Math.ceil(listaFinal.length / pageSize);
  } catch (error) {
    console.log('Erro do totalPage', error);
  }
  const startIndex2 = (page2 - 1) * pageSize;
  const endIndex2 = startIndex2 + pageSize;
  let currentDisplayList2 = orderEmployeeData(listaFinal).slice(
    startIndex2,
    endIndex2,
  );

  //Lógica da lista do 3º step
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

  //Controles da paginação do segundo step coloquei aqui para evitar erro
  const [page3, setPage3] = useState(1);
  let totalPage3 = 1;
  try {
    totalPage3 = Math.ceil(listaFinal2.length / pageSize);
  } catch (error) {
    console.log('Erro do totalPage', error);
  }
  const startIndex3 = (page3 - 1) * pageSize;
  const endIndex3 = startIndex3 + pageSize;

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

  const verificaDataPlano = verificaDataFuncionarioPlano.map((item) => {
    // Crie uma cópia do objeto original
    const newObj = { ...item };

    // Aplique o filtro apenas na chave "plano"
    newObj.plano = item.plano.filter(
      (planoItem) => planoItem.ano == ano && planoItem.mes == mes,
    );

    return newObj;
  });

  const verificaDataPlano2 = verificaDataPlano.filter((item) =>
    item.plano.every((planoItem) => planoItem.feito === true),
  );

  const emailsToRemove = verificaDataPlano2.map((item) => item.email);
  listaFinal2 = listaFinal2.filter(
    (item) => !emailsToRemove.includes(item.email),
  );

  let currentDisplayList3 = orderEmployeeData(listaFinal2).slice(
    startIndex3,
    endIndex3,
  );

  //Controles da paginação do segundo step coloquei aqui para evitar erro
  const [page4, setPage4] = useState(1);
  let totalPage4 = 1;
  try {
    totalPage3 = Math.ceil(listaFinal2.length / pageSize);
  } catch (error) {
    console.log('Erro do totalPage', error);
  }
  const startIndex4 = (page4 - 1) * pageSize;
  const endIndex4 = startIndex4 + pageSize;
  let currentDisplayList4 = orderEmployeeData(verificaDataPlano2).slice(
    startIndex4,
    endIndex4,
  );

  //useEffects
  //useEffect responsável por ordenar a lista em ordem alfabética
  useEffect(() => {
    const novaLista = listaCadastro.map((objeto) => {
      if (objeto.avaliacoes && typeof objeto.avaliacoes === 'string') {
        try {
          return { ...objeto, avaliacoes: JSON.parse(objeto.avaliacoes) };
        } catch (error) {
          return objeto;
        }
      }
      return objeto;
    });
    /*Verifica se há alguma avaliação do gerente registrada no mês selecionado e se tiver excluindo
    da lista, pois na primeira lista quero todos os funcionários que não tem nenhum feedback registrado 
    no mês*/
    const lista = novaLista.filter((objeto) => {
      try {
        const avaliacoesArray = objeto.avaliacoes;
        return (
          !Array.isArray(avaliacoesArray) ||
          avaliacoesArray.length === 0 ||
          avaliacoesArray.every(
            (avaliacao) => avaliacao.ano !== ano || avaliacao.mes !== mes,
          )
        );
      } catch (error) {
        console.error('Erro ao fazer parsing do JSON:', error);
        return false;
      }
    });

    if (mes && ano) {
      const orderedList = orderEmployeeData(lista);
      setListaRender(orderedList);
      setPage(1);
    } else {
      setListaRender([]);
    }
  }, [mes, ano, listaCadastro]);
  //useEffect para fazer subir a tela toda vez que mudar pagination
  useEffect(() => {
    animateScroll.scrollToTop({
      duration: 1000, // Defina a duração desejada em milissegundos
    });
  }, [page, page2, page3]);

  //Funções principais
  //Seleciona pelo clique no card
  function selecionarFuncionario(id) {
    setOpen(true);

    const intervalId = setInterval(() => {
      setContagem((prevContagem) => prevContagem - 1);
    }, 1000);

    setTimeout(() => {
      const funcionarioSelecionado = listaCadastro.find(
        (funcionario) => funcionario.id === id,
      );

      onChangeDados(funcionarioSelecionado);
      onChangeComponenteFeedBack({
        homeRender: false,
        pendentes: false,
        cadastrar: false,
        feedback: true,
        planoDeAcao: false,
      });
    }, 3000);
    return () => clearInterval(intervalId);
  }

  //Seleciona para deixar pré selecionado para mandar para o componenente Plano de Ação
  function selecionarFuncionario3(id) {
    setOpenPlano(true);

    const intervalId = setInterval(() => {
      setContagem((prevContagem) => prevContagem - 1);
    }, 1000);

    setTimeout(() => {
      const funcionarioSelecionado = listaCadastro.find(
        (funcionario) => funcionario.id === id,
      );

      const lista = listaCadastrados.filter((item) => item.id == id);
      onChangeDados(funcionarioSelecionado);
      onChangeComponentePlano({
        homeRender: false,
        pendentes: false,
        cadastrar: false,
        feedback: false,
        planoDeAcao: true,
        ano: ano,
        mes: mes,
        email: lista[0].email,
      });
    }, 3000);

    return () => clearInterval(intervalId);
  }

  //Função para avisar funcionário
  //Conteúdo mensagem
  async function avisarFuncionario(id) {
    const mensagem = `
    Foi solicitado o envio do seu feedback pelo app Feedback Canva. Favor enviar o quanto antes. Qualquer dúvida contactar seu gestor.
    Obrigado`;

    try {
      const funcionario = listaCadastro.find((item) => item.id === id);

      if (!funcionario) {
        console.error('Funcionário não encontrado.');
        return;
      }
      const assuntoEmail = `${dadosUsuarioLogado.name} solicita o seu feedback`;

      const dadosEmail = {
        nome: funcionario.nome,
        email: funcionario.email,
        mensagem: mensagem,
        assunto: assuntoEmail,
        from: dadosUsuarioLogado.email,
        nomeChefe: dadosUsuarioLogado.name,
      };

      try {
        const resposta = await axios.post('/enviar-email', dadosEmail);

        if (resposta.data && resposta.data.mensagem) {
          console.log('Resposta do Backend:', resposta.data.mensagem);
          setOpenEmail(true);
        } else {
          console.error(
            'Resposta do Backend não possui a estrutura esperada:',
            resposta.data,
          );
        }
      } catch (erro) {
        console.error('Erro ao enviar e-mail:', erro);
      }
    } catch (erro) {
      console.error('Erro ao enviar e-mail:', erro);
    }
  }

  //Funções auxiliares
  //Função para a mudança de página
  function handleChange(event, value) {
    setPage(Math.min(value, totalPage));
  }

  function handleChange2(event, value) {
    setPage2(Math.min(value, totalPage2));
  }

  function handleChange3(event, value) {
    setPage3(Math.min(value, totalPage3));
  }
  function handleChange4(event, value) {
    setPage4(Math.min(value, totalPage4));
  }

  let comparacaoAvaliacoesListaCadastro = listaCadastro.map((objeto) => {
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

  //Função de pesquisa
  function pesquisar(e) {
    const orderedList = orderEmployeeData(listaConfereFeedChefe);
    const nova = capitalizeWords(e.currentTarget.value).trim();
    const mail = e.currentTarget.value.trim().toLowerCase();
    let novaListaFiltrada = [];
    try {
      novaListaFiltrada =
        orderedList.filter(
          (item) => item.nome.includes(nova) || item.email.includes(mail),
        ).length > 0
          ? orderedList.filter(
              (item) => item.nome.includes(nova) || item.email.includes(mail),
            )
          : listaRender;
    } catch (error) {
      console.log('Erro do pesquisar', error);
    }

    setListaRender(novaListaFiltrada);
    setPage(1);
  }

  //Função pesquisar do segundo step
  function pesquisar2(e) {
    const orderedList = orderEmployeeData(listaFeedChefe);
    const nova = capitalizeWords(e.currentTarget.value).trim();
    const mail = e.currentTarget.value.trim().toLowerCase();
    let novaListaFiltrada = [];
    try {
      novaListaFiltrada =
        orderedList.filter(
          (item) => item.nome.includes(nova) || item.email.includes(mail),
        ).length > 0
          ? orderedList.filter(
              (item) => item.nome.includes(nova) || item.email.includes(mail),
            )
          : listaRender2;
    } catch (error) {
      console.log('Erro do pesquisar', error);
    }

    setListaRender2(novaListaFiltrada);
    setPage(1);
  }

  //Função pesquisar do segundo step
  function pesquisar4(e) {
    const orderedList = orderEmployeeData(verificaDataPlano2);
    const nova = capitalizeWords(e.currentTarget.value).trim();
    const mail = e.currentTarget.value.trim().toLowerCase();
    let novaListaFiltrada = [];
    try {
      novaListaFiltrada =
        orderedList.filter(
          (item) => item.nome.includes(nova) || item.email.includes(mail),
        ).length > 0
          ? orderedList.filter(
              (item) => item.nome.includes(nova) || item.email.includes(mail),
            )
          : listaRender2;
    } catch (error) {
      console.log('Erro do pesquisar', error);
    }

    setListaRender2(novaListaFiltrada);
    setPage(1);
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
  const isStepOptional = (step) => {
    return step === 1;
  };

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    animateScroll.scrollToTop({
      duration: 1000,
    });
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    animateScroll.scrollToTop({
      duration: 1000,
    });
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const handleData = (e) => {
    setMes(e.currentTarget.value);
  };

  return (
    <Stack sx={{ width: '100%' }} spacing={4}>
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
        {(!ano || !mes) && (
          <h5 style={{ color: 'rgb(34 155 175)' }}>Favor colocar a data!</h5>
        )}
      </div>
      <Stepper
        alternativeLabel
        activeStep={activeStep}
        connector={<ColorlibConnector />}
      >
        {steps.map((label, index) => {
          const stepProps = {};
          const labelProps = {};
          if (isStepOptional(index)) {
            labelProps.optional = <Typography variant="caption"></Typography>;
          }
          if (isStepSkipped(index)) {
            stepProps.completed = false;
          }
          return (
            <Step key={label} {...stepProps}>
              <StepLabel StepIconComponent={ColorlibStepIcon} {...labelProps}>
                {label}
              </StepLabel>
            </Step>
          );
        })}
      </Stepper>

      {activeStep === steps.length ? (
        <React.Fragment>
          <Typography sx={{ mt: 2, mb: 1 }}>
            Todos os funcionários que estão o com feedback completo.
            <>
              {/* Renderização da lista de funcionários */}
              <div style={estiloInput}>
                <FontAwesomeIcon icon={faSearch} style={estiloIcone} />
                <input
                  type="text"
                  placeholder="Pesquisar"
                  onChange={pesquisar4}
                  style={{
                    paddingLeft: '30px',
                    width: '250px',
                    borderRadius: '5px',
                    border: '1px solid #ccc',
                    height: '40px',
                  }}
                />
              </div>
              {currentDisplayList4.map((item) => {
                return (
                  <div key={item.id}>
                    <Card
                      nome={item.nome}
                      email={item.email}
                      setor={item.setor}
                      chefe={item.administrador}
                      botao1="Completo"
                    />
                  </div>
                );
              })}
              <Pagination
                page={page4}
                handleChange={handleChange4}
                totalPage={totalPage4}
              />
            </>
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Box sx={{ flex: '1 1 auto' }} />
            <Button onClick={handleReset}>Reset</Button>
          </Box>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <Typography sx={{ mt: 1, mb: 1 }}>
            {/* Renderização do Inicio */}
            {activeStep === 0 && <>Início do processo</>}
            {/* Renderização do Feedback */}
            {activeStep === 1 && <>Faltando feedback do funcionário</>}
            {/* Renderização do Plano de Ação */}
            {activeStep === 2 && <>Faltando o plano de ação do funcionário</>}
          </Typography>

          <Typography sx={{ mt: 1, mb: 1 }}>
            {/* Renderização do Inicio */}
            {activeStep === 0 && (
              <>
                {/* Renderização da lista de funcionários */}
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
                {currentDisplayList.map((item) => {
                  return (
                    <div
                      key={item.id}
                      onClick={() => selecionarFuncionario(item.id)}
                    >
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
            {/* Renderização do Feedback */}
            {activeStep === 1 && (
              <>
                <div style={estiloInput}>
                  <FontAwesomeIcon icon={faSearch} style={estiloIcone} />
                  <input
                    type="text"
                    placeholder="Pesquisar"
                    onChange={pesquisar2}
                    style={{
                      paddingLeft: '30px',
                      width: '250px',
                      borderRadius: '5px',
                      border: '1px solid #ccc',
                      height: '40px',
                    }}
                  />
                </div>
                {currentDisplayList2.map((item) => (
                  <div key={item.id} onClick={() => avisarFuncionario(item.id)}>
                    <Card
                      nome={item.nome}
                      email={item.email}
                      setor={item.setor}
                      chefe={item.administrador}
                      botao1="Avisar Funcionário"
                    />
                  </div>
                ))}
                <Pagination
                  page={page}
                  handleChange={handleChange2}
                  totalPage={totalPage2}
                />
              </>
            )}

            {/* Renderização do Plano de Ação */}
            {activeStep === 2 && (
              <>
                {/* Renderização da lista de funcionários */}
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
                    <div
                      key={item.id}
                      onClick={() => selecionarFuncionario3(item.id)}
                    >
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
                  page={page3}
                  handleChange={handleChange3}
                  totalPage={totalPage3}
                />
              </>
            )}
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Button
              color="inherit"
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Back
            </Button>
            <Box sx={{ flex: '1 1 auto' }} />
            {isStepOptional(activeStep) && (
              <Button
                color="inherit"
                onClick={handleSkip}
                sx={{ mr: 1 }}
              ></Button>
            )}

            <Button onClick={handleNext}>
              {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
            </Button>
          </Box>
        </React.Fragment>
      )}
      <Dialog
        open={open}
        descricao={descricaoFeed}
        handleClose={() => setOpen(false)}
        Title="Atenção"
      />
      <Dialog
        open={openPlano}
        descricao={descricaoPlano}
        handleClose={() => setOpenPlano(false)}
        Title="Atenção"
      />
      <Dialog
        open={openEmail}
        descricao={sucessoEmail}
        handleClose={() => setOpenEmail(false)}
        Title="Atenção"
      />
    </Stack>
  );
}
