import React from 'react';
import { connect } from 'react-redux'

import { getState } from './store/actions/app'

import Header from './components/header'
import Router from './Router'


class App extends React.Component {

  constructor(){
    super()
    this.startStateUpdateCycle();
  }

  startStateUpdateCycle(){
    window.setInterval(() => this.props.getState(), 500);
  }

  render(){
    return (
      <div className="App">
        <Header/>
        <Router/>
      </div>
    );
  }
  
}

const mapStateToProps = (store) => {
  return{}
}

export default connect(mapStateToProps,{
  getState
})(App);
