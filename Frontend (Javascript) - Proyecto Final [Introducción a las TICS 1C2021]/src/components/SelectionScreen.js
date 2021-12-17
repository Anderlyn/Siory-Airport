import React from 'react';
import { Button } from '@material-ui/core';

class SelectionScreen extends React.Component {
  constructor(props){
    super(props);
  }
  componentDidMount(){
    document.querySelector("#airplane").classList.remove("airplane_exit")
    document.querySelector('#airplane').classList.add('airplane_enter');
  }
  render() {
    return (
      <div className="full-container section-initial">
        <div className="selectionscreen-box">
          <div>
            <h1>Aerolínea Siory</h1>
            <p class="lighter-text">Seleccione su opción</p>
            <br />
            <br />
            <div className="selectionscreen-buy">
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  this.props.changeScreen('buying');
                }}
              >
                Comprar
              </Button>
            </div>
            <br />
            <div className="selectionscreen-exit">
              <Button
                variant="contained"
                color="secondary"
                onClick={() => {
                  this.props.changeScreen('thanks');
                }}
              >
                Salir
              </Button>
            </div>
            <br />
            <br />
            <p className="selectionscreen-credits">Desarrollado por:</p>
            <p className="selectionscreen-credits">
              Gerson Centeno y André López
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export { SelectionScreen };
