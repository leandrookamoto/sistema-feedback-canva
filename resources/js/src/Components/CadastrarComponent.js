//Componente auxiliar de cadastro de funcionário que é controlado pelo App.js
export default function CadastrarComponent({
  nome,
  handleChangeName,
  handleChangeEmail,
  email,
  isValid,
  handleChangeSetor,
  setor,
  gravar,
}) {
  return (
    <>
      <h5>Cadastro de funcionários</h5>

      <div className="mb-1 mt-6">
        <label htmlFor="exampleFormControlInput1" className="form-label">
          Nome
        </label>
        <input
          className="form-control"
          id="exampleFormControlInput1"
          placeholder="Colocar o nome do funcionário"
          value={nome}
          onChange={handleChangeName}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="exampleFormControlInput1" className="form-label">
          E-mail
        </label>
        <input
          className={`form-control ${!isValid ? 'border border-danger' : ''}`}
          type="email"
          onChange={handleChangeEmail}
          value={email}
          id="exampleFormControlInput1"
          placeholder="Colocar o e-mail de contato"
        />
      </div>

      {!isValid && (
        <p style={{ color: 'red', marginTop: '-15px', fontSize: '15px' }}>
          Por favor, insira um e-mail válido.
        </p>
      )}

      <div className="mb-3">
        <label htmlFor="exampleFormControlInput1" className="form-label">
          Setor
        </label>
        <select
          className="form-select"
          aria-label="Default select example"
          onChange={handleChangeSetor}
          value={setor}
        >
          <option selected>Escolha a opção</option>
          <option value="Setor A">Setor A</option>
          <option value="Setor B">Setor B</option>
        </select>
      </div>

      <button type="button" className="btn btn-primary" onClick={gravar}>
        Gravar
      </button>
    </>
  );
}
