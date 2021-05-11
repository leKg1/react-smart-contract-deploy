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

  if (window.web3) {
    window.web3 = new Web3(window.web3.currentProvider);
    window.ethereum.enable();
    // return true;
  }

// When the data is already set as an option to the contract itself
  // myContract.options.data = '0x12345...';

  const deployContract = async () => {
    const accounts = await window.web3.eth.getAccounts();
    const account1 = accounts[0];

    const myContract = new window.web3.eth.Contract(abi, {gasPrice: 52000000, from: account1});


    myContract.deploy({
      data: bytecode
    })
    .send({
      from: account1,
      gas: 7492052,
      gasPrice: 52000000
    })
    .then(function(newContractInstance){
      console.log(newContractInstance.options.address) // instance with the new contract address
    });
  }
  


  const getMyBalance = async () => {
    const accounts = await window.web3.eth.getAccounts();
    window.web3.eth.getBalance(accounts[0],
      function (err, result) {
        if (err) {
          console.log(err);
        } else {
          setBalance(window.web3.utils.fromWei(result, "ether") + " ETH");
        }
      }
    );
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
      <button onClick={deployContract}>Deploy a contract</button>
      </header>
    </div>
  );
}

export default App;