import Chart from './Chart';
import './Home.css';

export default function Home({ usuario, listaCadastro }) {
  const data = {
    labels: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho'],
    datasets: [
      {
        label: 'Feedbacks realizados',
        data: [15, 20, 12, 17, 22, 25],
        borderColor: 'blue',
        backgroundColor: 'blue',
      },
      {
        label: 'Metas',
        data: [22, 22, 22, 22, 22, 22],
        borderColor: 'red',
        backgroundColor: 'red',
      },
    ],
  };

  const lista = listaCadastro.map(item=>item.avaliacoes);
  const novaLista = lista.filter(item => Array.isArray(JSON.parse(item)));
  for (let i = 0; i < novaLista.length; i++) {
    const item = novaLista[i];
    // Faça o que precisar com os itens que são arrays válidos
    console.log(JSON.parse(item)); // Exemplo: aqui está sendo feito o parse novamente para exibir no console
  }
  console.log('Esta é a lista',novaLista);

  return (
    <>
      <section>
        <h3>Olá, {usuario}!</h3>
        <Chart data={data} />
      </section>
    </>
  );
}
