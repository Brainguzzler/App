import React from 'react';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom';
import 'moment/locale/ru';
// import 'moment/locale/en';

import './index.css';
import App from './App';
import store from './store/store'

import Mediator from 'smprc-njsp-mediator'
import Network from 'smprc-njsp-network-manager'
import JSONRPC from 'smprc-njsp-network-manager-jsonrpc'

function startApp(){
  // заглушка для network-manager
  window.user = {
    isLoggedIn: () => false
  };

  //property for timeout that sets in getState request
  //used for make reload service request, if request pending is too long 
  window.requestTimeout = null

  window.mediator = new Mediator();
  window.network = new Network(
    JSONRPC,
    window.config.network,
    (responseJSON) => {
      if (window.user.isLoggedIn && responseJSON && responseJSON.error && responseJSON.error.code === 205) {
        window.user.logoutUser();
      } else {
        return responseJSON;
      }
    },
    (error, errorCB) => {
      if (typeof errorCB === "function") {
        errorCB(error);
      } else {
        throw new Error(error)
      }
    }
  )
  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>, 
    document.getElementById('root')
);
}

window.onload = startApp
