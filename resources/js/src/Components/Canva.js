import { faTruckField } from '@fortawesome/free-solid-svg-icons';
import './Canva.css';
import { useState, useEffect } from 'react';
import Dialog from './Dialog';

export default function Canva({
  historico,
  avaliar2,
  onHistorico,
  onAvaliacao,
  idFuncionario,
  onChangeId,
  listaCadastro,
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
  const [yearDate, setYearDate] = useState('');
  const [listaRender, setListaRender] = useState([]);

  //Constantes para validações em geral
  const [isValidAtividades, setIsValidAtividades] = useState(true);
  const [isValidFortes, setIsValidFortes] = useState(true);
  const [isValidAtencao, setIsValidAtencao] = useState(true);
  const [isValidMelhorias, setIsValidMelhorias] = useState(true);
  const [openValidaNota, setOpenValidaNota] = useState(false);

  //Constante para abertura do Dialog/Modal
  const [open, setOpen] = useState(false);
  const descricao =
    'Favor usar vírgulas para separar as características. Por exemplo: Pontualidade, Educação';
  const validaNota = 'O intervalo de notas é de 1 a 7';

  //useEffect para manter o listaRender atualizado.
  useEffect(() => {
    if (listaCanva.length > 0) {
      let lista = listaCanva;
      let render = listaCanva[listaCanva.length - 1];
      setListaRender([render]);
    }
  }, [listaCanva]);

  //useEffect para  recuperação dos dados do banco de dados e setando para o listaAtividades e listaCanva
  useEffect(() => {
    const objetoEncontrado = listaCadastro.find(
      (objeto) => objeto.id === idFuncionario,
    );

    if (objetoEncontrado) {
      // Verifica se objetoEncontrado.avaliacoes não é nulo ou indefinido
      if (objetoEncontrado.avaliacoes != null) {
        let avaliacoes = [];

        try {
          avaliacoes = JSON.parse(objetoEncontrado.avaliacoes);

          if (avaliacoes.length > 0) {
            console.table(avaliacoes);
            setListaCanva(avaliacoes);
            setSenioridade(avaliacoes[avaliacoes.length-1].senioridade);
            setMouthDate(avaliacoes[avaliacoes.length-1].mes);
            setYearDate(avaliacoes[avaliacoes.length-1].ano);

            const atividades =
              avaliacoes[avaliacoes.length - 1].atividades || [];
            setAtividades(atividades);
          } else {
            setAtividades([]);
            setListaCanva([]); 
            setSenioridade('');
            setMouthDate('');
            setYearDate(null);
          }
        } catch (error) {
          console.error('Erro ao analisar avaliações:', error);
          setAtividades([]);
          setListaCanva([]); // Definir lista como um array vazio se houver um erro de análise
          setSenioridade('');
          setMouthDate('');
          setYearDate(null);
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
  }, []);

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

  function handleFortes(e) {
    const value = capitalizeWords(e.currentTarget.value);
    setFortes(value);
    const newFortes = value.split(/,| e /).map((activity) => activity.trim());
    setListaFortes(newFortes.filter((forte) => forte !== ''));
    const regex = /^[\p{L}\w\s]+(,\s*[\p{L}\w\s]+)*$/u;
    const isValidInput = regex.test(value);
    setIsValidFortes(isValidInput);
  }

  function handleAtencao(e) {
    const value = capitalizeWords(e.currentTarget.value);
    setAtencao(value);
    const newAtencao = value.split(/,| e /).map((activity) => activity.trim());
    setListaAtencao(newAtencao.filter((atencao) => atencao !== ''));
    const regex = /^[\p{L}\w\s]+(,\s*[\p{L}\w\s]+)*$/u;
    const isValidInput = regex.test(value);
    setIsValidAtencao(isValidInput);
  }

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

  //Função para gravar os dados
  async function gravar() {
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

  function handleChangeMonth(e) {
    setSelectedDate(e.currentTarget.value);
    const { nomeMes, ano } = obterNomeDoMes(e.currentTarget.value);
    setMouthDate(nomeMes);
    setYearDate(ano);
  }

  console.log(listaCanva);

  return (
    <>
      <h5>Escolha a data do Feedback</h5>
      <select className="form-select mb-2" aria-label="Default select example">
        <option selected>Escolha a data</option>
        {listaCanva.map((item, index) => (
          <>
            <option
              key={index}
              value={JSON.stringify({ mes: item.mes, ano: item.ano })}
            >
              {item.mes}/{item.ano}
            </option>
          </>
        ))}
      </select>
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
              onChange={(e) => setCompetencia(e.currentTarget.value)}
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

      {historico && (
        <section className="canvaContainer container w-100 mb-3">
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
          </div>
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
    </>
  );
}
