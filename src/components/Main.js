import React, { Component } from 'react'
import tether from '../dai.png'

class Main extends Component {

  render() {
    console.log(this.props.stakingBalance)
    return (
      <div id='content' className='mt-3'>
        <table className='table text-muted text-center'>
            <thead>
                <tr style={{color: 'black'}}>
                    <th scope='col'>Stacking Balance</th>
                    <th scope='col'>Reward Balance</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>{window.web3.utils.fromWei(this.props.stakingBalance)} USDT</td>
                    <td>{this.props.dappTokenBalance} DAPP</td>
                </tr>
            </tbody>
        </table>
        <div className='card mb-2' style={{opacity: '.9'}}>
            <form 
            className='mb-3' 
            onSubmit={(event) => {
                event.preventDefault()
                let amount = this.input.value.toString()
                amount = window.web3.utils.toWei(amount, 'Ether')
                this.props.stakeTokens(amount)
            }}>
                <div style={{borderSpacing: '0 1em'}}>
                    <label className='float-left' style={{marginLeft: '15px'}}>
                        <b>Stake Tokens</b>
                    </label>
                    <span className='float-right' style={{marginRight: '9px'}}>Balance: {window.web3.utils.fromWei(this.props.tetherBalance)}</span>
                    <div className='input-group mb-4'>
                        <input type='text' placeholder='0' ref={(input) => {this.input = input}} required/>
                        <div className='input-group-open'>
                            <div className='input-group-text'>
                                <img src={tether} alt='tether' height='32'/>
                                &nbsp;&nbsp;&nbsp; USDT
                            </div>
                        </div>
                    </div>
                    <button type='submit' className='btn btn-primary btn-lg btn-block'>DEPOSIT</button>
                </div>
            </form>
            <button 
            type='submit'
            onClick={(event) => {
                event.preventDefault(
                    this.props.unstakeTokens()
                )
            }}
            className='btn btn-primary btn-lg btn-block'
            >
                WITHDRAW
            </button>
            <div className='card-body text-center' style={{color: 'blue'}}>AIR DROP</div>
        </div>
      </div>
    );
  }
}

export default Main;