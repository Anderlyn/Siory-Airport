import React from 'react';
import ReactDOM from 'react-dom';

import {SelectionScreen} from './components/SelectionScreen';
import {ThanksScreen} from './components/ThanksScreen';
import {BuyingScreen} from './components/BuyingScreen';
import {ReceiptScreen} from './components/ReceiptScreen'

import './app.scss';


class App extends React.Component {
  constructor(props){
    super(props);
    this.changeScreen = this.changeScreen.bind(this);
    this.state= {
      screen: "selection"
    }
  }
  changeScreen(screen){
    this.setState({
      screen: screen
    })
  }
  selectScreen(screen){
    switch(screen){
      case "selection":
        return <SelectionScreen changeScreen={this.changeScreen}/>;
      break;
      case "thanks":
        return <ThanksScreen changeScreen={this.changeScreen}/>;
      break;
      case "buying":
        return <BuyingScreen changeScreen={this.changeScreen}/>
      case "receipt":
        return <ReceiptScreen changeScreen={this.changeScreen}/>
    }
  }
  render() {
    return (
      <div>
        {
          this.selectScreen(this.state.screen)
        }
      </div>
    );
  }
}

ReactDOM.render(<App />, document.querySelector('#app'));
