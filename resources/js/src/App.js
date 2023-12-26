
import React from 'react';
import ReactDOM from 'react-dom';
import Input from  './Components/Input';
import './index.css';
import {useState, useEffect} from 'react';
import Chart from './Components/Chart';
import './App.css';
import Sidebar from './Components/Sidebar';
import Home from './Components/Home';
import CadastrarComponent from './Components/CadastrarComponent';
import validator from 'validator';
import Dialog from './Components/Dialog';


export default function App() {

    //Variáveis para mudança de tela
    const [cadastrar, setCadastrar] = useState(false);
    const [homeRender,setHomeRender] = useState(false);

    //Variáveis para gravação de estado
    const [usuario,setUsuario] = useState('');
    const [listaAtestado, setListaAtestado] = useState([]);
    const [nome,setNome]=useState('');
    const [email,setEmail]=useState('');
    const [setor, setSetor] = useState('');
    const [listaCadastro, setListaCadastro] = useState([]);
    const [newId, setNewId] = useState(0);
    const [mouthDate, setMouthDate] = useState('');
    const [idFuncionario, setIdFuncionario] = useState(null);
    const [isValid, setIsValid] = useState(true);

    //Variáveis que controlam a abertura dos Dialogs
    const [openCadastro, setOpenCadastro] = useState(false);
    const [open,setOpen] = useState(false);
    const [openEmail, setOpenEmail] = useState('');

    
    //Variável para descrição do Dialog/Modal/Popup
    const mesmoFuncionario = 'Você já cadastrou esse funcionário!';
    const validacao='Favor preencher todos os dados!';
    const validaEmail = 'Favor inserir um e-mail válido!';


    //Primeira requisição para a recuperação dos dados dos usuários ao inicializar o programa
    useEffect(() => {
      axios.get('/user')
        .then(response => {
          const usuarioLogado = response.data.name;
          setUsuario(usuarioLogado);
    
          // Segunda requisição feita após o sucesso da primeira
          axios.get('/cadastrados')
            .then(response => {
              const lista = response.data;
              console.log(lista);
              const listaFiltrada = lista.filter(item => item.administrador === usuarioLogado);
              setListaCadastro(listaFiltrada);

              const id = response.data.length?lista[response.data.length-1].id:0;
              console.log(`Este é o id final: ${id}`)
              setNewId(id);
            })
            .catch(error => {
              // Tratar erros da segunda requisição, se necessário
              console.error('Erro na segunda requisição:', error);
            });
    
        })
        .catch(error => {
          // Tratar erros da primeira requisição, se necessário
          console.error('Erro na primeira requisição:', error);
        });



        axios.get('/colaboradores-atestado')
            .then(response => {
              setListaAtestado(response.data);
              console.log(response.data);
              // const listaFiltrada = lista.filter(item => item.administrador === usuarioLogado);
              // setListaCadastro(listaFiltrada);

              // const id = response.data.length?lista[response.data.length-1].id:0;
              // console.log(`Este é o id final: ${id}`)
              // setNewId(id);

            })

            .catch(error => {
              // Tratar erros da segunda requisição, se necessário
              console.error('Erro na segunda requisição:', error);
            });
    }, []);



    // const [animais,setAnimais] = useState('');
    // const [dados, setDados] = useState([]);
    // const [popularidade, setPopularidade] = useState(null);

  //   const data = {
  //     labels: dados.map(item => item.animais),
  //     datasets:[
  //         {label:'Popularity',
  //         data: dados.map(item => item.popularidade)
  //         }
  //     ]
  
  // }


//   const data = {
//     labels: ['Dogs','Cats', 'Birds', 'Fish', 'Hamster'],
//     datasets:[
//         {label:'Popularity',
//         data:[50,15,20,15,10]
//         }
//     ]

// }



    // function gravar(){
    //   const animais2 = [...dados, {animais: animais, popularidade: popularidade}];
    //   setDados(animais2);
    //   console.log(animais2);
    //   setAnimais('');
    //   setPopularidade('');
    // }


          //Função para cadastrar os funcionários
    function gravar(){
      // Validação dos inputs
        if(!nome||!email||!setor){
          //Variável para a abertura do Dialog/Modal/Popup
            setOpen(true);
            // alert('Favor colocar todos os dados!');

            //Valida se o e-mail é válido!
        }else if(!isValid){
            //Variável para abertura do Dialog que avisa de que é preciso um email válido.
            setOpenEmail(true);
        }else{

          const novoCadastro = { nome: nome, email: email, setor: setor, administrador: usuario, id: newId };

          // Verifica se o e-mail já existe na lista
          const emailJaExiste = listaCadastro.length > 0 && email !== '' && listaCadastro.some(item => item.email === email);
      
          if (emailJaExiste) {
            console.log('O e-mail já existe na lista!');
            setOpenCadastro(true);
          } else {
            const lista = [...listaCadastro, novoCadastro];
            setListaCadastro(lista);
            setNewId(newId + 1);
            
        // Essa requisição é necessária para manter o id para as requisições de updates atualizadas!
        axios.post('/cadastrar-usuario', {nome: nome, email: email, setor: setor, administrador: usuario})
          .then(response => {
            console.log('Usuário cadastrado com sucesso:', response.data);
            setCadastroSucesso(true);
            // Lidar com a resposta do servidor após o cadastro ser realizado com sucesso
          })
          axios.get('/cadastrados')
                  .then(response => {
                    const lista = response.data;
                    const listaFiltrada = lista.filter(item => item.administrador === usuario);
                    setListaCadastro(listaFiltrada);

                    const id = response.data.length?lista[response.data.length-1].id:0;
                    console.log(`Este é o id final: ${id}`)
                    setIdFuncionario(id);
                  })
                  .catch(error => {
                    // Tratar erros da segunda requisição, se necessário
                    console.error('Erro na segunda requisição:', error);
                   
                  })

          .catch(error => {
            console.error('Erro ao cadastrar usuário:', error);
            // Lidar com erros que ocorreram durante o cadastro
          });
        }
                setNome('');
                setEmail('');
                setSetor('');
      }
                
            };





    return (

          <main>
            <header className='header'></header>
            <section className='d-flex w-100'>
            <Sidebar onClickCadastrar={() => setCadastrar(true)} />
             
              <div className='m-3' style={{width: '70%'}}>
                {/* <Chart data={data} /> */}
                {homeRender&&<Home/>}
                {cadastrar&&<CadastrarComponent
                nome={nome}
                email={email}
                handleChangeEmail={e=>setEmail(e.currentTarget.value)}
                handleChangeName={e=>setNome(e.currentTarget.value)}
                isValid={isValid}
                setor={setor}
                handleChangeSetor={e=>setSetor(e.currentTarget.value)}
                gravar={gravar}
                />}
              </div>
            </section>
            <Dialog open={openCadastro} descricao={mesmoFuncionario} handleClose={()=>setOpenCadastro(false)}/>
            <Dialog open={open} descricao={validacao} handleClose={()=>setOpen(false)}/>
            <Dialog open={openEmail} descricao={validaEmail} handleClose={()=>setOpenEmail(false)}/>
          </main>


    );
}

if (document.getElementById('root')) {
    ReactDOM.render(<App />, document.getElementById('root'));
}