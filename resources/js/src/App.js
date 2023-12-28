import React from 'react';
import ReactDOM from 'react-dom';
import Input from './Components/Input';
import './index.css';
import { useState, useEffect } from 'react';
import Chart from './Components/Chart';
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
    const [homeRender, setHomeRender] = useState(false);
    const [feedback, setFeedback] = useState(false);

    //Variáveis para gravação de estado
    const [usuario, setUsuario] = useState('');
    const [listaAtestado, setListaAtestado] = useState([]);
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [setor, setSetor] = useState('');
    const [listaCadastro, setListaCadastro] = useState([]);
    const [newId, setNewId] = useState(0);
    const [mouthDate, setMouthDate] = useState('');
    const [idFuncionario, setIdFuncionario] = useState(null);
    const [isValid, setIsValid] = useState(true);
    const [historico, setHistorico] = useState('');

    //Variáveis que controlam a abertura dos Dialogs
    const [openCadastro, setOpenCadastro] = useState(false);
    const [open, setOpen] = useState(false);
    const [openEmail, setOpenEmail] = useState('');
    const [cadastroSucesso, setCadastroSucesso] = useState(false);

    //Variável para descrição do Dialog/Modal/Popup
    const mesmoFuncionario = 'Você já cadastrou esse funcionário!';
    const validacao = 'Favor preencher todos os dados!';
    const validaEmail = 'Favor inserir um e-mail válido!';
    const sucessoCadastro = 'Cadastro realizado com sucesso!';

    //Primeira requisição para a recuperação dos dados dos usuários ao inicializar o programa
    useEffect(() => {
        axios
            .get('/user')
            .then((response) => {
                const usuarioLogado = response.data.name;
                setUsuario(usuarioLogado);

                // Segunda requisição feita após o sucesso da primeira
                axios
                    .get('/cadastrados')
                    .then((response) => {
                        const lista = response.data;
                        const listaFiltrada = lista.filter(
                            (item) => item.administrador === usuarioLogado,
                        );
                        setListaCadastro(listaFiltrada);

                        const id = response.data.length
                            ? lista[response.data.length - 1].id
                            : 0;
                        setNewId(id);
                    })
                    .catch((error) => {
                        // Tratar erros da segunda requisição, se necessário
                        console.error('Erro na segunda requisição:', error);
                    });
            })
            .catch((error) => {
                // Tratar erros da primeira requisição, se necessário
                console.error('Erro na primeira requisição:', error);
            });

        axios
            .get('/colaboradores-atestado')
            .then((response) => {
                setListaAtestado(response.data);
                // const listaFiltrada = lista.filter(item => item.administrador === usuarioLogado);
                // setListaCadastro(listaFiltrada);

                // const id = response.data.length?lista[response.data.length-1].id:0;
                // console.log(`Este é o id final: ${id}`)
                // setNewId(id);
            })

            .catch((error) => {
                // Tratar erros da segunda requisição, se necessário
                console.error('Erro na segunda requisição:', error);
            });
    }, []);

    function handleEmailChange() {
        const emailValue = event.target.value;
        setEmail(emailValue.toLowerCase());

        // Verifica se o e-mail tem um formato válido usando validator.js
        setIsValid(validator.isEmail(emailValue));
    }

    //Função para cadastrar os funcionários
    function gravar() {
        // Validação dos inputs
        if (!nome || !email || !setor) {
            //Variável para a abertura do Dialog/Modal/Popup
            setOpen(true);
            // alert('Favor colocar todos os dados!');

            //Valida se o e-mail é válido!
        } else if (!isValid) {
            //Variável para abertura do Dialog que avisa de que é preciso um email válido.
            setOpenEmail(true);
        } else {
            const novoCadastro = {
                nome: nome,
                email: email,
                setor: setor,
                administrador: usuario,
                id: newId,
            };

            // Verifica se o e-mail já existe na lista
            const emailJaExiste =
                listaCadastro.length > 0 &&
                email !== '' &&
                listaCadastro.some((item) => item.email === email);

            if (emailJaExiste) {
                console.log('O e-mail já existe na lista!');
                setOpenCadastro(true);
            } else {
                const lista = [...listaCadastro, novoCadastro];
                setListaCadastro(lista);
                setNewId(newId + 1);

                // Essa requisição é necessária para manter o id para as requisições de updates atualizadas!
                axios
                    .post('/cadastrar-usuario', {
                        nome: nome,
                        email: email,
                        setor: setor,
                        administrador: usuario,
                    })
                    .then((response) => {
                        console.log(
                            'Usuário cadastrado com sucesso:',
                            response.data,
                        );
                        setCadastroSucesso(true);
                        // Lidar com a resposta do servidor após o cadastro ser realizado com sucesso
                    });
                axios
                    .get('/cadastrados')
                    .then((response) => {
                        const lista = response.data;
                        const listaFiltrada = lista.filter(
                            (item) => item.administrador === usuario,
                        );
                        setListaCadastro(listaFiltrada);

                        const id = response.data.length
                            ? lista[response.data.length - 1].id
                            : 0;
                        console.log(`Este é o id final: ${id}`);
                        setIdFuncionario(id);
                    })
                    .catch((error) => {
                        // Tratar erros da segunda requisição, se necessário
                        console.error('Erro na segunda requisição:', error);
                    })

                    .catch((error) => {
                        console.error('Erro ao cadastrar usuário:', error);
                        // Lidar com erros que ocorreram durante o cadastro
                    });
            }
            setNome('');
            setEmail('');
            setSetor('');
        }
    }

    //Funções para renderização dos componentes
    function handleCadastrar() {
        setCadastrar(true);
        setFeedback(false);
    }

    function handleCadastrados() {
        setCadastrar(false);
        setFeedback(true);
    }

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

    return (
        <main>
            <header className="header"></header>
            <section className="d-flex w-100">
                {/* Aqui é a renderização do Sidebar */}
                <Sidebar
                    onClickCadastrar={handleCadastrar}
                    onClickCadastrados={handleCadastrados}
                />

                <div className="m-3" style={{ width: '70%' }}>
                    {/* <Chart data={data} /> */}
                    {/* Aqui é a renderização da Home */}
                    {homeRender && <Home />}

                    {/* Aqui é a renderização do Cadastro */}
                    {cadastrar && (
                        <CadastrarComponent
                            nome={nome}
                            email={email}
                            handleChangeEmail={handleEmailChange}
                            handleChangeName={handleChangeName}
                            isValid={isValid}
                            setor={setor}
                            handleChangeSetor={(e) =>
                                setSetor(e.currentTarget.value)
                            }
                            gravar={gravar}
                        />
                    )}

                    {feedback && <Feedback listaCadastro={listaCadastro} />}
                </div>
            </section>
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
        </main>
    );
}

if (document.getElementById('root')) {
    ReactDOM.render(<App />, document.getElementById('root'));
}
