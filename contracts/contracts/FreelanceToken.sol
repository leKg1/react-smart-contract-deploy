// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <0.9.0;
import "../node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract FreelanceToken is ERC20 {
    address owner;
    constructor(string memory name,string memory symbol,uint256 initialSupply) public ERC20(name, symbol) {
        owner = msg.sender;
        _mint(address(this),initialSupply);
    }

    modifier onlyowner {
        require(owner == msg.sender);
        _;
    }

    function mintToken (address account,uint256 initialSupply) public onlyowner {
        _mint(account, initialSupply);
    }

    function transferToken (address sender,address recipient,uint256 amount) public onlyowner {
        _transfer(sender, recipient, amount);
    }

    function sendEther(address payable recipient, uint256 amount) external onlyowner {
        recipient.transfer(amount);
    }

    receive() payable external {}
}
