import React from 'react'
import { connect } from 'react-redux'

import { endSession } from './store/actions/app'

import ActionType from './components/ActionType'
import PassType from './components/PassType'
import PayType from './components/PayType'
import ContactsForm from './components/ContactsForm'
import InsertCash from './components/InsertCash'
import Loading from './components/Loading'
import SuccessPayment from './components/SuccessPayment'
import InsertCard from './components/InsertCard'
import TerminalAttention from './components/TerminalAttention'
import AccountNumber from './components/AccountNumber'
import AccountInfo from './components/AccountInfo'
import SuccessFill from './components/SuccessFill'
import SummForm from './components/SummForm'

import AppError from './components/errors/AppError'
import PaymentError from './components/errors/PaymentError'
import EnergyError from './components/errors/EnergyError'
import ShortageError from './components/errors/ShortageError'
import ReceiptFailedError from './components/errors/ReceiptFailedError'
import ReceiptBlockedError from './components/errors/ReceiptBlockedError'
import CardBlockedError from './components/errors/CardBlockedError'
import CardFailedError from './components/errors/CardFailedError'
import FreeRide from './components/errors/FreeRide'
import CashlessPaymentError from './components/errors/CashlessPaymentError'

class Router extends React.Component{

  state = {
    call_sound: false
  }

  componentWillReceiveProps(nextProps){
    if(!nextProps.state.payment.payment_type && this.props.state.payment.payment_type){
      this.props.endSession()
    }
  } 

  getOperation = () => {
    let Component = null

    const payment = this.props.state.payment;
    const notification = this.props.state.notification

    if(notification.length){
      
      // @TODO find a better place for this, but may be it's temporary
      if(notification.indexOf('call_init') !== -1){
        if(!this.state.call_sound){
          this.setState({audio: true},() => window.setTimeout(() => this.setState({call_sound: false}), 1000))
          var audio = new Audio('/audio/ring-ring.mp3');
          audio.play();
        }
      }

      if(notification.indexOf('app_not_work') !== -1){
        Component = AppError
      }else if(notification.indexOf('energy_error') !== -1){
        Component = EnergyError
      }else if(notification.indexOf('crash_payment') !== -1){
        Component = PaymentError
      }else if(notification.indexOf('shortage') !== -1){
        Component = ShortageError
      }else if(notification.indexOf('mean_not_exists') !== -1){
        if(payment.payment_mean.payment_mean_type === 'receipt'){
          Component = ReceiptFailedError
        }else{
          Component = CardFailedError
        }
      }else if(notification.indexOf('cashless_payment_not_passed') !== -1){
        Component = CashlessPaymentError
      }else if(notification.indexOf('mean_blocked' ) !== -1){
        if(payment.payment_mean.payment_mean_type === 'receipt'){
          Component = ReceiptBlockedError
        }else{
          Component = CardBlockedError
        }
      }

      if(Component){
        return <Component />
      }
    }

    // if(!this.props.state.equipmentStarted){
    //   Component = ActionType
    // }else{
    if(payment.payment_status === 'complete'){
      Component = SuccessPayment
    }else if(payment.payment_status === 'in_process'){
      Component = Loading
    }else if(payment.payment_mean && payment.payment_mean.payment_mean_type && payment.amount === 0){
      Component = FreeRide
    }else if(this.props.state.insertReady){
      if( payment.payment_type === 'cash'){
        Component = InsertCash
      }else if( payment.payment_type === 'cashless'){
        Component = InsertCard
      }else{
        Component = InsertCash
      }
    }else if(!payment.payment_mean){
      Component = PassType
    }else if(payment.payment_mean.payment_mean_type){
      Component = PayType
    }
    // } 

    return <Component />
  }

  render(){
    return this.getOperation()
  }
}

const mapStateToProps = (store) => {
  return{
    state: store.app
  }
}

export default connect(mapStateToProps,{
  endSession
})(Router);
