import React, { useState, useEffect } from "react";
import Web3 from "web3";
// import Tx from 'ethereumjs-tx';
// import path from 'path';
// import fs from 'fs';
// import solc from 'solc';
// import md5File from 'md5-file';
// import json from "./build/contracts/DiscoveryArtToken.json"
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
  const [tokenName, setTokenName] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");

  if (window.web3) {
    window.web3 = new Web3(window.web3.currentProvider);
    window.ethereum.enable();
  }

  const deployContract = async () => {
    const accounts = await window.web3.eth.getAccounts();
    const account1 = accounts[0];

    const myContract = new window.web3.eth.Contract(abi);

    const newContractInstance = await myContract
      .deploy({
        data: bytecode,
        arguments: [window.web3.utils.asciiToHex(name), window.web3.utils.asciiToHex(symbol)],
      }).send({
        from: account1,
        gas: 4000000,
      })
        console.log(newContractInstance.options.address); // instance with the new contract address
        setSmartContractAddress(newContractInstance.options.address)
  };

  const showNameAndAddress = async () => {
    const myNewContract = new window.web3.eth.Contract(abi, smartContractAddress);
    const newTokenName = await  myNewContract.methods.name().call()
    const newTokenSymbol = await  myNewContract.methods.symbol().call()
    setTokenName(window.web3.utils.hexToAscii(newTokenName))
    setTokenSymbol(window.web3.utils.hexToAscii(newTokenSymbol))
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
        <h4>Please set your token name and symbol :</h4>
        <input type="text" placeholder="Token name" onChange={(e)=>{setName(e.target.value)}}></input>
        <input type="text" placeholder="Token symbol" onChange={(e)=>{setSymbol(e.target.value)}}></input>
        <br></br>
        <button onClick={deployContract}>Deploy your contract</button>
        <h5>smart contract deployed: {smartContractAddress}</h5>
        <button onClick={showNameAndAddress}>Show tokenName and symbol</button>
        <h5>token name: {tokenName}</h5>
        <h5>token symbol: {tokenSymbol}</h5>
        <br></br>
      </header>
    </div>
  );
}

export default App;