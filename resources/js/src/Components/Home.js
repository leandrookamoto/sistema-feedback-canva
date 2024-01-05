import Chart from './Chart';
import './Home.css';

export default function Home({usuario}) {
  return (
    <>
      <section>
        <h3>Olá, {usuario}!</h3>
        <Chart />

      </section>
    </>
  );
}
