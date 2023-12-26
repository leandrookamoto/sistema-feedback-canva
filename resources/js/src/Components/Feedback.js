import Card  from './Components/Card';


export default function Feedback(){
    return(<>
        <h5>Escolha o funcionário</h5>
        {/* Aqui é a renderização da lista de funcionários */}
        {listaCadastro.map((funcionario, index) => (
                  <div key={index}>
                    <Card
                      nome={funcionario.nome}
                      email={funcionario.email}
                      setor={funcionario.setor}
                      chefe={funcionario.administrador}
                    />
                    </div>
                  ))}
    </>)
}