import React from 'react';
import { Button } from '@material-ui/core';
import Axios from 'axios';
let baseUrl = 'http://127.0.0.1:5000/';

class ReceiptScreen extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      cantidad_eje: 0,
      cantidad_eco: 0,
      total_eje: 0,
      total_eco: 0,
      total: 0,
      id: 0,
      promedio_eje: 0,
      promedio_eco: 0
    }
  }
  componentDidMount(){
    document.querySelector('#airplane').classList.remove('airplane_enter');
    document.querySelector('#airplane').classList.add('airplane_exit');
    Axios.get(baseUrl+'api/comprar').then(res=>{
      console.log(res);
      this.setState({
        cantidad_eje: res.data.ejecutivos,
        cantidad_eco: res.data.economicos,
        total_eje: res.data.total_ejecutivo,
        total_eco: res.data.total_economico,
        total: res.data.total,
        id: res.data.id,
        promedio_eje: res.data.total_ejecutivo,
        promedio_eco: res.data.total_economico,
      });
    })
  }
  render() {
    return (
      <div className="full-container section-initial">
        <div className="receiptscreen-box">
          <div>
            <h1>¡Compra #{this.state.id} Finalizada!</h1>
            <br />
            <p className="lighter-text">
              {this.state.cantidad_eco}x - Boleto(s) Ecómico(s) -{' '}
              {this.state.total_eco}$ (Promedio: {this.state.total_eco})
            </p>
            <p className="lighter-text">
              {this.state.cantidad_eje}x - Boleto(s) Ejecutivo(s) -{' '}
              {this.state.total_eje}$ (Promedio: {this.state.total_eje})
            </p>
            <br />
            <h1 className="receiptscreen-total">Total: {this.state.total}$</h1>
            <br />
            <br />
            <span className="receiptscreen-buy">
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  this.props.changeScreen('buying');
                }}
              >
                Comprar
              </Button>
            </span>
            <span className="receiptscreen-exit">
              <Button
                variant="contained"
                color="secondary"
                onClick={() => {
                  this.props.changeScreen('thanks');
                }}
              >
                Salir
              </Button>
            </span>
          </div>
        </div>
      </div>
    );
  }
}

export { ReceiptScreen };
