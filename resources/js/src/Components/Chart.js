import { Line } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';

export default function Chart({ data }) {
  //Componente usado para geração do gráfico que é usado no App.js
  return (
    <section style={{ height: '500px', width: '100%' }}>
      <Line data={data} />
    </section>
  );
}
