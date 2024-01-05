import {Line} from 'react-chartjs-2';
import {Chart as ChartJS} from 'chart.js/auto';

const data = {
    labels: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho'],
    datasets: [
        {
            label: 'Feedbacks realizados',
            data: [15, 20, 12, 17, 22, 25],
            borderColor: 'blue',
            backgroundColor:'blue'

        },
        {
            label: 'Metas',
            data: [22,22,22,22,22,22],
            borderColor: 'red',
            backgroundColor:'red'
        }
    ]
};


export default function Chart(){


    return (<section style={{height: '500px', width: '100%'}}>
        <Line data={data}/>
    </section>)
}
