import React from 'react';
import ReactDOM from 'react-dom';
import Input from './Components/Input';
import './index.css';
import { useState, useEffect } from 'react';
import './App.css';
import Sidebar from './Components/Sidebar';
import Home from './Components/Home';
import CadastrarComponent from './Components/CadastrarComponent';
import validator from 'validator';
import Dialog from './Components/Dialog';
import Feedback from './Components/Feedback';
import Pendentes from './Components/Pendentes';
import Planodeacao from './Components/Planodeacao';
import axios from 'axios';

export default function App() {
  //Variáveis para mudança de tela
  const [cadastrar, setCadastrar] = useState(false);
  const [homeRender, setHomeRender] = useState(true);
  const [feedback, setFeedback] = useState(false);
  const [pendentes, setPendentes] = useState(false);
  const [planoDeAcao, setPlanoDeAcao] = useState(false);

  //Variáveis para gravação de estado
  const [usuario, setUsuario] = useState('');
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [setor, setSetor] = useState('');
  const [dadosUsuarioLogado, setDadosUsuarioLogado] = useState({});
  //Constante que grava todos os dados do banco
  const [listaCadastro, setListaCadastro] = useState([]);
  const [newId, setNewId] = useState(0);
  const [idFuncionario, setIdFuncionario] = useState(null);
  const [isValid, setIsValid] = useState(true);
  const [idUsuario, setIdUsuario] = useState(null);
  //Constante separada principalmente para renderização de dados de um funcionário específico
  const [dadosFuncionario, setDadosFuncionario] = useState({});
  const [dados, setDados] = useState({});
  const [setorChefe, setSetorChefe] = useState('');
  //Constante para gravar todos os dados do banco do software de feedback dos funcionários
  //O nome não está muito descritivo, mas não alteraria pois está setado em muitas partes diferentes
  //do código, mas significa avaliação do funcionário
  const [avalDoFuncionario, setAvalDoFuncionario] = useState([]);

  //Constantes para o envio de informação do componente pendentes para o plano
  const [anoPai, setAnoPai] = useState(null);
  const [mesPai, setMesPai] = useState('');
  const [emailPai, setEmailPai] = useState('');

  //Variáveis que controlam a abertura dos Dialogs
  const [openCadastro, setOpenCadastro] = useState(false);
  const [open, setOpen] = useState(false);
  const [openEmail, setOpenEmail] = useState('');
  const [cadastroSucesso, setCadastroSucesso] = useState(false);
  const [edicaoSucesso, setEdicaoSucesso] = useState(false);

  //Variável para descrição do Dialog/Modal/Popup
  const mesmoFuncionario = 'Você já cadastrou esse funcionário!';
  const validacao = 'Favor preencher todos os dados!';
  const validaEmail = 'Favor inserir um e-mail válido!';
  const sucessoCadastro = 'Cadastro realizado com sucesso!';
  const sucessoEdicao = 'Edição realizada com sucesso!';

  //UseEffects
  //Primeira requisição para a recuperação dos dados dos usuários ao inicializar o programa
  useEffect(() => {
    let updatedListaOriginal = [];
    let usuarioLogado = [];
    const fetchData = async () => {
      try {
        //Faz a requisição das informações do login do usuário
        const responseUser = await axios.get('/user');

        usuarioLogado = responseUser.data.name;
        const setor = responseUser.data.setor;
        const newIdUsuario = responseUser.data.id;
        setDadosUsuarioLogado(responseUser.data);
        setUsuario(usuarioLogado);
        setSetorChefe(setor);
        setIdUsuario(newIdUsuario);

        //Faz a requisição das informações segundo o setor do usuário

        const responseListaOriginal = await axios.get('/cadastrados/' + setor);
        const listaOriginal = responseListaOriginal.data;
        setListaCadastro(listaOriginal);

        //Faz a requisição das informações das avaliações dos funcionários segundo o setor do usuário
        const canvaFuncionario = await axios.get(`funcionarios/${setor}`);
        //Setando os dados do canva que o funcionário fez
        setAvalDoFuncionario(canvaFuncionario.data);

        //Faz a requisição do programa atestado para o cadastramento automático
        const responseColaboradoresAtestado = await axios.get(
          '/colaboradores-atestado',
        );
        const listaAtestadoFinal = responseColaboradoresAtestado.data;
        //Faz a filtragem segundo o setor descrito no programa de atestado
        const listaAtestado = listaAtestadoFinal.filter(
          (item) => item.setor === setor,
        );

        //Lógica para fazer o cadastro automático caso não tenha sido
        const funcionariosNaoCadastrados = listaAtestado.filter(
          (colaboradorAtestado) => {
            return !listaOriginal.some(
              (funcionario) => funcionario.nome === colaboradorAtestado.nome,
            );
          },
        );

        await Promise.all(
          funcionariosNaoCadastrados.map(async (item) => {
            try {
              const novoUsuario = {
                nome: item.nome,
                email: 'cadastrar@email.com',
                setor: item.setor,
                administrador: usuarioLogado,
              };
              await axios.post('/cadastrar-usuario', novoUsuario);
              console.log('Usuário cadastrado com sucesso:', novoUsuario);
            } catch (error) {
              console.error('Erro ao cadastrar usuário:', error);
            }
          }),
        );

        // Atualiza a lista do atestado
        updatedListaOriginal = await axios.get('/cadastrados/' + setor);
        setListaCadastro(updatedListaOriginal.data);

        // Chama a função para cadastrar funcionários do canva
        cadastrarFuncionariosAutomaticamente(canvaFuncionario.data, setor);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      }
    };

    const cadastrarFuncionariosAutomaticamente = async (
      listaFuncionarios,
      setor,
    ) => {
      const updatedListaOriginal = await axios.get('/cadastrados/' + setor);
      try {
        // Lógica para fazer o cadastro automático caso não tenha sido
        const funcionariosNaoCadastrados = listaFuncionarios.filter(
          (funcionarioCanva) => {
            return !updatedListaOriginal.data.some(
              (funcionario) => funcionario.email === funcionarioCanva.email,
            );
          },
        );

        await Promise.all(
          funcionariosNaoCadastrados.map(async (item) => {
            try {
              const novoUsuario = {
                nome: item.nome,
                email: item.email,
                setor: item.setor,
                administrador: usuarioLogado,
              };
              await axios.post('/cadastrar-usuario', novoUsuario);
              console.log('Usuário cadastrado com sucesso:', novoUsuario);
            } catch (error) {
              console.error('Erro ao cadastrar usuário:', error);
            }
          }),
        );

        const updatedListaCadastro = await axios.get('/cadastrados/' + setor);
        setListaCadastro(updatedListaCadastro.data);
      } catch (error) {
        console.error('Erro ao cadastrar funcionários automaticamente:', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    sendEmailAll();
    console.log('UseEffect ok!');
  }, []);
  //useEffect para resetar o valor dados para tirar o bug da seleção automática ao gravar
  useEffect(() => {
    if (!feedback) {
      setDados([]);
    }
  }, [feedback]);

  //Funções principais
  //Função para cadastrar os funcionários que vem do CadastroComponent
  async function gravar() {
    try {
      if (dadosFuncionario.id) {
        // Edição de funcionário existente
        await axios.put(`/funcionario/${dadosFuncionario.id}`, {
          nome: nome,
          email: email,
          setor: setorChefe,
        });
        setEdicaoSucesso(true);
        //Renderiza o componente feedback após a gravação de dados
        setCadastrar(false);
        setFeedback(true);
        setHomeRender(false);
        setPendentes(false);
      } else {
        // Validação dos inputs e cadastro de novo funcionário
        if (!nome || !email) {
          setOpen(true); // Variável para a abertura do Dialog/Modal/Popup
          return; // Sai da função se os campos não estiverem preenchidos
        }

        if (!isValid) {
          setOpenEmail(true); // Variável para abertura do Dialog de aviso sobre o email inválido
          return; // Sai da função se o email não for válido
        }

        const emailJaExiste = listaCadastro.some(
          (item) => item.email === email,
        );

        if (emailJaExiste) {
          console.log('O e-mail já existe na lista!');
          setOpenCadastro(true);
          return; // Sai da função se o email já estiver na lista
        }

        const novoCadastro = {
          nome: nome,
          email: email,
          setor: setorChefe,
          administrador: usuario,
          id: newId,
        };

        // Cadastro do novo funcionário
        await axios.post('/cadastrar-usuario', novoCadastro).then(() => {
          setCadastroSucesso(true);
          setCadastrar(false);
          setFeedback(true);
          setHomeRender(false);
          setPendentes(false);
          setNome('');
          setEmail('');
          setSetor('');
          setDadosFuncionario({});
        });

        setListaCadastro([...listaCadastro, novoCadastro]);
        setNewId(newId + 1);
      }

      // Atualização da lista após edição ou cadastro
      let response = null;
      try {
        response = await axios.get(`/cadastrados/${setorChefe}`);
      } catch (error) {
        console.log('Erro ao requisitar os dados do setor', error);
      }
      const lista = response.data;

      //Após a gravação ou edição recupera os valores do banco de dados
      const novaLista = lista.find((item) => item.email === email);
      setDados(novaLista);

      setListaCadastro(lista);

      const id = lista.length ? lista[lista.length - 1].id : 0;
      setIdFuncionario(id);

      // Limpa os campos após a atualização ou cadastro
      setNome('');
      setEmail('');
      setSetor('');
      setDadosFuncionario({});

      console.log('Atualização realizada com sucesso!');
    } catch (error) {
      console.error('Erro ao gravar:', error);
      // Lidar com possíveis erros
    }
  }

  async function sendEmailAll() {
    //Lógica para obter as avaliações do Gestor do mês e ano.
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
    const data = new Date();
    const mes = data.getMonth();
    const nomeMes = meses[mes]
    // const nomeMes = 'Janeiro';
    const anoAtual= data.getFullYear();
    let users = [];
    try {
      const response = await axios.get('/users');
      users = response.data.user;
    } catch (error) {
      console.log('Erro na requisição', error);
    }
    console.log('users', users);

    for (const user of users) {
      // Etapa 1: Obter Avaliações do Usuário
      let funcionarios=[]
      let todasAvaliacoes = [];
      try {
        funcionarios = await axios.get('/cadastrados/' + user.setor);
        todasAvaliacoes = funcionarios.data.map((item) => JSON.parse(item.avaliacoes)).flat();
        todasAvaliacoes = todasAvaliacoes.filter(item => item.mes === nomeMes && item.ano === anoAtual);
      } catch (error) {
        console.log('Erro ao fazer o parse das avaliações', error);
      }
    
      // Etapa 2: Obter Férias do Usuário
      let feriasFuncionarios = [];
      try {

        feriasFuncionarios = funcionarios.data.map(item => JSON.parse(item.ferias)).flat();
        feriasFuncionarios = feriasFuncionarios.filter(item => item.mes === nomeMes && item.ano === anoAtual && item.ferias === true);
      } catch (error) {
        console.log('Erro ao fazer o parse do feriasFuncionarios', error);
      }
    
      // Etapa 3: Calcular a Meta para o Usuário
      const meta = ((funcionarios.data.length - feriasFuncionarios.length) * 0.86).toFixed(0);
    
      // Etapa 4: Verificar Avaliações do Gestor
      let dadosFuncionarios = [];
      try {
        dadosFuncionarios = await axios.get(`/funcionarios/${user.setor}`);
      } catch (error) {
        console.log('Erro na requisição', error);
      }
    
      console.log(`user.setor do ${user.name}`, user.setor);
      console.log(`dados do ${user.name}`, dadosFuncionarios.data);
    
      // Etapa 5: Verificar se a Meta foi Atingida para o Usuário
      const avaliacoesDosFuncionarios = dadosFuncionarios.data.map(item => JSON.parse(item.avaliacoes)).flat();
      const avaliacoesUsuario = avaliacoesDosFuncionarios.filter(item => item.mes === nomeMes && item.ano === anoAtual);
      console.log(`avaliacoesUsuario do ${user.name}`, avaliacoesUsuario);
      console.log('todasAvaliacoes.length: ' + user.name, todasAvaliacoes.length);
      console.log('feriasFuncionarios.length: ' + user.name, feriasFuncionarios.length);
    
      console.log(`funcionarios.length do ${user.name}`, meta);
      console.log(`meta.length do ${user.name}`, avaliacoesUsuario.length);
    
      // Etapa 6: Enviar E-mail se a Meta foi Atingida
      if (avaliacoesUsuario.length < meta) {
        console.log(`Enviar e-mail para ${user.name}, a meta não foi atingida!`);
        // Lógica para enviar e-mail
      }
    }
    

  
  }

  //Funções auxiliares
  //Função para padronizar a digitação dos inputs
  function capitalizeWords(sentence) {
    return sentence.replace(/\b[\p{L}\w']+\b/gu, (match) => {
      if (match.toLowerCase() === 'de' || match.toLowerCase() === 'e') {
        return match.toLowerCase();
      } else {
        const firstLetter = match.charAt(0).toUpperCase();
        const restOfWord = match.slice(1).toLowerCase();
        return firstLetter + restOfWord;
      }
    });
  }

  //Função para gravar o nome e padronizar a escrita
  function handleChangeName(event) {
    const newName = capitalizeWords(event.currentTarget.value);
    setNome(newName);
  }
  //Grava o email no setEmail (variável email)
  function handleEmailChange(event) {
    const emailValue = event.target.value;
    setEmail(emailValue.toLowerCase());
    // Verifica se o e-mail tem um formato válido usando validator.js
    setIsValid(validator.isEmail(emailValue));
  }

  //Função para extrair os dados do funcionário no componente feedback e jogá-lo para o CadastrarComponent
  function handleDadosFuncionario(e) {
    const dado = e;
    setDadosFuncionario(e);
    setNome(e.nome);
    setEmail(e.email);
    setSetor(e.setor);
    setCadastrar(true);
    setFeedback(false);
    setHomeRender(false);
    setPendentes(false);
  }

  //Funções para renderização dos componentes
  //Função para renderização do componente de cadastro
  function handleCadastrar() {
    setCadastrar(true);
    setFeedback(false);
    setHomeRender(false);
    setPendentes(false);
    setPlanoDeAcao(false);
  }
  //Função para renderização do componente de feedback
  function handleCadastrados() {
    setCadastrar(false);
    setFeedback(true);
    setHomeRender(false);
    setPendentes(false);
    setPlanoDeAcao(false);
  }
  // Função para renderização do componente Home
  function handleHome() {
    setHomeRender(true);
    setCadastrar(false);
    setFeedback(false);
    setPendentes(false);
    setPlanoDeAcao(false);
  }
  // Função para renderização do componente Pendentes
  function handlePendentes() {
    setHomeRender(false);
    setCadastrar(false);
    setFeedback(false);
    setPendentes(true);
    setPlanoDeAcao(false);
  }
  // Função para renderização do componente Planodeacao
  function handlePlano() {
    setHomeRender(false);
    setCadastrar(false);
    setFeedback(false);
    setPendentes(false);
    setPlanoDeAcao(true);
  }
  //Função disparada no componente pendentes para troca para o componente feedback
  function handleChangeFeed(e) {
    setHomeRender(e.homeRender);
    setCadastrar(e.cadastrar);
    setFeedback(e.feedback);
    setPendentes(e.pendentes);
    setPlanoDeAcao(e.planoDeAcao);
  }

  //Função disparada no componente pendentes para troca para o componente plano
  function handleChangePlano(e) {
    setHomeRender(e.homeRender);
    setCadastrar(e.cadastrar);
    setFeedback(e.feedback);
    setPendentes(e.pendentes);
    setPlanoDeAcao(e.planoDeAcao);
    setAnoPai(e.ano);
    setMesPai(e.mes);
    setEmailPai(e.email);
  }

  return (
    <main>
      <header className="header"></header>
      <section className="d-flex w-100">
        {/* Aqui é a renderização do Sidebar */}
        <Sidebar
          onClickCadastrar={handleCadastrar}
          onClickCadastrados={handleCadastrados}
          onClickHome={handleHome}
          onClickPendentes={handlePendentes}
          onClickPlano={handlePlano}
          pendentes={pendentes}
          cadastrar={cadastrar}
          homeRender={homeRender}
          feedback={feedback}
          planoDeAcao={planoDeAcao}
        />

        <div className="m-3" style={{ width: '70%' }}>
          {/* Aqui é a renderização da Home */}
          {homeRender && (
            <Home
              usuario={usuario}
              listaCadastro={listaCadastro}
              dadosUsuarioLogado={dadosUsuarioLogado}
              avalDoFuncionario={avalDoFuncionario}
              idUsuario={idUsuario}
              setorChefe={setorChefe}
            />
          )}

          {/* Aqui é a renderização do Cadastro */}
          {cadastrar && (
            <CadastrarComponent
              nome={nome}
              email={email}
              handleChangeEmail={handleEmailChange}
              handleChangeName={handleChangeName}
              isValid={isValid}
              setor={setor}
              handleChangeSetor={(e) => setSetor(e.currentTarget.value)}
              gravar={gravar}
            />
          )}

          {/* Aqui é a renderização do componente do feedback */}
          {feedback && (
            <Feedback
              listaCadastro={listaCadastro}
              usuario={usuario}
              onChangeNewId={(e) => setNewId(e)}
              onChangeListaCadastro={(e) => setListaCadastro(e)}
              onChangeDadosFuncionario={(e) => handleDadosFuncionario(e)}
              dados={dados}
              setorChefe={setorChefe}
              avalDoFuncionario={avalDoFuncionario}
              dadosUsuarioLogado={dadosUsuarioLogado}
            />
          )}
          {/* Aqui é a renderização do componente do feedback */}
          {planoDeAcao && (
            <Planodeacao
              avalDoFuncionario={avalDoFuncionario}
              setorChefe={setorChefe}
              anoPai={anoPai}
              mesPai={mesPai}
              emailPai={emailPai}
            />
          )}
          {/* Aqui é a renderização do componente do pendentes */}
          {pendentes && (
            <Pendentes
              avalDoFuncionario={avalDoFuncionario}
              onChangeDados={(e) => setDados(e)}
              onChangeComponenteFeedBack={(e) => handleChangeFeed(e)}
              setorChefe={setorChefe}
              onChangeComponentePlano={(e) => handleChangePlano(e)}
            />
          )}
        </div>
      </section>
      {/* Aqui são as renderizações dos Dialogs de avisos */}
      <Dialog
        open={openCadastro}
        descricao={mesmoFuncionario}
        handleClose={() => setOpenCadastro(false)}
      />
      <Dialog
        open={open}
        descricao={validacao}
        handleClose={() => setOpen(false)}
      />
      <Dialog
        open={openEmail}
        descricao={validaEmail}
        handleClose={() => setOpenEmail(false)}
      />
      <Dialog
        open={cadastroSucesso}
        descricao={sucessoCadastro}
        handleClose={() => setCadastroSucesso(false)}
        Title="Cadastro"
      />
      <Dialog
        open={edicaoSucesso}
        descricao={sucessoEdicao}
        handleClose={() => setEdicaoSucesso(false)}
        Title="Cadastro"
      />
    </main>
  );
}

if (document.getElementById('root')) {
  ReactDOM.render(<App />, document.getElementById('root'));
}
