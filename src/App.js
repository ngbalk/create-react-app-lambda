import React, { Component, useState } from "react"

import logo from "./logo.svg"
import "./App.css"
import { ChainId, DAppProvider, useEtherBalance, useEthers, useContractFunction } from '@usedapp/core'
import { utils } from 'ethers'
import { Contract } from '@ethersproject/contracts'

function NameForm() {

  const abi =
  [
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "profile",
          "type": "string"
        }
      ],
      "name": "getOwnerOfProfile",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "internalType": "string",
          "name": "profileType",
          "type": "string"
        }
      ],
      "name": "getProfileByAddress",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "profileType",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "profile",
          "type": "string"
        }
      ],
      "name": "storeProfile",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ]

  const wethInterface = new utils.Interface(abi)
  const wethContractAddress = '0xcef452e51D9454913BD9aC1B65087B3c9986584a'
  const contract = new Contract(wethContractAddress, wethInterface)
  const { state, send } = useContractFunction(contract, 'storeProfile', { transactionName: 'storeProfile' })
  const storeProfile = (profile) => {
    send("instagram", profile)
  }

  const [text, setText] = useState(0);

  const handleSubmit = () => {
    storeProfile(text)
  }



  return (
    <div>
    <input type="text"  onChange={e => setText(e.target.value)} />
    <button onClick={() => handleSubmit()}>Submit</button>
    </div>
  );
}

class LambdaDemo extends Component {
  constructor(props) {
    super(props)
    this.state = { loading: false, msg: null }
  }

  handleClick = api => e => {
    e.preventDefault()

    this.setState({ loading: true })
    fetch("/.netlify/functions/" + api)
    .then(response => response.json())
    .then(json => this.setState({ loading: false, msg: json.msg }))
  }

  render() {
    const { loading, msg } = this.state

    return (
      <p>
      <button onClick={this.handleClick("hello")}>{loading ? "Loading..." : "Call Lambda"}</button>
      <button onClick={this.handleClick("async-dadjoke")}>{loading ? "Loading..." : "Call Async Lambda"}</button>
      <br />
      <span>{msg}</span>
      </p>
    )
  }
}

function ConnectProvider() {

  const { activateBrowserWallet, account } = useEthers()

  return (
    <div>
    <div>
    <button onClick={() => activateBrowserWallet()}>Connect</button>
    </div>
    {account && <p>Account: {account}</p>}
    </div>

  )

}

class App extends Component {
  render() {
    return (
      <div className="App">
      <header className="App-header">
      <img src={logo} className="App-logo" alt="logo" />
      <p>
      Edit <code>src/App.js</code> and save to reload.
      </p>
      <LambdaDemo />
      <DAppProvider config={{}}>
      <ConnectProvider />
      <NameForm />
      </DAppProvider>
      </header>
      </div>
    )
  }
}

export default App
