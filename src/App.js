import simpleData from './api/data';
import Chart from './components/Chart';
import React, { Component } from 'react';
import './App.css';

class App extends Component {
  render() {
    const size = [500, 500];
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">WEIGHTLIFTING LEVELS</h1>
        </header>
        <Chart data={simpleData} size={size}/>
      </div>
    );
  }
}

export default App;
