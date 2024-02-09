import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import {useEffect, useState} from 'react';

//As props são enviadas para os componentes App.js, Feedback.js e Canva.js
export default function AlertDialog({
  explicacao = 'Explicação',
  descricao,
  open = false,
  handleClose,
  button = 'Fechar',
  button2,
  handleButton,
  observacao = false,
  onChangeObservacao,
  gravarObservacao,
  renderObservacao,
  titulo='Atenção',
  valueObservacao ,
  openFerias

}) {
  //Componente usado nos componentes Home, Canva, Feedback, Plano de Ação para a geração do 
  //Dialog/Modal/Pop up
  return (
    <div>
      <Dialog
        open={open}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          <div className="d-flex">
            <img src="./img/global_hitss_logo.png" alt="" width="30" />
            <div className="ml-3">{titulo}</div>
          </div>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {descricao}
              
            {observacao && (
              <>
              
                {renderObservacao.length == 0 && (
                  <div className="mb-3" style={{ width: '500px' }}>
                    <label
                      for="exampleFormControlTextarea1"
                      className="form-label"
                    >
                      Adicionar observação
                    </label>
                    <textarea
                      className="form-control"
                      onChange={onChangeObservacao}
                      value={valueObservacao}
                      id="exampleFormControlTextarea1"
                      rows="3"
                    ></textarea>
                    <div>
                      Máximo de tamanho: {500 - valueObservacao.length}{' '}
                      caracteres
                    </div>
                    <button
                      type="button"
                      class="btn btn-primary mt-2"
                      onClick={gravarObservacao}
                    >
                      Gravar observação
                    </button>
                  </div>
                )}
                {renderObservacao.length > 0 && (
                  <>
                    {renderObservacao.map((item, index) => (
                      <div key={index}>{item.observacao}</div>
                    ))}
                  </>
                )}
              </>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} autoFocus>
            {button}
          </Button>
          {button2 && (
            <Button onClick={handleButton} autoFocus>
              {button2}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
}
