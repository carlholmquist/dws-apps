import React, { Component } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import RunPage from './pages/runformpage/runpage.component';
class App extends Component {
  render () {
    return (
      <div className="App">
      <RunPage/>
    </div>
    )
  }
}

export default App;
