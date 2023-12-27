import './Canva.css';
import {useState} from 'react';
export default function Canva(){
    //Constantes para gravação de estado para o canva
    const [listaCanva,setListaCanva] = useState([]);
    const [competencia,setCompetencia] = useState('');
    const [atividades,setAtividades] = useState('');
    const [listaAtividades, setListaAtividades] = useState([]);
    const [senioridade, setSenioridade] = useState('');
    const [listaTeste, setListaTeste] = useState([]);

    //Funções para gravação do listaCanva e atividades
    function handleAtividades(e){
        setAtividades(e.target.value);
        const newActivities = e.target.value.split(',').map(activity => activity.trim());
        setListaAtividades(newActivities.filter(activity => activity !== ''));
    }

    function gravar(){
        const lista = [...listaCanva, {competencia: competencia, atividades: listaAtividades, senioridade: senioridade}]
        setListaCanva(lista);
        const newList = lista.map((item)=>item.atividades);
        setListaTeste(newList);
        console.log(`Este é o newList: ${newList}`)

    }
        
        console.log(listaCanva);
    

    return(<>
        <div class="mb-3">
            <label for="exampleFormControlInput1" class="form-label">Competência</label>
            <input class="form-control" id="exampleFormControlInput1" placeholder="Adicione a competência necessária" onChange={e=>setCompetencia(e.currentTarget.value)}/>
        </div>
        <div class="mb-3">
            <label for="exampleFormControlInput1" class="form-label">Atividades</label>
            <input class="form-control" id="exampleFormControlInput1" placeholder="Adicione as atividades necessárias. Separe as atividades por vírgula. Ex: Atendimento, Agendamento" onChange={handleAtividades}/>
        </div>

        <div class="mb-3">
            <label for="exampleFormControlInput1" class="form-label">Qual é o nível do profissional?</label>
            <select class="form-select" aria-label="Default select example" onChange={e=>setSenioridade(e.currentTarget.value)}>
                <option value="Novato">Novato</option>
                <option value="Novato">Aprendiz</option>
                <option value="Praticante">Praticante</option>
                <option value="Profissional">Profissional</option>
                <option value="Professor">Professor</option>
                <option value="Líder">Líder</option>
                <option value="Mestre">Mestre</option>
            </select>
            </div>

            <button type="button" class="btn btn-primary" onClick={gravar}>Gravar</button>


        <section className="canvaContainer container w-100 mb-3">
            <div className='headerCanva'>Feedback Canva</div>
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
                <div className="customBorder3 col-2 d-flex justify-content-center align-items-center"><div className='post-it d-flex justify-content-center align-items-center'>{listaCanva.map((item, index)=><>{item.competencia}</>)}</div></div>
                <div className="customBorder3 col-3">
                    <div className='box mt-1'>
                    <div className='post-it2 d-flex justify-content-center align-items-center'>Teste</div>
                    </div>
                </div>
                <div className="customBorder3 col d-flex flex-column justify-content-center align-items-center"><div className='mb-3' style={{borderRadius: '100%', width: '45px', height:'45px', backgroundColor: 'red'}}></div><div style={{borderRadius: '100%', width: '45px', height:'45px', backgroundColor: 'red'}}></div></div>
                <div className="customBorder3 col">Teste</div>
                <div className="customBorder3 col">Teste</div>
                <div className="customBorder3 col">Teste</div>
                <div className="customBorder3 col">Teste</div>
                <div className="customBorder3 col">Teste</div>
                <div className="customBorder4 col " >Teste</div>

                <div className="row w-100">
                    
                <div className='customBorder5 pt-3 col-4 d-flex flex-column justify-content-center align-items-center' ><div>
                        <div className='d-flex justify-content-center'><svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-emoji-smile" viewBox="0 0 16 16">
  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
  <path d="M4.285 9.567a.5.5 0 0 1 .683.183A3.498 3.498 0 0 0 8 11.5a3.498 3.498 0 0 0 3.032-1.75.5.5 0 1 1 .866.5A4.498 4.498 0 0 1 8 12.5a4.498 4.498 0 0 1-3.898-2.25.5.5 0 0 1 .183-.683M7 6.5C7 7.328 6.552 8 6 8s-1-.672-1-1.5S5.448 5 6 5s1 .672 1 1.5m4 0c0 .828-.448 1.5-1 1.5s-1-.672-1-1.5S9.448 5 10 5s1 .672 1 1.5"/>
</svg></div>
                        <div>Pontos Fortes</div>
                        </div>
                        <div className='customBorder7'>Teste</div>
                        
                        </div>
                    <div className='customBorder5 pt-3 col-4 d-flex flex-column justify-content-center align-items-center' ><div>
                        <div className='d-flex justify-content-center'><svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-emoji-frown" viewBox="0 0 16 16">
  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
  <path d="M4.285 12.433a.5.5 0 0 0 .683-.183A3.498 3.498 0 0 1 8 10.5c1.295 0 2.426.703 3.032 1.75a.5.5 0 0 0 .866-.5A4.498 4.498 0 0 0 8 9.5a4.5 4.5 0 0 0-3.898 2.25.5.5 0 0 0 .183.683M7 6.5C7 7.328 6.552 8 6 8s-1-.672-1-1.5S5.448 5 6 5s1 .672 1 1.5m4 0c0 .828-.448 1.5-1 1.5s-1-.672-1-1.5S9.448 5 10 5s1 .672 1 1.5"/>
</svg></div>
                        <div>Pontos de atenção</div>
                        </div>
                        <div className='customBorder7'>Teste</div>
                        
                        </div>
                        <div className='customBorder8 pt-3 col-4 d-flex flex-column justify-content-center align-items-center' ><div>
                        <div className='d-flex justify-content-center'><svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-check-circle-fill" viewBox="0 0 16 16">
  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
</svg></div>
                        <div>Ações de melhoria</div>
                        </div>
                        <div className='customBorder7'>Teste</div>
                        
                        </div>
                </div>
             </div>
           
        </section>


        

        
    
    </>)
}