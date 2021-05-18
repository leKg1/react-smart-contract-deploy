import React, { useState } from "react";
import Web3 from "web3";
import { abi } from "./abi"
import './App.css';
import { bytecode } from './bytecode';

// const web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:7545"));

const App = () => {
  const [balance, setBalance] = useState(0);
  const [address, setAddress] = useState("");
  const [smartContractAddress, setSmartContractAddress] = useState("");
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [initialSupply, setInitialSupply] = useState(0);
  const [tokenName, setTokenName] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [tokenInitialSupply, setTokenInitialSupply] = useState(0);
  const [amountToMint, setAmountToMint] = useState(0);
  const [etherToSend, setEtherToSend] = useState(0);
  const [etherAddress, setEtherAddress] = useState("");

  if (window.web3) {
    window.web3 = new Web3(window.web3.currentProvider);
    window.ethereum.enable();
  }

  const deployContract = async () => {
    const accounts = await window.web3.eth.getAccounts();
    const account1 = accounts[0];

    const myContract = new window.web3.eth.Contract(abi);

    try {
      const newContractInstance = await myContract
      .deploy({
        data: bytecode,
        arguments: [name, symbol, initialSupply],
      }).send({
        from: account1,
        gas: 4000000,
      })
      alert("successfully deployed!")
      console.log(newContractInstance.options.address); // instance with the new contract address
      setSmartContractAddress(newContractInstance.options.address)
    } catch (error) {
      alert("Error: ", error)
    }
  };

  const showNameAndAddress = async () => {
    const myNewContract = new window.web3.eth.Contract(abi, smartContractAddress);
    const newTokenName = await  myNewContract.methods.name().call()
    const newTokenSymbol = await  myNewContract.methods.symbol().call()
    const newTokenTotalSupply = await  myNewContract.methods.totalSupply().call()
    setTokenName(newTokenName)
    setTokenSymbol(newTokenSymbol)
    setTokenInitialSupply(newTokenTotalSupply)
    
  }

  const mintToken = async () => {
    const accounts = await window.web3.eth.getAccounts();
    const account1 = accounts[0];
    const myNewContract = new window.web3.eth.Contract(abi, smartContractAddress);

    try {
      const mint = await  myNewContract.methods.mintToken(account1,amountToMint).send({
        from: account1,
        gas: 4000000,
      })
      console.log("minted", mint)
      alert("succefully minted!")
    } catch (error) {
      alert("Error: ",error)
    }
  }

  const sendEtherToSmartContract = async () => {
    const accounts = await window.web3.eth.getAccounts();
    const account1 = accounts[0];
    const amountEth = window.web3.utils.toWei(etherToSend, "ether");

    try {
      const send = await window.web3.eth.sendTransaction({from:account1, to:smartContractAddress, value:amountEth})
      alert("succefully sent to smart contract!")
      console.log("sentEthToSmartContract", send)
    } catch (error) {
      alert("Error: ", error)
    }
  }

  const sendEtherFromSmartContract = async () => {
    const accounts = await window.web3.eth.getAccounts();
    const account1 = accounts[0];
    const myNewContract = new window.web3.eth.Contract(abi, smartContractAddress);
    const amountEth = window.web3.utils.toWei(etherToSend, "ether");

    const ethBalanceOfSmartContract1 = await window.web3.eth.getBalance(smartContractAddress)
    console.log("ethBalanceOfSmartContract1: ", ethBalanceOfSmartContract1)

    try {
      const send = await  myNewContract.methods.sendEther(etherAddress,amountEth).send({
        from: account1,
        gas: 4000000,
      })
      alert("succefully sent to address!")
      console.log("sentEthFromSmartContract", send)
    } catch (error) {
      alert("Error: ", error)
    }

    const ethBalanceOfSmartContract2 = await window.web3.eth.getBalance(smartContractAddress)
    console.log("ethBalanceOfSmartContract2: ", ethBalanceOfSmartContract2)
  }

  const getMyBalance = async () => {
    const accounts = await window.web3.eth.getAccounts();
    window.web3.eth.getBalance(accounts[0], function (err, result) {
      if (err) {
        console.log(err);
      } else {
        setBalance(window.web3.utils.fromWei(result, "ether") + " ETH");
      }
    });
  };
  getMyBalance();

  const getAdrresses = async () => {
    const accounts = await window.web3.eth.getAccounts();
    const account1 = accounts[0];
    setAddress(account1);
  };
  getAdrresses();

  return (
    <div className="App">
      <header className="App-header">
        <h4>Account-0: {address}</h4>
        <h3>Balance: {balance}</h3>
        <p>
        <h1>Smart contract deployment</h1>
        <div>
        <h4>Please set your token name, symbol and initialSupply :</h4>
        <input type="text" placeholder="Token name" onChange={(e)=>{setName(e.target.value)}}></input>
        <input type="text" placeholder="Token symbol" onChange={(e)=>{setSymbol(e.target.value)}}></input>
        <input type="text" placeholder="InitialSupply" onChange={(e)=>{setInitialSupply(e.target.value)}}></input>
        <button onClick={deployContract}>Deploy your contract</button>
        </div>
        <h5>smart contract deployed: {smartContractAddress}</h5>
        </p>
        <p>    
        <h1>Show contract details</h1>
        <div>
        <h5>token name: {tokenName}</h5>
        <h5>token symbol: {tokenSymbol}</h5>
        <h5>token totalSupply: {tokenInitialSupply}</h5>
        <button onClick={showNameAndAddress}>Show tokenName, symbol and totalSupply</button>
        </div>
        </p>
        <p>
        <h1>Mint token</h1>
        <div>
        <input type="text" placeholder="token amount" onChange={(e)=>{setAmountToMint(e.target.value)}}></input>
        <button onClick={mintToken}>Mint Token</button>
        </div>
        </p>
        <p>
        <h1>Send ETH to smart contract</h1>
        <div>
        <input type="text" placeholder="amount ETH to send" onChange={(e)=>{setEtherToSend(e.target.value)}}></input>
        <button onClick={sendEtherToSmartContract}>Send ETH</button>
        </div>
        </p>
        <p>
        <h1>Send ETH from smart contract</h1>
        <div>
        <input type="text" placeholder="address" onChange={(e)=>{setEtherAddress(e.target.value)}}></input>
        <input type="text" placeholder="amount ETH to send" onChange={(e)=>{setEtherToSend(e.target.value)}}></input>
        <button onClick={sendEtherFromSmartContract}>Send ETH</button>
        </div>
        </p>
      </header>
    </div>
  );
}

export default App;