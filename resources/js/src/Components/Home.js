import Chart from './Chart';
import './Home.css';
import { useState, useEffect } from 'react';

export default function Home({ usuario, listaCadastro }) {
  const [avaliacoesRealizadas, setAvaliacoesRealizadas] = useState([]);
  useEffect(() => {
    const lista = listaCadastro.map((item) => item.avaliacoes);
    let novaLista = lista.filter((item) => Array.isArray(JSON.parse(item)));

    let arrayDeObjetos = [];

    for (let i = 0; i < novaLista.length; i++) {
      const item = novaLista[i];
      // Faça o que precisar com os itens que são arrays válidos
      console.log('novaLista', JSON.parse(item));

      // Adiciona cada item (array) como um objeto ao arrayDeObjetos
      arrayDeObjetos.push(JSON.parse(item));

      setAvaliacoesRealizadas(arrayDeObjetos);
    }

    // const novaLista2 = arrayDeObjetos.map(item=>JSON.parse(item.dados));

    console.table(arrayDeObjetos);
  }, [listaCadastro]);

  //Data para a configuração do Chart.js
  const data = {
    labels: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho'],
    datasets: [
      {
        label: 'Feedbacks realizados',
        data: Array(50).fill(avaliacoesRealizadas.length),
        borderColor: 'blue',
        backgroundColor: 'blue',
      },
      {
        label: 'Metas',
        /*Aqui a meta é automaticamente preenchido de acordo com o número dos
        feedbacks de cima e de acordo com o número de funcionários cadastrados*/
        data: Array(50).fill(listaCadastro.length),
        borderColor: 'red',
        backgroundColor: 'red',
      },
    ],
  };

  return (
    <>
      <section>
        <h3>Olá, {usuario}!</h3>
        <Chart data={data} />
      </section>
    </>
  );
}
