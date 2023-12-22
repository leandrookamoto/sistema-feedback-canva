
import React from 'react';
import ReactDOM from 'react-dom';
import Input from  './Components/Input';
import './index.css';
import {useState, useEffect} from 'react';
import Chart from './Components/Chart';
import './App.css';
import Sidebar from './Components/Sidebar';

export default function App() {

  //   const [animais,setAnimais] = useState('');
  //   const [dados, setDados] = useState([]);
  //   const [popularidade, setPopularidade] = useState(null);

  //   const data = {
  //     labels: dados.map(item => item.animais),
  //     datasets:[
  //         {label:'Popularity',
  //         data: dados.map(item => item.popularidade)
  //         }
  //     ]
  
  // }


  //   // let item = todoList.map((item)=>{return item.description})
  //   // console.log(item.join(''));


  //   // const childToParent = (childdata) => {
  //   //   setNome(childdata);
  //   // }


  //   function gravar(){
  //     const animais2 = [...dados, {animais: animais, popularidade: popularidade}];
  //     setDados(animais2);
  //     console.log(animais2);
  //     setAnimais('');
  //     setPopularidade('');
  //   }

    return (

          <main>
            <header className='header'></header>
            <Sidebar />
          </main>


    );
}

if (document.getElementById('root')) {
    ReactDOM.render(<App />, document.getElementById('root'));
}