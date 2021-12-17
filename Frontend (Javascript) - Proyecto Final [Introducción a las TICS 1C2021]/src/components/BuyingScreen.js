import React from 'react';
import { Button } from '@material-ui/core';
import Axios from 'axios';
let baseUrl = 'http://127.0.0.1:5000/';

function Ticket(props){
  return (
    <div className='ticket'>
      <h1>Asiento {props.number}</h1>
      <p className='lighter-text'>Tiquete {props.type}</p>
    </div>
  )
}

function Seat(props){
  let color = 'seat seat-state-'+props.usage+" "
  let animation = props.usage == "selected" ? "animated_seat" : ""; 
  return (
    <div className={color+animation}>
      <h1> {props.number}</h1>
    </div>
  );
}

class BuyingScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      eco_seats: [{state: "free"},{state: "free"},{state: "free"},{state: "free"},{state: "free"},{state: "free"},{state: "free"},{state: "free"},{state: "free"},{state: "free"},{state: "free"},{state: "free"},{state: "free"},{state: "free"},{state: "free"},{state: "free"},{state: "free"},{state: "free"},{state: "free"},{state: "free"}],
      eje_seats: [{state: "free"},{state: "free"},{state: "free"},{state: "free"},{state: "free"},{state: "free"},{state: "free"},{state: "free"},{state: "free"},{state: "free"}],
      hour: "-",
      buy_amount: 0,
      tickets: [],
      total: 0
    }
  }
  selectSeat(type){
    Axios.post(baseUrl+'api/seleccionar',{"tipo":type}).then(res=>{
      console.log(res);
      let eco_s = []
      let eje_s = []
      for (let x in res.data.espacios_eco){
        eco_s.push({
          state: res.data.espacios_eco[String(x)],
        });
      }
      for (let x in res.data.espacios_eje){
        eje_s.push({
          state: res.data.espacios_eje[String(x)],
        });
      }
      if(res.data.estado == "fallido"){
        alert("¡Ya están ocupados todos los asientos de esa clase!");
        return;
      }
      let tickets = [];
      res.data.asientos.ejecutivos.forEach(x=>{
        tickets.push({number: x, type: "ejecutivo"})
      })
      res.data.asientos.economicos.forEach(x=>{
        tickets.push({number: x, type: "económico"})
      })
      this.setState({
        eco_seats: eco_s,
        eje_seats: eje_s,
        buy_amount: this.state.buy_amount + 1,
        total: res.data.recibo.total,
        tickets: tickets
      });
    });
  }
  exit(){
    Axios.get(baseUrl+'api/salir').then(res=>{
      this.props.changeScreen('selection');
    })
  }
  componentDidMount(){
    document.querySelector('#airplane').classList.remove('airplane_exit');
    document.querySelector('#airplane').classList.add('airplane_enter');
    Axios.get(baseUrl+'api/hora').then( res =>{
      this.setState({hour: res.data})
    }); 
    Axios.get(baseUrl+'api/salir').then(res=>{
      Axios.get(baseUrl + 'api/asientos').then((res) => {
        let eco_s = [];
        let eje_s = [];
        for (let x in res.data.espacios_eco) {
          eco_s.push({
            state: res.data.espacios_eco[String(x)],
          });
        }
        for (let x in res.data.espacios_eje) {
          eje_s.push({
            state: res.data.espacios_eje[String(x)],
          });
        }
        this.setState({ eco_seats: eco_s, eje_seats: eje_s });
      });
    })
  }
  render() {
    return (
      <div className="full-container buyingscreen-grid">
        <div className="buyingscreen-tickets-g">
          <div className="buyingscreen-tickets">
            <h1 className="buyingscreen-tickets-title ">Tiquetes</h1>
            <p className="lighter-text">Generados aleatoriamente</p>
            <br />
            <h1 className="buyingscreen-tickets-price">
              Precio: {this.state.total}$
            </h1>
            {this.state.tickets.map((ticket, i) => {
              return <Ticket {...ticket} />;
            })}
          </div>
        </div>
        <div className="buyingscreen-seats-g">
          <div className="buyingscreen-seats">
            <h1>Asientos Disponibles</h1>
            <p>{this.state.hour}</p>
            <div className="buyingscreen-seats-box">
              <div className="buyingscreen-seats-section lighter-text">
                <p>Asientos Ejecutivos</p>
              </div>
              <div className="buyingscreen-seats-section lighter-text">
                <p>Asientos Económicos</p>
              </div>
              <div className="buyingscreen-seats-eje">
                <div className="buyingscreen-seats-eje-box">
                  {this.state.eje_seats.map((seat, i) => {
                    return <Seat number={i} usage={seat.state} />;
                  })}
                </div>
                <div>
                  <Button
                    onClick={() => {
                      this.selectSeat('ejecutivo');
                    }}
                    variant="contained"
                  >
                    Adquirir
                  </Button>
                </div>
              </div>
              <div className="buyingscreen-seats-eco">
                <div className="buyingscreen-seats-eco-box">
                  {this.state.eco_seats.map((seat, i) => {
                    return <Seat number={i} usage={seat.state} />;
                  })}
                </div>
                <div>
                  <Button
                    onClick={() => {
                      this.selectSeat('economico');
                    }}
                    variant="contained"
                  >
                    Adquirir
                  </Button>
                </div>
              </div>
            </div>
            <span className="buyingscreen-seats-finish">
              <Button
                variant="contained"
                onClick={() => {
                  if (this.state.buy_amount != 0) {
                    this.props.changeScreen('receipt');
                  } else {
                    alert('Necesitas realizar una compra.');
                  }
                }}
              >
                Terminar
              </Button>
            </span>
            <span className="buyingscreen-seats-cancel">
              <Button
                variant="contained"
                onClick={() => {
                  this.exit();
                }}
              >
                Cancelar
              </Button>
            </span>
          </div>
        </div>
      </div>
    );
  }
}

export { BuyingScreen };
