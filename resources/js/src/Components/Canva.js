import { faTruckField } from '@fortawesome/free-solid-svg-icons';
import './Canva.css';
import {useState, useEffect} from 'react';
import Dialog  from './Dialog';

export default function Canva(){
    //Constantes para gravação de estado para o canva
    const [listaCanva,setListaCanva] = useState([]);
    const [competencia,setCompetencia] = useState('');
    const [atividades,setAtividades] = useState('');
    const [listaAtividades, setListaAtividades] = useState([]);
    const [senioridade, setSenioridade] = useState('');
    const [fortes, setFortes]=useState('');
    const [listaFortes, setListaFortes] = useState([])
    const [atencao, setAtencao] = useState('');
    const [listaAtencao, setListaAtencao] = useState([]);
    const [melhorias, setMelhorias] = useState('');
    const [listaMelhorias, setListaMelhorias] = useState([]);
    const [notes, setNotes] = useState({});
    const [notaFinal, setNotaFinal] = useState(null);
    const [selectedDate, setSelectedDate] =useState('');
    const [mouthDate, setMouthDate] = useState('');
    const [yearDate, setYearDate] = useState('');

    //Constantes para validações em geral
    const [isValidAtividades, setIsValidAtividades] = useState(true);
    const [isValidFortes, setIsValidFortes] = useState(true);
    const [isValidAtencao, setIsValidAtencao] = useState(true);
    const [isValidMelhorias, setIsValidMelhorias] = useState(true);
    const [openValidaNota, setOpenValidaNota] = useState(false);

    //Constante para abertura do Dialog/Modal
    const [open,setOpen] = useState(false);
    const descricao = 'Favor usar vírgulas para separar as características. Por exemplo: Pontualidade, Educação'
    const validaNota = 'O intervalo de notas é de 1 a 7'

    //Funções para gravação do listaCanva atividades, pontos fortes e ações de melhorias e onChange
    function handleAtividades(e){
        const value = e.currentTarget.value;
        setAtividades(e.currentTarget.value);
        const newActivities = e.currentTarget.value.split(',').map(activity => activity.trim());
        setListaAtividades(newActivities.filter(activity => activity !== ''));
        const regex = /^[\p{L}\w\s]+(,\s*[\p{L}\w\s]+)*$/u;
        const isValidInput = regex.test(e.currentTarget.value);
        setIsValidAtividades(isValidInput);
    }

    function handleFortes(e){
        const value = e.currentTarget.value;
        setFortes(e.currentTarget.value);
        const newFortes = e.currentTarget.value.split(',').map(activity => activity.trim());
        setListaFortes(newFortes.filter(forte => forte !== ''));
        const regex = /^[\p{L}\w\s]+(,\s*[\p{L}\w\s]+)*$/u;
        const isValidInput = regex.test(e.currentTarget.value);
        setIsValidFortes(isValidInput);
    }

    function handleAtencao(e){
        const value = e.currentTarget.value;
        setAtencao(e.currentTarget.value);
        const newAtencao = e.currentTarget.value.split(',').map(activity => activity.trim());
        setListaAtencao(newAtencao.filter(atencao => atencao !== ''));
        const regex = /^[\p{L}\w\s]+(,\s*[\p{L}\w\s]+)*$/u;
        const isValidInput = regex.test(e.currentTarget.value);
        setIsValidAtencao(isValidInput);
    }

    function handleMelhorias(e){
        const value = e.currentTarget.value;
        setMelhorias(e.currentTarget.value);
        const newMelhorias = e.currentTarget.value.split(',').map(activity => activity.trim());
        setListaMelhorias(newMelhorias.filter(melhorias => melhorias !== ''));
        const regex = /^[\p{L}\w\s]+(,\s*[\p{L}\w\s]+)*$/u;
        const isValidInput = regex.test(e.currentTarget.value);
        setIsValidMelhorias(isValidInput);
    }

      
      const handleNoteChange = (item, e) => {
        const value = e.target.value.trim(); // Remover espaços em branco extras
        
        if (value === '') {
          setNotes({ ...notes, [item]: '' });
        } else {
          const numericValue = parseFloat(value);
      
          if (!isNaN(numericValue)) {
            if (numericValue >= 1 && numericValue <= 7) {
              setNotes({ ...notes, [item]: numericValue });
            } else {
                setOpenValidaNota(true);
            }
          } else {
            setOpenValidaNota(true);
          }
        }
      };
      


  //Função para gravar os dados
  function gravar(){
    if(!isValidAtencao||!isValidAtividades||!isValidFortes||!isValidMelhorias){
        setOpen(true);
    }else{
    calculateFinalGrade();
    // Eu usei o useEffect para deixar a notaFinal atualizada antes de gravar
}
};


//useEffect para manter a notaFinal atualizada para gravar
useEffect(()=>{
    const lista = [...listaCanva, {competencia: competencia, atividades: listaAtividades, senioridade: senioridade, atencao: listaAtencao, melhorias: listaMelhorias, fortes: listaFortes, mes: mouthDate, ano: yearDate, nota: notaFinal}]
    setListaCanva(lista);
    console.log(lista);
},[notaFinal]);



        //Função para calcular a nota
      function calculateFinalGrade () {
        const notesValues = Object.values(notes).map((note) => parseFloat(note));
        const total = notesValues.reduce((acc, curr) => acc + (curr || 0), 0);
        const final = total / notesValues.length || 0;
        setNotaFinal(final.toFixed(2));
      };


      //Função para obter somente o mês pelo input date
      function obterNomeDoMes(dataString) {
        const meses = [
          'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
          'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
        ];
      
        const partesData = dataString.split('-');
        const ano = parseInt(partesData[0]);
        const mesIndex = parseInt(partesData[1]) - 1; // Subtrai 1 para considerar o índice do array
        const dia = parseInt(partesData[2]);
      
        const data = new Date(ano, mesIndex, dia); // Cria uma nova data com o ano, mês e dia
      
        const nomeMes = meses[data.getMonth()]; // Obtém o nome do mês correspondente ao índice do array de meses
      
        return { nomeMes, ano };
      }


      function handleChangeMonth(e){
        setSelectedDate(e.currentTarget.value);
        const { nomeMes, ano } = obterNomeDoMes(e.currentTarget.value);
        setMouthDate(nomeMes);
        setYearDate(ano);
      }
        

      console.log(`Esta é a notaFinal ${notaFinal}`);
 
    

    return(<>

            <input type="date" id="data-pagamento" name="data_pagamento" value={selectedDate} 
                                onChange={handleChangeMonth} className="form-control" />

                    <p>Mês: {mouthDate}</p>
        <div className="mb-3">
            <label for="exampleFormControlInput1" className="form-label">Competência</label>
            <input className="form-control" id="exampleFormControlInput1" placeholder="Adicione a competência necessária" value={competencia} onChange={e=>setCompetencia(e.currentTarget.value)}/>
        </div>
        <div className="mb-3">
            <label for="exampleFormControlInput1" className="form-label">Atividades</label>
            <input className="form-control" id="exampleFormControlInput1" value={atividades}  placeholder="Adicione as atividades necessárias. Separe as atividades por vírgula. Ex: Atendimento, Agendamento" onChange={handleAtividades}/>
        </div>
        <div className="mb-3">
            <label for="exampleFormControlInput1" className="form-label">Pontos fortes</label>
            <input className="form-control" id="exampleFormControlInput1" value={fortes}  placeholder="Adicione os pontos fortes. Separe os pontos fortes por vírgula. Ex: Pontualidade, Disciplina" onChange={handleFortes}/>
        </div>
        <div className="mb-3">
            <label for="exampleFormControlInput1" className="form-label">Pontos de atenção</label>
            <input className="form-control" id="exampleFormControlInput1" value={atencao}  placeholder="Adicione os pontos fortes. Separe os pontos de atenção por vírgula. Ex: Atrasos, Falta de Conhecimento" onChange={handleAtencao}/>
        </div>
        <div className="mb-3">
            <label for="exampleFormControlInput1" className="form-label">Ações de melhorias</label>
            <input className="form-control" id="exampleFormControlInput1" value={melhorias}  placeholder="Adicione as ações de melhorias. Separe as ações de melhorias por vírgula. Ex: Aumentar conhecimentos, Treinamentos" onChange={handleMelhorias}/>
        </div>

        <div className="mb-3">
            <label for="exampleFormControlInput1" className="form-label">Qual é o nível do profissional por atividade?</label>
            {listaAtividades.map((item,index)=><>
                <div key={index}>
          <label>
            {item}:
            <input
              type="number"
              className="form-control"
              value={notes[item] || ''}
              onChange={(e) => handleNoteChange(item, e)}
              placeholder={`Nota para ${item}`}
            />
          </label>
        </div>
            </>)}
            
            
            </div>

            <button type="button" className="btn btn-primary mb-2" onClick={gravar}>Gravar</button>


        <section className="canvaContainer container w-100 mb-3">
            <div className='headerCanva d-flex justify-content-between align-items-center'><div>Feedback Canva</div>{mouthDate&&<div style={{fontSize: '15px'}}>Data: {mouthDate}/{yearDate}</div>}</div>
            <div className="row">
                <div className="customBorder col-2 d-flex justify-content-center align-items-center">Competência</div>
                <div className="customBorder col-3 d-flex justify-content-center align-items-center">Atividades</div>
                <div className="customBorder col d-flex justify-content-center flex-column align-items-center" style={{backgroundColor: '#fefdd9'}}><div style={{fontSize: '15px'}}>1</div><div style={{fontSize: '10px', fontWeight: 'bold', marginTop: '-5px'}}>Novato</div></div>
                <div className="customBorder col d-flex justify-content-center flex-column align-items-center" style={{backgroundColor: '#fff3d5'}}><div style={{fontSize: '15px'}}>2</div><div style={{fontSize: '10px', fontWeight: 'bold', marginTop: '-5px'}}>Aprendiz</div></div>
                <div className="customBorder col d-flex justify-content-center flex-column align-items-center" style={{backgroundColor: '#fee2d5'}}><div style={{fontSize: '15px'}}>3</div><div style={{fontSize: '10px', fontWeight: 'bold', marginTop: '-5px'}}>Praticante</div></div>
                <div className="customBorder col d-flex justify-content-center flex-column align-items-center" style={{backgroundColor: '#fad4df'}}><div style={{fontSize: '15px'}}>4</div><div style={{fontSize: '10px', fontWeight: 'bold', marginTop: '-5px'}}>Profissional</div></div>
                <div className="customBorder col d-flex justify-content-center flex-column align-items-center" style={{backgroundColor: '#f2caff'}}><div style={{fontSize: '15px'}}>5</div><div style={{fontSize: '10px', fontWeight: 'bold', marginTop: '-5px'}}>Professor</div></div>
                <div className="customBorder col d-flex justify-content-center flex-column align-items-center" style={{backgroundColor: '#d9c9ff'}}><div style={{fontSize: '15px'}}>6</div><div style={{fontSize: '10px', fontWeight: 'bold', marginTop: '-5px'}}>Líder</div></div>
                <div className="customBorder2 col d-flex justify-content-center flex-column align-items-center" style={{backgroundColor: '#d4e4fe'}}><div style={{fontSize: '15px'}}>7</div><div style={{fontSize: '10px', fontWeight: 'bold', marginTop: '-5px'}}>Mestre</div></div>
             </div>

             <div className="row">
                <div className="customBorder3 col-2 d-flex justify-content-center align-items-center">
                {listaCanva.length > 0 && listaAtividades.length > 0 && (
                    listaCanva.map((item, index) => (
                        item.competencia && ( // Verifica se a competência existe
                        <div key={index} className='post-it d-flex justify-content-center align-items-center'>
                            {item.competencia}
                        </div>
                        )
                    ))
                    )}


                    </div>
                <div className="customBorder3 col-3">
                    <div className='box mt-1'>
                        {listaCanva.map(item=>item.atividades.map((item,index)=><div className={listaAtividades.length<=3?'d-flex justify-content-center align-items-center post-it2':'d-flex justify-content-center align-items-center post-it'}>{item}</div>))}
                    </div>
                </div>
                <div className="customBorder3 col d-flex flex-column justify-content-center align-items-center">{notaFinal==1&&<div className='mb-3' style={{borderRadius: '100%', width: '45px', height:'45px', backgroundColor: 'red'}}></div>}</div>
                <div className="customBorder3 col d-flex flex-column justify-content-center align-items-center">{(notaFinal>1&&notaFinal<=2)&&<div className='mb-3' style={{borderRadius: '100%', width: '45px', height:'45px', backgroundColor: 'red'}}></div>}</div>
                <div className="customBorder3 col d-flex flex-column justify-content-center align-items-center">{(notaFinal>2&&notaFinal<=3)&&<div className='mb-3' style={{borderRadius: '100%', width: '45px', height:'45px', backgroundColor: 'red'}}></div>}</div>
                <div className="customBorder3 col d-flex flex-column justify-content-center align-items-center">{(notaFinal>3&&notaFinal<=4)&&<div className='mb-3' style={{borderRadius: '100%', width: '45px', height:'45px', backgroundColor: 'red'}}></div>}</div>
                <div className="customBorder3 col d-flex flex-column justify-content-center align-items-center">{(notaFinal>4&&notaFinal<=5)&&<div className='mb-3' style={{borderRadius: '100%', width: '45px', height:'45px', backgroundColor: 'red'}}></div>}</div>
                <div className="customBorder3 col d-flex flex-column justify-content-center align-items-center">{(notaFinal>5&&notaFinal<=6)&&<div className='mb-3' style={{borderRadius: '100%', width: '45px', height:'45px', backgroundColor: 'red'}}></div>}</div>
                <div className="customBorder4 col d-flex flex-column justify-content-center align-items-center" >{(notaFinal>6&&notaFinal<=7)&&<div className='mb-3' style={{borderRadius: '100%', width: '45px', height:'45px', backgroundColor: 'red'}}></div>}</div>

                <div className="row w-100">
                    
                <div className='customBorder5 pt-3 col-4 d-flex flex-column justify-content-center align-items-center' ><div>
                        <div className='d-flex justify-content-center'><svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-emoji-smile" viewBox="0 0 16 16">
  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
  <path d="M4.285 9.567a.5.5 0 0 1 .683.183A3.498 3.498 0 0 0 8 11.5a3.498 3.498 0 0 0 3.032-1.75.5.5 0 1 1 .866.5A4.498 4.498 0 0 1 8 12.5a4.498 4.498 0 0 1-3.898-2.25.5.5 0 0 1 .183-.683M7 6.5C7 7.328 6.552 8 6 8s-1-.672-1-1.5S5.448 5 6 5s1 .672 1 1.5m4 0c0 .828-.448 1.5-1 1.5s-1-.672-1-1.5S9.448 5 10 5s1 .672 1 1.5"/>
</svg></div>
                        <div>Pontos Fortes</div>
                        </div>
                        <div className='customBorder7'>{listaCanva.map(item=>item.fortes.map((item,index)=><div>{item}</div>))}</div>
                        
                        </div>
                    <div className='customBorder5 pt-3 col-4 d-flex flex-column justify-content-center align-items-center' ><div>
                        <div className='d-flex justify-content-center'><svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-emoji-frown" viewBox="0 0 16 16">
  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
  <path d="M4.285 12.433a.5.5 0 0 0 .683-.183A3.498 3.498 0 0 1 8 10.5c1.295 0 2.426.703 3.032 1.75a.5.5 0 0 0 .866-.5A4.498 4.498 0 0 0 8 9.5a4.5 4.5 0 0 0-3.898 2.25.5.5 0 0 0 .183.683M7 6.5C7 7.328 6.552 8 6 8s-1-.672-1-1.5S5.448 5 6 5s1 .672 1 1.5m4 0c0 .828-.448 1.5-1 1.5s-1-.672-1-1.5S9.448 5 10 5s1 .672 1 1.5"/>
</svg></div>
                        <div>Pontos de atenção</div>
                        </div>
                        <div className='customBorder7'>{listaCanva.map(item=>item.atencao.map((item,index)=><div>{item}</div>))}</div>
                        
                        </div>
                        <div className='customBorder8 pt-3 col-4 d-flex flex-column justify-content-center align-items-center' ><div>
                        <div className='d-flex justify-content-center'><svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-check-circle-fill" viewBox="0 0 16 16">
  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
</svg></div>
                        <div>Ações de melhoria</div>
                        </div>
                        <div className='customBorder7'>{listaCanva.map(item=>item.melhorias.map((item,index)=><div>{item}</div>))}</div>
                        
                        </div>
                </div>
             </div>
           
        </section>

        <Dialog open={open} descricao={descricao} handleClose={()=>setOpen(false)} Title='Atenção'/>
        <Dialog open={openValidaNota} descricao={validaNota} handleClose={()=>setOpenValidaNota(false)} Title='Atenção'/>


        

        
    
    </>)
}