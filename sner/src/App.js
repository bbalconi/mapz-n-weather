import React, { Component } from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import { Provider } from "mobx-react";
import Home from './Component/Home';
import SnowStore from './Stores/SnowStore';

class App extends Component {
  render() {
    return (
      <Provider snowStore={new SnowStore()}>
        <Router>
          <div>
              <div stlye={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>
                <div style={{margin: '0 auto', padding: '0 1em', flex: 1}}>
                <Route exact path='/' render={() => <Home />} />
                </div>
              </div>
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;