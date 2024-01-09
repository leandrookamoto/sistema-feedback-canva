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

export default function App() {
  //Variáveis para mudança de tela
  const [cadastrar, setCadastrar] = useState(false);
  const [homeRender, setHomeRender] = useState(true);
  const [feedback, setFeedback] = useState(false);

  //Variáveis para gravação de estado
  const [usuario, setUsuario] = useState('');
  const [listaAtestado, setListaAtestado] = useState([]);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [setor, setSetor] = useState('');
  const [listaCadastro, setListaCadastro] = useState([]);
  const [newId, setNewId] = useState(0);
  const [idFuncionario, setIdFuncionario] = useState(null);
  const [isValid, setIsValid] = useState(true);
  const [historico, setHistorico] = useState('');
  const [emailUsuario, setEmailUsuario] = useState('');
  const [dadosFuncionario, setDadosFuncionario] = useState({});
  const [dados, setDados] = useState({});

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
    const fetchData = async () => {
      try {
        // Primeira requisição
        const responseUser = await axios.get('/user');
        const usuarioLogado = responseUser.data.name;
        setUsuario(usuarioLogado);
  
        // Segunda requisição para obter a lista original
        const responseListaOriginal = await axios.get('/cadastrados');
        const listaOriginal = responseListaOriginal.data;
        setListaCadastro(listaOriginal);
  
        // Terceira requisição para obter a lista dos colaboradores do outro banco de dados
        const responseColaboradoresAtestado = await axios.get('/colaboradores-atestado');
        const listaAtestado = responseColaboradoresAtestado.data;
  
        // Verificar se os colaboradores do segundo banco de dados já existem na lista original
        const funcionariosNaoCadastrados = listaAtestado.filter((colaboradorAtestado) => {
          return !listaOriginal.some((funcionario) => funcionario.nome === colaboradorAtestado.nome);
        });
  
        // Cadastrar os funcionários não encontrados na lista original
        for (const item of funcionariosNaoCadastrados) {
          try {
            const novoUsuario = {
              nome: item.nome,
              email: 'cadastrar@email.com',
              setor: item.setor,
              administrador: 'Leandro Okamoto',
            };
            await axios.post('/cadastrar-usuario', novoUsuario);
            console.log('Usuário cadastrado com sucesso:', novoUsuario);
          } catch (error) {
            console.error('Erro ao cadastrar usuário:', error);
          }
        }
  
        // Atualizar a lista original após os cadastros
        const updatedListaOriginal = await axios.get('/cadastrados');
        setListaCadastro(updatedListaOriginal.data);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      }
    };
  
    fetchData();
  }, []);
  
  // useEffect(() => {
  //   axios
  //     .get('/user')
  //     .then((response) => {
  //       const usuarioLogado = response.data.name;
  //       const emailUsuario2 = response.data.email;
  //       setUsuario(usuarioLogado);
  //       setEmailUsuario(emailUsuario2);
  //       console.log('Este é o email ' + emailUsuario2);

  //       // Segunda requisição feita após o sucesso da primeira
  //       axios
  //         .get('/cadastrados')
  //         .then((response) => {
  //           const lista = response.data;
  //           const listaFiltrada = lista.filter(
  //             (item) => item.administrador === usuarioLogado,
  //           );
  //           setListaCadastro(listaFiltrada);
  //           console.log('Lista',lista);

  //           const id = response.data.length
  //             ? lista[response.data.length - 1].id
  //             : 0;
  //           setNewId(id);
  //           //Requisição do outro banco de dados
  //           axios
  //             .get('/colaboradores-atestado')
  //             .then((response) => {
  //               const lista = response.data;
  //               const cadastrarNovoUsuario = async (item) => {
  //                 try {
  //                   const listaNova = {
  //                     nome: item.nome,
  //                     email: 'cadastrar@email.com',
  //                     setor: item.setor,
  //                     administrador: 'Leandro Okamoto',
  //                   };
  //                   // Realiza a requisição para cadastrar um novo usuário
  //                   const responseCadastro = await axios.post(
  //                     '/cadastrar-usuario',
  //                     listaNova,
  //                   );
  //                   console.log(
  //                     'Usuário cadastrado com sucesso:',
  //                     responseCadastro.data,
  //                   );
  //                   // Você pode realizar outras operações após o cadastro, se necessário
  //                 } catch (error) {
  //                   console.error('Erro na requisição:', error);
  //                 }
  //               };
  //               if (lista.length > 0) {
  //                 // Itera sobre cada item da listaAtestado e faz a requisição POST separadamente
  //                 for (const item of lista) {
  //                   cadastrarNovoUsuario(item); //está dando erro aqui!
  //                 }
  //               }
  //               // const listaFiltrada = lista.filter(item => item.administrador === usuarioLogado);
  //               // setListaCadastro(listaFiltrada);

  //               // const id = response.data.length?lista[response.data.length-1].id:0;
  //               // console.log(`Este é o id final: ${id}`)
  //               // setNewId(id);
  //             })

  //             .catch((error) => {
  //               // Tratar erros da segunda requisição, se necessário
  //               console.error('Erro na segunda requisição:', error);
  //             });
  //         })
  //         .catch((error) => {
  //           // Tratar erros da segunda requisição, se necessário
  //           console.error('Erro na segunda requisição:', error);
  //         });
  //     })

  //     .catch((error) => {
  //       // Tratar erros da primeira requisição, se necessário
  //       console.error('Erro na primeira requisição:', error);
  //     });
  // }, []);

  //Funções principais
  //Função para cadastrar os funcionários
  async function gravar() {
    try {
      if (dadosFuncionario.id) {
        // Edição de funcionário existente
        await axios.put(`/funcionario/${dadosFuncionario.id}`, {
          nome: nome,
          email: email,
          setor: setor,
        });
        setEdicaoSucesso(true);
        //Renderiza o componente feedback após a gravação de dados
        setCadastrar(false);
        setFeedback(true);
        setHomeRender(false);
      } else {
        // Validação dos inputs e cadastro de novo funcionário
        if (!nome || !email || !setor) {
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
          setor: setor,
          administrador: usuario,
          id: newId,
        };

        // Cadastro do novo funcionário
        await axios.post('/cadastrar-usuario', novoCadastro).then(() => {
          setCadastroSucesso(true);
          setCadastrar(false);
          setFeedback(true);
          setHomeRender(false);
          setNome('');
          setEmail('');
          setSetor('');
          setDadosFuncionario({});
        });

        setListaCadastro([...listaCadastro, novoCadastro]);
        setNewId(newId + 1);
      }

      // Atualização da lista após edição ou cadastro
      const response = await axios.get('/cadastrados');
      const lista = response.data;
      const listaFiltrada = lista.filter(
        (item) => item.administrador === usuario,
      );

      //Após a gravação ou edição recupera os valores do banco de dados
      const novaLista = listaFiltrada.find((item) => item.email === email);
      setDados(novaLista);

      setListaCadastro(listaFiltrada);

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

  //Funções auxiliares
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
  }

  //Funções para renderização dos componentes
  //Função para renderização do componente de cadastro
  function handleCadastrar() {
    setCadastrar(true);
    setFeedback(false);
    setHomeRender(false);
  }
  //Função para renderização do componente de feedback
  function handleCadastrados() {
    setCadastrar(false);
    setFeedback(true);
    setHomeRender(false);
  }
  // Função para renderização do componente Home
  function handleHome() {
    setHomeRender(true);
    setCadastrar(false);
    setFeedback(false);
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
        />

        <div className="m-3" style={{ width: '70%' }}>
          {/* Aqui é a renderização da Home */}
          {homeRender && (
            <Home usuario={usuario} listaCadastro={listaCadastro} />
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
