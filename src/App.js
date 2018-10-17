import React, { Component } from 'react';

import Header from './components/Header'
import Content from './components/Content';

import './reset.css';
import './App.css';

class App extends Component {
  render() {
    return [
      <Header title="My Github Favorites" key="header"/>,
      <Content key="content"/>
    ];

  }
}

export default App;
