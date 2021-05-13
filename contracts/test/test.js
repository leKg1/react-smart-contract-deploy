const FreelanceToken = artifacts.require("FreelanceToken");


contract("Test", async (accounts) => {

    it("Test totalSupply and transfer method", async () => {
        const freelanceToken = await FreelanceToken.deployed()
        const amountETH = web3.utils.toWei("0.02", "ether");

        const freelanceTokenSupply = await freelanceToken.totalSupply()
        assert.equal(freelanceTokenSupply.toString(), 100000, "wrong totalSupply");

        const balanceOfFreelanceToken = await freelanceToken.balanceOf(freelanceToken.address)
        assert.equal(balanceOfFreelanceToken.toString(), 100000, "incorrect balanceOfFreelanceToken");

        const EthBalanceOfFreelanceToken = await web3.eth.getBalance(freelanceToken.address)
        console.log("EthBalanceOfFreelanceToken: ", EthBalanceOfFreelanceToken)

        await web3.eth.sendTransaction({from:accounts[0], to:freelanceToken.address, value:amountETH})

        const newEthBalanceOfFreelanceToken = await web3.eth.getBalance(freelanceToken.address)
        console.log("newEthBalanceOfFreelanceToken: ", newEthBalanceOfFreelanceToken)

        assert.equal(parseInt(newEthBalanceOfFreelanceToken), parseInt(EthBalanceOfFreelanceToken+amountETH), "incorrect  Eth balance of FreelanceToken");

        //await web3.eth.sendTransaction({from:freelanceToken.address, to:accounts[0], value:web3.utils.toWei("0,1", "ether")})

    })
})