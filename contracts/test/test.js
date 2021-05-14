const FreelanceToken = artifacts.require("FreelanceToken");
const truffleAssert = require('truffle-assertions');


contract("Test", async (accounts) => {

    it("Test totalSupply and transfer method", async () => {
        const freelanceToken = await FreelanceToken.deployed()
        const amountEth1 = web3.utils.toWei("0.02", "ether");
        const amountEth2 = web3.utils.toWei("0.01", "ether");

        const freelanceTokenSupply = await freelanceToken.totalSupply()
        assert.equal(freelanceTokenSupply.toString(), 100000, "wrong totalSupply");

        const balanceOfFreelanceToken = await freelanceToken.balanceOf(freelanceToken.address)
        assert.equal(balanceOfFreelanceToken.toString(), 100000, "incorrect balanceOfFreelanceToken");

        const EthBalanceOfFreelanceToken = await web3.eth.getBalance(freelanceToken.address)
        console.log("EthBalanceOfFreelanceToken: ", EthBalanceOfFreelanceToken)

        await web3.eth.sendTransaction({from:accounts[0], to:freelanceToken.address, value:amountEth1})
        const newEthBalanceOfFreelanceToken1 = await web3.eth.getBalance(freelanceToken.address)
        console.log("newEthBalanceOfFreelanceToken1: ", newEthBalanceOfFreelanceToken1)
        assert.equal(parseInt(newEthBalanceOfFreelanceToken1), parseInt(EthBalanceOfFreelanceToken+amountEth1), "incorrect  Eth balance of FreelanceToken");

        await freelanceToken.sendEther(accounts[0],amountEth2, {from: accounts[0]})
        const newEthBalanceOfFreelanceToken2 = await web3.eth.getBalance(freelanceToken.address)
        console.log("newEthBalanceOfFreelanceToken2: ", newEthBalanceOfFreelanceToken2)
        assert.equal(parseInt(newEthBalanceOfFreelanceToken2), parseInt(newEthBalanceOfFreelanceToken1-amountEth2), "incorrect  Eth balance of FreelanceToken");

        await truffleAssert.reverts(freelanceToken.sendEther(accounts[0],amountEth2, {from: accounts[1]}), "VM Exception while processing transaction: revert");

    })
})