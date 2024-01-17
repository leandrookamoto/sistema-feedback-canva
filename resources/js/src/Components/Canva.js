import { faTruckField } from '@fortawesome/free-solid-svg-icons';
import './Canva.css';
import { useState, useEffect, useRef } from 'react';
import Dialog from './Dialog';
import emailjs from '@emailjs/browser';

export default function Canva({
  historico,
  avaliar2,
  onHistorico,
  onAvaliacao,
  idFuncionario,
  listaCadastro,
  usuario,
  setorChefe,
  avalDoFuncionario,
}) {
  //Constantes para gravação de estado para o canva
  const [listaCanva, setListaCanva] = useState([]);
  const [competencia, setCompetencia] = useState('');
  const [atividades, setAtividades] = useState('');
  const [listaAtividades, setListaAtividades] = useState([]);
  const [senioridade, setSenioridade] = useState('');
  const [fortes, setFortes] = useState('');
  const [listaFortes, setListaFortes] = useState([]);
  const [atencao, setAtencao] = useState('');
  const [listaAtencao, setListaAtencao] = useState([]);
  const [melhorias, setMelhorias] = useState('');
  const [listaMelhorias, setListaMelhorias] = useState([]);
  const [notes, setNotes] = useState({});
  const [notaFinal, setNotaFinal] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [mouthDate, setMouthDate] = useState('');
    const [listaRender, setListaRender] = useState([]);
  const [dataHistorico, setDataHistorico] = useState('Última Data');
  const montagemInicial = useRef(true);
  const [openValidaData, setOpenValidaData] = useState(false);
  const [nomeFuncionario, setNomeFuncionario] = useState('');
  const [emailFuncionario, setEmailFuncionario] = useState('');

  //Constantes para o novo select de data 
  const anoAtual = new Date().getFullYear();
  const [yearDate, setYearDate] = useState(anoAtual);

  //Constante para esconder o formulário de solicitação de feedback;
  const envio = false;

  //Constantes para validações em geral
  const [isValidAtividades, setIsValidAtividades] = useState(true);
  const [isValidFortes, setIsValidFortes] = useState(true);
  const [isValidAtencao, setIsValidAtencao] = useState(true);
  const [isValidMelhorias, setIsValidMelhorias] = useState(true);
  const [openValidaNota, setOpenValidaNota] = useState(false);

  //Dados puxados do banco de dados da auto avaliação do funcionário
  const [dadosCanvaDoFuncionario, setDadosCanvaDoFuncionario] = useState([]);
  const [seniorDoFuncionario, setSeniorDoFuncionario] = useState('');

  //Contantes para envio do e-mail
  const assunto = `${usuario} solicita o seu feedback pelo programa Feedback Canva`;

  //Constante para abertura do Dialog/Modal
  const [open, setOpen] = useState(false);
  const [openEmail, setOpenEmail] = useState(false);
  const descricao =
    'Favor usar vírgulas para separar as características. Por exemplo: Pontualidade, Educação';
  const validaNota = 'O intervalo de notas é de 1 a 7';
  const validaData = 'Mês e ano já cadastrados!';
  const sucessoEmail = 'Sua solicitação de feedback foi enviada com sucesso!';

  //useEffects
  //useEffect para manter o listaRender atualizado e avalDoFuncionario que vem do App.js
  useEffect(() => {
    if (montagemInicial.current) {
      montagemInicial.current = false;
      return;
    }

    //Comparação entre os canvas
    //Recuperação do funcionário selecionado atual
    const listaNomeAtual = listaCadastro.filter(
      (item) => item.id === idFuncionario,
    );
    setNomeFuncionario(listaNomeAtual.map((item) => item.nome).join());
    setEmailFuncionario(listaNomeAtual.map((item) => item.email).join());

    //Faz a comparação com a dataHistorica escolhida e se tem a data no canvaParse

    //Comparação do nome selecionado e o nome recuperado no banco de dados do funcionário

    const newName = listaNomeAtual.map((item) => item.nome).join();
    console.log('newName', newName);

    let canvaDoFuncionario = avalDoFuncionario.find(
      (item) => item.nome == newName,
    );
    console.log('canvaDoFuncionario', canvaDoFuncionario);

    let comparaName = [];
    try {
      comparaName = canvaDoFuncionario.nome;
    } catch (error) {
      console.log('Erro no comparaName', error);
    }
    console.log('comparaName', comparaName);

    let canvaDoFuncionario2 = [];

    try {
      canvaDoFuncionario2 = JSON.parse(canvaDoFuncionario.avaliacoes);
    } catch (error) {
      console.log('Erro ao fazer o parse', error);
    }
    let canvaDoFuncionarioParse = canvaDoFuncionario2;

    console.log('canvaDoFuncionario2', canvaDoFuncionario2);

    let canvaParseData =
      dataHistorico !== 'Última Data'
        ? canvaDoFuncionarioParse.filter(
            (item) =>
              item.ano === dataHistorico.ano && item.mes === dataHistorico.mes,
          )
        : canvaDoFuncionarioParse.filter(
            (item) =>
              item.ano ===
                canvaDoFuncionarioParse[canvaDoFuncionarioParse.length - 1]
                  .ano &&
              item.mes ===
                canvaDoFuncionarioParse[canvaDoFuncionarioParse.length - 1].mes,
          );
    if (comparaName == newName) {
      setDadosCanvaDoFuncionario(canvaParseData);
      console.log('canvaParseData', canvaParseData);
      setSeniorDoFuncionario(
        canvaParseData.map((item) => item.senioridade)[
          canvaParseData.length - 1
        ],
      );
      console.log(
        'senior',
        canvaParseData.map((item) => item.senioridade)[
          canvaParseData.length - 1
        ],
      );
    }

    if (listaCanva.length > 0) {
      let render = null;
      if (dataHistorico === 'Última Data') {
        render = [listaCanva[listaCanva.length - 1]];
      } else {
        render = listaCanva.filter(
          (item) =>
            item.mes === dataHistorico.mes && item.ano === dataHistorico.ano,
        );
      }
    
      if (render.length > 0) {
        setYearDate(render[0].ano);
        setMouthDate(render[0].mes);
        setSenioridade(render[0].senioridade);
        console.table(render);
        setListaRender(render); // Definindo disretamente o resultado do filtro
      }
    
    }
  }, [listaCanva, dataHistorico]);


  //useEffect para resetar a const atividades
  useEffect(() => {
    setAtividades('');
    setListaAtividades([]);
    setCompetencia('');
    setFortes('');
    setAtencao('');
    setMelhorias('');
    setMouthDate('');
    setSelectedDate('');
  }, [avaliar2]);
  //useEffect para  recuperação e manutenção dos dados atualizados
  // do banco de dados e setando para o listaAtividades e listaCanva
  useEffect(() => {
    comparaCanvas();
  }, [avaliar2, historico]);

  //Funções principais
  //Função para gravar os dados
  async function gravar() {
    const lista = listaCanva.find(
      (item) => item.mes === mouthDate && item.ano === yearDate,
    );
    console.table(lista);
    console.log('Este é o mounthDate ' + mouthDate);
    console.log('Este é o year ' + yearDate);

    if (lista) {
      setOpenValidaData(true);
    } else {
      if (
        !isValidAtencao ||
        !isValidAtividades ||
        !isValidFortes ||
        !isValidMelhorias
      ) {
        setOpen(true);
      } else {
        try {
          const senior = calculateFinalGrade();
          const lista = {
            competencia: competencia,
            atividades: listaAtividades,
            senioridade: senior,
            atencao: listaAtencao,
            melhorias: listaMelhorias,
            fortes: listaFortes,
            mes: mouthDate,
            ano: yearDate,
          };

          setSenioridade(senior);
          setListaCanva([...listaCanva, lista]);

          const response = await axios.put(
            `/cadastro/${idFuncionario}/update-avaliacao`,
            {
              avaliacoes: [...listaCanva, lista],
            },
          );

          onHistorico(true);
          onAvaliacao(false);
        } catch (error) {
          console.error('Erro ao enviar requisição:', error);
          // Tratar erros, se necessário
        }
      }
    }
  }

  // Função para apagar primeiro gráfico
  function apagarPrimeiro() {
    const primeiroRemovido = listaCanva[0]; // Armazena o primeiro elemento antes de removê-lo
    const listaAtualizada = listaCanva.slice(1); // Cria uma nova lista sem o primeiro elemento

    try {
      const response = axios.put(
        `/cadastro/${idFuncionario}/update-avaliacao`,
        {
          avaliacoes: JSON.stringify(listaAtualizada), // Envie a lista no formato esperado pela API
        },
      );

      console.log(response.data); // Confirmação de atualização da API

      setListaCanva(listaAtualizada);
      if (listaAtualizada.length == 0) {
        setListaCanva([]);
        setSenioridade('');
        setMouthDate('');
        setYearDate('');
      } else {
        setListaRender([listaAtualizada[listaAtualizada.length - 1]]);
      }
    } catch (error) {
      console.error('Houve um erro ao atualizar:', error);
      // Tratar o erro adequadamente
    }
    comparaCanvas();
  }
  // Função para apagar último gráfico
  function apagarUltimo() {
    const ultimoRemovido = listaCanva[listaCanva.length - 2]; // Armazena o último elemento antes de removê-lo
    const listaAtualizada = listaCanva.slice(0, -1); // Cria uma nova lista sem o último elemento

    try {
      const response = axios.put(
        `/cadastro/${idFuncionario}/update-avaliacao`,
        {
          avaliacoes: JSON.stringify(listaAtualizada), // Envie a lista no formato esperado pela API
        },
      );

      console.log(response.data); // Confirmação de atualização da API

      setListaCanva(listaAtualizada);
      if (listaAtualizada.length == 0) {
        setListaCanva([]); // Mantém somente o último elemento na listaRender
        setSenioridade('');
        setMouthDate('');
        setYearDate('');
      } else {
        setListaRender([listaAtualizada[listaAtualizada.length - 1]]);
      }
    } catch (error) {
      console.error('Houve um erro ao atualizar:', error);
      // Tratar o erro adequadamente
    }

    comparaCanvas();
  }
  //Função para envio do e-mail
  const sendEmail = () => {
    const templateParams = {
      email: emailFuncionario,
      assunto: assunto,
      nome: nomeFuncionario,
    };

    emailjs
      .send(
        'service_3qsan9n',
        'template_6yt5ty9',
        templateParams,
        'eX61PTky11yxk4MAJ',
      )
      .then((response) => {
        console.log('Email enviado com sucesso', response);
        setOpenEmail(true);
      })
      .catch((error) => {
        console.log('Erro ao enviar email', error);
      });
  };

  //Funções auxiliares
  //Funções para gravação do listaCanva atividades, pontos fortes e ações de melhorias e onChange
  function handleAtividades(e) {
    const value = capitalizeWords(e.currentTarget.value);
    setAtividades(value);
    const newActivities = value
      .split(/,| e /)
      .map((activity) => activity.trim());
    setListaAtividades(newActivities.filter((activity) => activity !== ''));
    const regex = /^[\p{L}\w\s]+(,\s*[\p{L}\w\s]+)*$/u;
    const isValidInput = regex.test(value);
    setIsValidAtividades(isValidInput);
  }
  //Função para formatar a const fortes
  function handleFortes(e) {
    const value = capitalizeWords(e.currentTarget.value);
    setFortes(value);
    const newFortes = value.split(/,| e /).map((activity) => activity.trim());
    setListaFortes(newFortes.filter((forte) => forte !== ''));
    const regex = /^[\p{L}\w\s]+(,\s*[\p{L}\w\s]+)*$/u;
    const isValidInput = regex.test(value);
    setIsValidFortes(isValidInput);
  }
  //Função para formatar a const atencao
  function handleAtencao(e) {
    const value = capitalizeWords(e.currentTarget.value);
    setAtencao(value);
    const newAtencao = value.split(/,| e /).map((activity) => activity.trim());
    setListaAtencao(newAtencao.filter((atencao) => atencao !== ''));
    const regex = /^[\p{L}\w\s]+(,\s*[\p{L}\w\s]+)*$/u;
    const isValidInput = regex.test(value);
    setIsValidAtencao(isValidInput);
  }
  //Função para formatar a const melhorias
  function handleMelhorias(e) {
    const value = capitalizeWords(e.currentTarget.value);
    setMelhorias(value);
    const newMelhorias = value
      .split(/,| e /)
      .map((activity) => activity.trim());
    setListaMelhorias(newMelhorias.filter((melhorias) => melhorias !== ''));
    const regex = /^[\p{L}\w\s]+(,\s*[\p{L}\w\s]+)*$/u;
    const isValidInput = regex.test(value);
    setIsValidMelhorias(isValidInput);
  }
  //Grava e valida as notas para o cálculo
  const handleNoteChange = (item, e) => {
    const value = e.target.value.trim(); // Remover espaços em branco extras

    if (value === '') {
      setNotes({ ...notes, [item]: '' });
    } else {
      const numericValue = parseFloat(value);

      if (!isNaN(numericValue)) {
        if (numericValue >= 1 && numericValue <= 7) {
          setNotes({ ...notes, [item]: numericValue });
        } else {
          setOpenValidaNota(true);
        }
      } else {
        setOpenValidaNota(true);
      }
    }
  };
  //Função para formatar a const competencia
  function handleCompetencia(e) {
    const value = capitalizeWords(e.currentTarget.value);
    setCompetencia(value);
  }
  //Função para padronizar a digitação dos inputs
  function capitalizeWords(sentence) {
    const exceptions = ['de', 'e']; // Palavras que devem permanecer em minúsculas

    const capitalize = (word) => {
      const lowerCaseWord = word.toLowerCase();
      if (exceptions.includes(lowerCaseWord)) {
        return lowerCaseWord;
      } else {
        return word.charAt(0).toUpperCase() + word.slice(1);
      }
    };

    return sentence
      .toLowerCase()
      .replace(/[\wÀ-ú']+|-/g, (match) => capitalize(match));
  }
  //Função para calcular a nota
  function calculateFinalGrade() {
    const notesValues = Object.values(notes).map((note) => parseFloat(note));
    const total = notesValues.reduce((acc, curr) => acc + (curr || 0), 0);
    const final = total / notesValues.length || 0;
    setNotaFinal(final.toFixed(2));
    let senior = '';
    if (final <= 1) {
      return (senior = 'novato');
    } else if (final <= 2) {
      return (senior = 'aprendiz');
    } else if (final <= 3) {
      return (senior = 'praticante');
    } else if (final <= 4) {
      return (senior = 'profissional');
    } else if (final <= 5) {
      return (senior = 'professor');
    } else if (final <= 6) {
      return (senior = 'lider');
    } else {
      return (senior = 'mestre');
    }
  }
  //Função de comparação entre os canvas do gestor e funcionário
  //Analisar se está dando erro e 'copiar' do primeiro useEffect se estiver
  function comparaCanvas() {
    axios
      .get(`/cadastrados/${setorChefe}`)
      .then((response) => {
        const lista = response.data;
        const listaFiltrada2 = lista.filter(
          (item) => item.setor === setorChefe,
        );
        console.log(listaFiltrada2); // Isso será executado depois de a lista ser filtrada
        const objetoEncontrado = listaFiltrada2.find(
          (objeto) => objeto.id === idFuncionario,
        );
        if (objetoEncontrado) {
          if (objetoEncontrado.avaliacoes != null) {
            let avaliacoes = [];
            try {
              avaliacoes = JSON.parse(objetoEncontrado.avaliacoes);
              //Lógica para gravar a parte de avaliações com o funcionário já selecionado pelo id
              if (avaliacoes.length > 0) {
                setListaCanva(avaliacoes);
                setSenioridade(avaliacoes[avaliacoes.length - 1].senioridade);
                setMouthDate(avaliacoes[avaliacoes.length - 1].mes);
                setYearDate(avaliacoes[avaliacoes.length - 1].ano);
              } else {
                setAtividades([]);
                setListaCanva([]);
                setSenioridade('');
                setMouthDate('');
                
              }

              let canvaDoFuncionario = [];

              try {
                canvaDoFuncionario = avalDoFuncionario.map((item) =>
                  JSON.parse(item.avaliacoes),
                );
              } catch (error) {
                console.log('Erro ao fazer o parse', error);
              }
              const canvaDoFuncionarioParse = canvaDoFuncionario;

              console.log('canvaDoFuncionario', canvaDoFuncionario);
              console.log('canvaDoFuncionarioParse', canvaDoFuncionarioParse);
              //Recuperação do funcionário selecionado atual
              const listaNomeAtual = listaCadastro.filter(
                (item) => item.id === idFuncionario,
              );
              setNomeFuncionario(
                listaNomeAtual.map((item) => item.nome).join(),
              );
              setEmailFuncionario(
                listaNomeAtual.map((item) => item.email).join(),
              );

              //Faz a comparação com a última data das avaliações e se tem a data no canvaParse
              const canvaParseData = canvaDoFuncionarioParse.filter(
                (item) =>
                  item.ano === avaliacoes[avaliacoes.length - 1].ano &&
                  item.mes === avaliacoes[avaliacoes.length - 1].mes,
              );

              if (
                avalDoFuncionario.map((item) => item.nome).join() ==
                listaNomeAtual.map((item) => item.nome).join()
              ) {
                setDadosCanvaDoFuncionario(canvaParseData);
                setSeniorDoFuncionario(
                  canvaParseData.map((item) => item.senioridade),
                );
              }
            } catch (error) {
              console.error('Erro ao analisar avaliações:', error);
              setAtividades([]);
              setListaCanva([]); // Definir lista como um array vazio se houver um erro de análise
              setSenioridade('');
              setMouthDate('');
              
            }
          } else {
            console.log('Nenhum dado de avaliações encontrado');
            setAtividades([]);
            setListaCanva([]); // Definir lista como um array vazio se não houver dados de avaliações
            setSenioridade('');
            setMouthDate('');
            setYearDate(null);
          }
        } else {
          console.log('Nenhum objeto encontrado com o ID:', idFuncionario);
          setAtividades([]);
          setListaCanva([]); // Definir lista como um array vazio se nenhum objeto for encontrado
          setSenioridade('');
          setMouthDate('');
          setYearDate(null);
        }
      })
      .catch((error) => {
        console.error('Erro ao obter os dados:', error);
        // Lidar com possíveis erros
      });
  }
  //Função para obter somente o mês pelo input date
  function obterNomeDoMes(dataString) {
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
    const partesData = dataString.split('-');
    const ano = parseInt(partesData[0]);
    const mesIndex = parseInt(partesData[1]) - 1; // Subtrai 1 para considerar o índice do array
    const dia = parseInt(partesData[2]);
    const data = new Date(ano, mesIndex, dia); // Cria uma nova data com o ano, mês e dia
    const nomeMes = meses[data.getMonth()]; // Obtém o nome do mês correspondente ao índice do array de meses
    return { nomeMes, ano };
  }
  //Função para obter o nome do mês
  function handleChangeMonth(e) {
    setSelectedDate(e.currentTarget.value);
    const { nomeMes, ano } = obterNomeDoMes(e.currentTarget.value);
    setMouthDate(nomeMes);
    setYearDate(ano);
  }

  //Função para controle da renderização ao escolher a data do feedback
  function handleData(e) {
    const value = e.currentTarget.value;
    const data = value === 'Última Data' ? 'Última Data' : JSON.parse(value);
    setDataHistorico(data);
  
    if (data === 'Última Data') {
      setYearDate(anoAtual);
      
    } else {
      setYearDate(data.ano);
      setMouthDate(data.mes);
    }
  }
  
  function handleYear(props){
    setYearDate(anoAtual+props);
    setDataHistorico({ano:anoAtual+props,mes:mouthDate})
  }
  
  
  
  

  return (
    <>
      {/* Renderização do formulário de avaliação que é controlado pelo componente Feedback */}
      {avaliar2 && (
        <>
          <h5>Formulário para avaliação</h5>
          <input
            type="date"
            value={selectedDate}
            onChange={handleChangeMonth}
            className="form-control"
          />

          <p>Mês: {mouthDate}</p>
          <div className="mb-3">
            <label for="exampleFormControlInput1" className="form-label">
              Competência
            </label>
            <input
              className="form-control"
              id="exampleFormControlInput1"
              placeholder="Adicione a competência necessária"
              value={competencia}
              onChange={handleCompetencia}
            />
          </div>
          <div className="mb-3">
            <label for="exampleFormControlInput1" className="form-label">
              Atividades
            </label>
            <input
              className="form-control"
              id="exampleFormControlInput1"
              value={atividades}
              placeholder="Adicione as atividades necessárias. Separe as atividades por vírgula ou a letra 'e'. Ex: Atendimento, Agendamento e Comunicação"
              onChange={handleAtividades}
            />
          </div>
          <div className="mb-3">
            <label for="exampleFormControlInput1" className="form-label">
              Pontos fortes
            </label>
            <input
              className="form-control"
              id="exampleFormControlInput1"
              value={fortes}
              placeholder="Adicione os pontos fortes. Separe os pontos fortes por vírgula ou a letra 'e'. Ex: Pontualidade, Disciplina e Honestidade"
              onChange={handleFortes}
            />
          </div>
          <div className="mb-3">
            <label for="exampleFormControlInput1" className="form-label">
              Pontos de atenção
            </label>
            <input
              className="form-control"
              id="exampleFormControlInput1"
              value={atencao}
              placeholder="Adicione os pontos fortes. Separe os pontos de atenção por vírgula ou a letra 'e'. Ex: Atrasos, Vestimenta e Desrespeito"
              onChange={handleAtencao}
            />
          </div>
          <div className="mb-3">
            <label for="exampleFormControlInput1" className="form-label">
              Ações de melhorias
            </label>
            <input
              className="form-control"
              id="exampleFormControlInput1"
              value={melhorias}
              placeholder="Adicione as ações de melhorias. Separe as ações de melhorias por vírgula ou a letra 'e'. Ex: Cursos, Treinamentos e Comunicação"
              onChange={handleMelhorias}
            />
          </div>

          <div className="mb-3">
            <label for="exampleFormControlInput1" className="form-label">
              Qual é o nível do profissional por atividade?
            </label>
            {listaAtividades.map((item, index) => (
              <>
                <div key={index}>
                  <label>
                    {item}:
                    <input
                      type="number"
                      className="form-control"
                      value={notes[item] || ''}
                      onChange={(e) => handleNoteChange(item, e)}
                      placeholder={`Nota para ${item}`}
                    />
                  </label>
                </div>
              </>
            ))}
          </div>

          <button
            type="button"
            className="btn btn-primary mb-2"
            onClick={gravar}
          >
            Gravar
          </button>
        </>
      )}

      {/* Renderização do componente Canva que é controlado pelo componente Feedback */}
      {historico && (
        <section>
          <div className="canvaContainer container w-100 mb-3">
            <h5>Escolha a data do Feedback</h5>
            <div className="container w-100 mb-3">
              <h5>Escolha a data</h5>
              <div className="container text-center">
                <div className="row align-items-start mb-1">
                  <div
                    className={
                      anoAtual - 2 === yearDate
                        ? 'col border p-1 bg-dark text-white'
                        : 'col border p-1'
                    }
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleYear(- 2)}
                  >
                    {anoAtual - 2}
                  </div>
                  <div
                    className={
                      anoAtual - 1 === yearDate
                        ? 'col border p-1 bg-dark text-white'
                        : 'col border p-1'
                    }
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleYear(- 1)}
                  >
                    {anoAtual - 1}
                  </div>
                  <div
                    className={
                      anoAtual === yearDate
                        ? 'col border p-1 bg-dark text-white'
                        : 'col border p-1'
                    }
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleYear(0)}
                  >
                    {anoAtual}
                  </div>
                  <div
                    className={
                      anoAtual + 1 === yearDate
                        ? 'col border p-1 bg-dark text-white'
                        : 'col border p-1'
                    }
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleYear(+ 1)}
                  >
                    {anoAtual + 1}
                  </div>
                  <div
                    className={
                      anoAtual + 2 === yearDate
                        ? 'col border p-1 bg-dark text-white'
                        : 'col border p-1'
                    }
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleYear( + 2)}
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
                <option value="Última Data">Última Data</option>
                {listaCanva.map((item, index) => (
                <>
                  <option
                    key={index}
                    value={JSON.stringify({ mes: item.mes, ano: yearDate })}
                  >
                    {item.mes}
                  </option>
                </>
              ))}
              </select>
            </div>
            
            <button
              type="button"
              className="btn btn-primary mt-1"
              style={{ marginRight: '10px' }}
              onClick={apagarPrimeiro}
            >
              Apagar Primeiro Canva
            </button>
            <button
              type="button"
              className="btn btn-primary mt-1"
              onClick={apagarUltimo}
            >
              Apagar Último Canva
            </button>
            {listaRender.length > 0 &&
            listaRender.filter(
              (item) =>
                (item.mes == mouthDate && item.ano == yearDate) ||
                (item.mes == dataHistorico.mes &&
                  item.ano == dataHistorico.ano),
            ).length > 0 &&<><div className="headerCanva d-flex justify-content-between align-items-center">
              <div>Feedback Canva</div>
              {mouthDate && (
                <div style={{ fontSize: '15px' }}>
                  Data: {mouthDate}/{yearDate}
                </div>
              )}
            </div>
            <div className="row">
              <div className="customBorder col-2 d-flex justify-content-center align-items-center">
                Competência
              </div>
              <div className="customBorder col-3 d-flex justify-content-center align-items-center">
                Atividades
              </div>
              <div
                className="customBorder col d-flex justify-content-center flex-column align-items-center"
                style={{ backgroundColor: '#fefdd9' }}
              >
                <div style={{ fontSize: '15px' }}>1</div>
                <div
                  style={{
                    fontSize: '10px',
                    fontWeight: 'bold',
                    marginTop: '-5px',
                  }}
                >
                  Novato
                </div>
              </div>
              <div
                className="customBorder col d-flex justify-content-center flex-column align-items-center"
                style={{ backgroundColor: '#fff3d5' }}
              >
                <div style={{ fontSize: '15px' }}>2</div>
                <div
                  style={{
                    fontSize: '10px',
                    fontWeight: 'bold',
                    marginTop: '-5px',
                  }}
                >
                  Aprendiz
                </div>
              </div>
              <div
                className="customBorder col d-flex justify-content-center flex-column align-items-center"
                style={{ backgroundColor: '#fee2d5' }}
              >
                <div style={{ fontSize: '15px' }}>3</div>
                <div
                  style={{
                    fontSize: '10px',
                    fontWeight: 'bold',
                    marginTop: '-5px',
                  }}
                >
                  Praticante
                </div>
              </div>
              <div
                className="customBorder col d-flex justify-content-center flex-column align-items-center"
                style={{ backgroundColor: '#fad4df' }}
              >
                <div style={{ fontSize: '15px' }}>4</div>
                <div
                  style={{
                    fontSize: '10px',
                    fontWeight: 'bold',
                    marginTop: '-5px',
                  }}
                >
                  Profissional
                </div>
              </div>
              <div
                className="customBorder col d-flex justify-content-center flex-column align-items-center"
                style={{ backgroundColor: '#f2caff' }}
              >
                <div style={{ fontSize: '15px' }}>5</div>
                <div
                  style={{
                    fontSize: '10px',
                    fontWeight: 'bold',
                    marginTop: '-5px',
                  }}
                >
                  Professor
                </div>
              </div>
              <div
                className="customBorder col d-flex justify-content-center flex-column align-items-center"
                style={{ backgroundColor: '#d9c9ff' }}
              >
                <div style={{ fontSize: '15px' }}>6</div>
                <div
                  style={{
                    fontSize: '10px',
                    fontWeight: 'bold',
                    marginTop: '-5px',
                  }}
                >
                  Líder
                </div>
              </div>
              <div
                className="customBorder2 col d-flex justify-content-center flex-column align-items-center"
                style={{ backgroundColor: '#d4e4fe' }}
              >
                <div style={{ fontSize: '15px' }}>7</div>
                <div
                  style={{
                    fontSize: '10px',
                    fontWeight: 'bold',
                    marginTop: '-5px',
                  }}
                >
                  Mestre
                </div>
              </div>
            </div>
            <div className="row">
              <div className="customBorder3 col-2 d-flex justify-content-center align-items-center">
                {listaRender.length > 0 &&
                  listaRender.map(
                    (item, index) =>
                      item.competencia && ( // Verifica se a competência existe
                        <div
                          key={index}
                          className="post-it d-flex justify-content-center align-items-center"
                        >
                          {item.competencia}
                        </div>
                      ),
                  )}
              </div>
              <div className="customBorder3 col-3">
                <div className="box mt-1">
                  {listaRender.map((item) =>
                    item.atividades.map((item, index) => (
                      <div
                        className={
                          listaAtividades.length <= 3
                            ? 'd-flex justify-content-center align-items-center post-it2'
                            : 'd-flex justify-content-center align-items-center post-it'
                        }
                      >
                        {item}
                      </div>
                    )),
                  )}
                </div>
              </div>
              <div className="customBorder3 col d-flex flex-column justify-content-center align-items-center">
                {senioridade == 'novato' && (
                  <div
                    className="mb-3"
                    style={{
                      borderRadius: '100%',
                      width: '45px',
                      height: '45px',
                      backgroundColor: 'red',
                    }}
                  ></div>
                )}
              </div>
              <div className="customBorder3 col d-flex flex-column justify-content-center align-items-center">
                {senioridade == 'aprendiz' && (
                  <div
                    className="mb-3"
                    style={{
                      borderRadius: '100%',
                      width: '45px',
                      height: '45px',
                      backgroundColor: 'red',
                    }}
                  ></div>
                )}
              </div>
              <div className="customBorder3 col d-flex flex-column justify-content-center align-items-center">
                {senioridade == 'praticante' && (
                  <div
                    className="mb-3"
                    style={{
                      borderRadius: '100%',
                      width: '45px',
                      height: '45px',
                      backgroundColor: 'red',
                    }}
                  ></div>
                )}
              </div>
              <div className="customBorder3 col d-flex flex-column justify-content-center align-items-center">
                {senioridade == 'profissional' && (
                  <div
                    className="mb-3"
                    style={{
                      borderRadius: '100%',
                      width: '45px',
                      height: '45px',
                      backgroundColor: 'red',
                    }}
                  ></div>
                )}
              </div>
              <div className="customBorder3 col d-flex flex-column justify-content-center align-items-center">
                {senioridade == 'professor' && (
                  <div
                    className="mb-3"
                    style={{
                      borderRadius: '100%',
                      width: '45px',
                      height: '45px',
                      backgroundColor: 'red',
                    }}
                  ></div>
                )}
              </div>
              <div className="customBorder3 col d-flex flex-column justify-content-center align-items-center">
                {senioridade == 'lider' && (
                  <div
                    className="mb-3"
                    style={{
                      borderRadius: '100%',
                      width: '45px',
                      height: '45px',
                      backgroundColor: 'red',
                    }}
                  ></div>
                )}
              </div>
              <div className="customBorder4 col d-flex flex-column justify-content-center align-items-center">
                {senioridade == 'mestre' && (
                  <div
                    className="mb-3"
                    style={{
                      borderRadius: '100%',
                      width: '45px',
                      height: '45px',
                      backgroundColor: 'red',
                    }}
                  ></div>
                )}
              </div>

              <div className="row w-100">
                <div className="customBorder5 pt-3 col-4 d-flex flex-column justify-content-center align-items-center">
                  <div>
                    <div className="d-flex justify-content-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="30"
                        height="30"
                        fill="currentColor"
                        className="bi bi-emoji-smile"
                        viewBox="0 0 16 16"
                      >
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                        <path d="M4.285 9.567a.5.5 0 0 1 .683.183A3.498 3.498 0 0 0 8 11.5a3.498 3.498 0 0 0 3.032-1.75.5.5 0 1 1 .866.5A4.498 4.498 0 0 1 8 12.5a4.498 4.498 0 0 1-3.898-2.25.5.5 0 0 1 .183-.683M7 6.5C7 7.328 6.552 8 6 8s-1-.672-1-1.5S5.448 5 6 5s1 .672 1 1.5m4 0c0 .828-.448 1.5-1 1.5s-1-.672-1-1.5S9.448 5 10 5s1 .672 1 1.5" />
                      </svg>
                    </div>
                    <div>Pontos Fortes</div>
                  </div>
                  <div className="customBorder7">
                    {listaRender.map((item) =>
                      item.fortes.map((item, index) => <div>{item}</div>),
                    )}
                  </div>
                </div>
                <div className="customBorder5 pt-3 col-4 d-flex flex-column justify-content-center align-items-center">
                  <div>
                    <div className="d-flex justify-content-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="30"
                        height="30"
                        fill="currentColor"
                        className="bi bi-emoji-frown"
                        viewBox="0 0 16 16"
                      >
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                        <path d="M4.285 12.433a.5.5 0 0 0 .683-.183A3.498 3.498 0 0 1 8 10.5c1.295 0 2.426.703 3.032 1.75a.5.5 0 0 0 .866-.5A4.498 4.498 0 0 0 8 9.5a4.5 4.5 0 0 0-3.898 2.25.5.5 0 0 0 .183.683M7 6.5C7 7.328 6.552 8 6 8s-1-.672-1-1.5S5.448 5 6 5s1 .672 1 1.5m4 0c0 .828-.448 1.5-1 1.5s-1-.672-1-1.5S9.448 5 10 5s1 .672 1 1.5" />
                      </svg>
                    </div>
                    <div>Pontos de atenção</div>
                  </div>
                  <div className="customBorder7">
                    {listaRender.map((item) =>
                      item.atencao.map((item, index) => <div>{item}</div>),
                    )}
                  </div>
                </div>
                <div className="customBorder8 pt-3 col-4 d-flex flex-column justify-content-center align-items-center">
                  <div>
                    <div className="d-flex justify-content-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="30"
                        height="30"
                        fill="currentColor"
                        className="bi bi-check-circle-fill"
                        viewBox="0 0 16 16"
                      >
                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                      </svg>
                    </div>
                    <div>Ações de melhoria</div>
                  </div>
                  <div className="customBorder7">
                    {listaRender.map((item) =>
                      item.melhorias.map((item, index) => <div>{item}</div>),
                    )}
                  </div>
                </div>
              </div>
            </div></>}
          </div>

          {/* Parte do canva de comparação  */}
          {console.log('dadosCanvaDoFuncionario', dadosCanvaDoFuncionario)}
          {dadosCanvaDoFuncionario.length > 0 &&
            dadosCanvaDoFuncionario.filter(
              (item) =>
                (item.mes == mouthDate && item.ano == yearDate) ||
                (item.mes == dataHistorico.mes &&
                  item.ano == dataHistorico.ano),
            ).length > 0 && (
              <>
                <h2 className="mt-2" style={{ color: '#a5a3a3' }}>
                  Quadro do Funcionário
                </h2>
                <div className="canvaContainer container w-100 mb-3">
                  <div className="headerCanva d-flex justify-content-between align-items-center">
                    <div>Feedback Canva</div>
                    {mouthDate && (
                      <div style={{ fontSize: '15px' }}>
                        Data: {mouthDate}/{yearDate}
                      </div>
                    )}
                  </div>
                  <div className="row">
                    <div className="customBorder col-2 d-flex justify-content-center align-items-center">
                      Competência
                    </div>
                    <div className="customBorder col-3 d-flex justify-content-center align-items-center">
                      Atividades
                    </div>
                    <div
                      className="customBorder col d-flex justify-content-center flex-column align-items-center"
                      style={{ backgroundColor: '#fefdd9' }}
                    >
                      <div style={{ fontSize: '15px' }}>1</div>
                      <div
                        style={{
                          fontSize: '10px',
                          fontWeight: 'bold',
                          marginTop: '-5px',
                        }}
                      >
                        Novato
                      </div>
                    </div>
                    <div
                      className="customBorder col d-flex justify-content-center flex-column align-items-center"
                      style={{ backgroundColor: '#fff3d5' }}
                    >
                      <div style={{ fontSize: '15px' }}>2</div>
                      <div
                        style={{
                          fontSize: '10px',
                          fontWeight: 'bold',
                          marginTop: '-5px',
                        }}
                      >
                        Aprendiz
                      </div>
                    </div>
                    <div
                      className="customBorder col d-flex justify-content-center flex-column align-items-center"
                      style={{ backgroundColor: '#fee2d5' }}
                    >
                      <div style={{ fontSize: '15px' }}>3</div>
                      <div
                        style={{
                          fontSize: '10px',
                          fontWeight: 'bold',
                          marginTop: '-5px',
                        }}
                      >
                        Praticante
                      </div>
                    </div>
                    <div
                      className="customBorder col d-flex justify-content-center flex-column align-items-center"
                      style={{ backgroundColor: '#fad4df' }}
                    >
                      <div style={{ fontSize: '15px' }}>4</div>
                      <div
                        style={{
                          fontSize: '10px',
                          fontWeight: 'bold',
                          marginTop: '-5px',
                        }}
                      >
                        Profissional
                      </div>
                    </div>
                    <div
                      className="customBorder col d-flex justify-content-center flex-column align-items-center"
                      style={{ backgroundColor: '#f2caff' }}
                    >
                      <div style={{ fontSize: '15px' }}>5</div>
                      <div
                        style={{
                          fontSize: '10px',
                          fontWeight: 'bold',
                          marginTop: '-5px',
                        }}
                      >
                        Professor
                      </div>
                    </div>
                    <div
                      className="customBorder col d-flex justify-content-center flex-column align-items-center"
                      style={{ backgroundColor: '#d9c9ff' }}
                    >
                      <div style={{ fontSize: '15px' }}>6</div>
                      <div
                        style={{
                          fontSize: '10px',
                          fontWeight: 'bold',
                          marginTop: '-5px',
                        }}
                      >
                        Líder
                      </div>
                    </div>
                    <div
                      className="customBorder2 col d-flex justify-content-center flex-column align-items-center"
                      style={{ backgroundColor: '#d4e4fe' }}
                    >
                      <div style={{ fontSize: '15px' }}>7</div>
                      <div
                        style={{
                          fontSize: '10px',
                          fontWeight: 'bold',
                          marginTop: '-5px',
                        }}
                      >
                        Mestre
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="customBorder3 col-2 d-flex justify-content-center align-items-center">
                      {dadosCanvaDoFuncionario.length > 0 &&
                        dadosCanvaDoFuncionario.map(
                          (item, index) =>
                            item.competencia && ( // Verifica se a competência existe
                              <div
                                key={index}
                                className="post-it d-flex justify-content-center align-items-center"
                              >
                                {item.competencia}
                              </div>
                            ),
                        )}
                    </div>
                    <div className="customBorder3 col-3">
                      <div className="box mt-1">
                        {dadosCanvaDoFuncionario.map((item) =>
                          item.atividades.map((item, index) => (
                            <div
                              className={
                                listaAtividades.length <= 3
                                  ? 'd-flex justify-content-center align-items-center post-it2'
                                  : 'd-flex justify-content-center align-items-center post-it'
                              }
                            >
                              {item}
                            </div>
                          )),
                        )}
                      </div>
                    </div>
                    <div className="customBorder3 col d-flex flex-column justify-content-center align-items-center">
                      {seniorDoFuncionario == 'novato' && (
                        <div
                          className="mb-3"
                          style={{
                            borderRadius: '100%',
                            width: '45px',
                            height: '45px',
                            backgroundColor: 'red',
                          }}
                        ></div>
                      )}
                    </div>
                    <div className="customBorder3 col d-flex flex-column justify-content-center align-items-center">
                      {seniorDoFuncionario == 'aprendiz' && (
                        <div
                          className="mb-3"
                          style={{
                            borderRadius: '100%',
                            width: '45px',
                            height: '45px',
                            backgroundColor: 'red',
                          }}
                        ></div>
                      )}
                    </div>
                    <div className="customBorder3 col d-flex flex-column justify-content-center align-items-center">
                      {seniorDoFuncionario == 'praticante' && (
                        <div
                          className="mb-3"
                          style={{
                            borderRadius: '100%',
                            width: '45px',
                            height: '45px',
                            backgroundColor: 'red',
                          }}
                        ></div>
                      )}
                    </div>
                    <div className="customBorder3 col d-flex flex-column justify-content-center align-items-center">
                      {seniorDoFuncionario == 'profissional' && (
                        <div
                          className="mb-3"
                          style={{
                            borderRadius: '100%',
                            width: '45px',
                            height: '45px',
                            backgroundColor: 'red',
                          }}
                        ></div>
                      )}
                    </div>
                    <div className="customBorder3 col d-flex flex-column justify-content-center align-items-center">
                      {seniorDoFuncionario == 'professor' && (
                        <div
                          className="mb-3"
                          style={{
                            borderRadius: '100%',
                            width: '45px',
                            height: '45px',
                            backgroundColor: 'red',
                          }}
                        ></div>
                      )}
                    </div>
                    <div className="customBorder3 col d-flex flex-column justify-content-center align-items-center">
                      {seniorDoFuncionario == 'lider' && (
                        <div
                          className="mb-3"
                          style={{
                            borderRadius: '100%',
                            width: '45px',
                            height: '45px',
                            backgroundColor: 'red',
                          }}
                        ></div>
                      )}
                    </div>
                    <div className="customBorder4 col d-flex flex-column justify-content-center align-items-center">
                      {seniorDoFuncionario == 'mestre' && (
                        <div
                          className="mb-3"
                          style={{
                            borderRadius: '100%',
                            width: '45px',
                            height: '45px',
                            backgroundColor: 'red',
                          }}
                        ></div>
                      )}
                    </div>

                    <div className="row w-100">
                      <div className="customBorder5 pt-3 col-4 d-flex flex-column justify-content-center align-items-center">
                        <div>
                          <div className="d-flex justify-content-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="30"
                              height="30"
                              fill="currentColor"
                              className="bi bi-emoji-smile"
                              viewBox="0 0 16 16"
                            >
                              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                              <path d="M4.285 9.567a.5.5 0 0 1 .683.183A3.498 3.498 0 0 0 8 11.5a3.498 3.498 0 0 0 3.032-1.75.5.5 0 1 1 .866.5A4.498 4.498 0 0 1 8 12.5a4.498 4.498 0 0 1-3.898-2.25.5.5 0 0 1 .183-.683M7 6.5C7 7.328 6.552 8 6 8s-1-.672-1-1.5S5.448 5 6 5s1 .672 1 1.5m4 0c0 .828-.448 1.5-1 1.5s-1-.672-1-1.5S9.448 5 10 5s1 .672 1 1.5" />
                            </svg>
                          </div>
                          <div>Pontos Fortes</div>
                        </div>
                        <div className="customBorder7">
                          {dadosCanvaDoFuncionario.map((item) =>
                            item.fortes.map((item, index) => <div>{item}</div>),
                          )}
                        </div>
                      </div>
                      <div className="customBorder5 pt-3 col-4 d-flex flex-column justify-content-center align-items-center">
                        <div>
                          <div className="d-flex justify-content-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="30"
                              height="30"
                              fill="currentColor"
                              className="bi bi-emoji-frown"
                              viewBox="0 0 16 16"
                            >
                              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                              <path d="M4.285 12.433a.5.5 0 0 0 .683-.183A3.498 3.498 0 0 1 8 10.5c1.295 0 2.426.703 3.032 1.75a.5.5 0 0 0 .866-.5A4.498 4.498 0 0 0 8 9.5a4.5 4.5 0 0 0-3.898 2.25.5.5 0 0 0 .183.683M7 6.5C7 7.328 6.552 8 6 8s-1-.672-1-1.5S5.448 5 6 5s1 .672 1 1.5m4 0c0 .828-.448 1.5-1 1.5s-1-.672-1-1.5S9.448 5 10 5s1 .672 1 1.5" />
                            </svg>
                          </div>
                          <div>Pontos de atenção</div>
                        </div>
                        <div className="customBorder7">
                          {dadosCanvaDoFuncionario.map((item) =>
                            item.atencao.map((item, index) => (
                              <div>{item}</div>
                            )),
                          )}
                        </div>
                      </div>
                      <div className="customBorder8 pt-3 col-4 d-flex flex-column justify-content-center align-items-center">
                        <div>
                          <div className="d-flex justify-content-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="30"
                              height="30"
                              fill="currentColor"
                              className="bi bi-check-circle-fill"
                              viewBox="0 0 16 16"
                            >
                              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                            </svg>
                          </div>
                          <div>Ações de melhoria</div>
                        </div>
                        <div className="customBorder7">
                          {dadosCanvaDoFuncionario.map((item) =>
                            item.melhorias.map((item, index) => (
                              <div>{item}</div>
                            )),
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

          {dadosCanvaDoFuncionario.length == 0 && (
            <>
              <h2 className="mt-2" style={{ color: '#a5a3a3' }}>
                Solicitar feedback para o funcionário
              </h2>

              <button
                type="button"
                className="btn btn-primary mt-1"
                style={{ marginRight: '10px' }}
                onClick={sendEmail}
              >
                Solicitar feedback para o funcionário
              </button>
            </>
          )}
        </section>
      )}

      <Dialog
        open={open}
        descricao={descricao}
        handleClose={() => setOpen(false)}
        Title="Atenção"
      />
      <Dialog
        open={openValidaNota}
        descricao={validaNota}
        handleClose={() => setOpenValidaNota(false)}
        Title="Atenção"
      />
      <Dialog
        open={openValidaData}
        descricao={validaData}
        handleClose={() => setOpenValidaData(false)}
        Title="Atenção"
      />
      <Dialog
        open={openEmail}
        descricao={sucessoEmail}
        handleClose={() => setOpenEmail(false)}
        Title="Atenção"
      />
    </>
  );
}
