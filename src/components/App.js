import React, { Component } from 'react'
import Navbar from './Navbar'
import './App.css'
import Web3 from 'web3';
import Tether from '../abis/Tether.json'
import DappToken from '../abis/DappToken.json'
import DigitalBank from '../abis/DigitalBank.json'
import Main from './Main'

class App extends Component {

  async UNSAFE_componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadWeb3() {
    if(window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    } else if(window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    } else {
      window.alert('No ethereum browser detected! You can check out metemask')
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3
    const account = await web3.eth.getAccounts()
    this.setState({account: account[0]})

    const networkId = await web3.eth.net.getId()

    const tetherData = Tether.networks[networkId]
    if(tetherData) {
      const tether = new web3.eth.Contract(Tether.abi, tetherData.address)
      this.setState({tether})

      let tetherBalance = await tether.methods.balanceOf(this.state.account).call()
      this.setState({ tetherBalance: tetherBalance.toString() })
    } else {
      window.alert("Error! Tether contract not deployed")
    }

    const dappTokenData = DappToken.networks[networkId]
    if(dappTokenData) {
      const dappToken = new web3.eth.Contract(DappToken.abi, dappTokenData.address)
      this.setState({dappToken})

      let dappTokenBalance = await dappToken.methods.balanceOf(this.state.account).call()
      this.setState({ dappTokenBalance: dappTokenBalance.toString() })
    } else {
      window.alert("Error! Dapp token contract not deployed")
    }

    const digitalBankData = DigitalBank.networks[networkId]
    if(digitalBankData) {
      const digitalBank = new web3.eth.Contract(DigitalBank.abi, digitalBankData.address)
      this.setState({digitalBank})

      let stakingBalance = await digitalBank.methods.stakingBalance(this.state.account).call()
      this.setState({ stakingBalance: stakingBalance.toString() })
    } else {
      window.alert("Error! Dapp token contract not deployed")
    }

    this.setState({loading: false})
  }

  stakeTokens = (amount) => {
    this.setState({loading: true})

    this.state.tether.methods.approve(this.state.digitalBank._address, amount).send({from: this.state.account}).on('transactionHash', (hash) => {
      this.state.digitalBank.methods.depositTokens(amount).send({from: this.state.account}).on('transactionHash', (hash) => {
        this.setState({loading: false})
      })
    })
  }

  unstakeTokens = () => {
    this.setState({loading: true})

    this.state.digitalBank.methods.unstakeTokens().send({from: this.state.account}).on('transactionHash', (hash) => {
      this.setState({loading: false})
    })
  }


  constructor(props) {
    super(props)
    this.state = {
      account: '0x0',
      tether: {},
      dappToken: {},
      digitalBank: {},
      tetherBalance: '0',
      dappTokenBalance: '0',
      stakingBalance: '0',
      loading: true
    }
  }

  render() {
    console.log(this.state.stakingBalance)
    let content
    {
      content =  this.state.loading ? 
      <p id='loader' className='text-center' style={{margin:'30px'}}>LOADING PLEASE...</p> : 
      <Main
      tetherBalance={this.state.tetherBalance}
      dappTokenBalance={this.state.dappTokenBalance}
      stakingBalance={this.state.stakingBalance}
      stakeTokens={this.stakeTokens}
      unstakeTokens={this.unstakeTokens}
      />}
    return (
      <div>
        <Navbar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '600px', minHeight: '100vm' }}>
              <div className="content mr-auto ml-auto">
                {content}
                <a
                  href="http://www.dappuniversity.com/bootcamp"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                </a>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
