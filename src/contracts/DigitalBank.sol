// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.5.0 <0.9.0;

import './Tether.sol';
import './DappToken.sol';

contract DigitalBank {
    address public owner;
    string public name = "Digital Bank";

    Tether public tether;
    DappToken public dappToken;

    address[] public stakers;

    mapping(address => uint) public stakingBalance;
    mapping(address => bool) public hasStaked;
    mapping(address => bool) public isStaking;

    mapping(address => uint) public rewards;

    constructor(DappToken _dappToken, Tether _tether ) public {
        owner = msg.sender;
        tether = _tether;
        dappToken = _dappToken;
    }

    function depositTokens(uint amount) public {
        require(amount > 0, 'Amount must be greater than 0');
        require(tether.balanceOf(msg.sender) >= amount);

        if(tether.transferFrom(msg.sender, address(this), amount)) {

            stakingBalance[msg.sender] = stakingBalance[msg.sender] + amount;

            if(!hasStaked[msg.sender]) {
                stakers.push(msg.sender);
            }

            hasStaked[msg.sender] = true;
            isStaking[msg.sender] = true;
        }
    }

    function issueTokens() public {
        require(owner == msg.sender);
        for (uint i = 0; i < stakers.length; i++) {
            address recipient = stakers[i];
            uint balance = stakingBalance[recipient] - rewards[recipient];
            if (balance > 0) {
                dappToken.transfer(recipient, balance);
                rewards[recipient] = balance + rewards[recipient];
            }
        }
    }

    function unstakeTokens() public {
        uint balance = stakingBalance[msg.sender];
        require(balance > 0, 'Staking balance must be greater than 0');

        tether.transfer(msg.sender, balance);

        stakingBalance[msg.sender] = 0;

        if(!hasStaked[msg.sender]) {
            stakers.push(msg.sender);
        }

        isStaking[msg.sender] = false;
    }
}