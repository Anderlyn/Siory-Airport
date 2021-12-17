import React from 'react';

class ThanksScreen extends React.Component {
  componentDidMount() {
    document.querySelector('#airplane').classList.remove('airplane_enter');
    document.querySelector('#airplane').classList.add('airplane_exit');
  }
  render() {
    return (
      <div className="section-initial full-container">
        <div className="thanksscreen-box">
          <h1>¡Gracias por usar nuestro sistema!</h1>
          <p class='lighter-text'>Introducción a las TICs (1C2021)</p>
        </div>
      </div>
    );
  }
}

export { ThanksScreen };
