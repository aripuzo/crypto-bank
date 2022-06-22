// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.5.0 <0.9.0;

interface ERC20Interface {
    function totalSupply() external view returns(uint256);
    function balanceOf(address tokenOwner) external view returns(uint256 balance);
    function transfer(address to, uint tokens) external returns(bool success);

    function allowance(address tokenOwner, address spender) external view returns(uint remaining);
    function approve(address spender, uint tokens) external returns (bool success);
    function transferFrom(address from, address to, uint256 tokens) external returns (bool success);

    event Transfer(address indexed from, address indexed to, uint tokens);
    event Approval(address indexed tokenOwner, address indexed spender, uint tokens);
}

contract Tether is ERC20Interface {
    string public name = 'Mock Tether';
    string public symbol = 'mUSDT';
    uint256 public decimals = 18;
    uint256 public totalSupply = 1000000000000000000000000;//1000000000000000000;

    address public founder;
    mapping(address => uint256) balances;

    mapping(address => mapping(address => uint256)) allowed;

    constructor() public {
        founder= msg.sender;
        balances[founder] = totalSupply;
    }

    function balanceOf(address tokenOwner) public view returns(uint256 balance) {
        return balances[tokenOwner];
    }

    function transfer(address to, uint256 tokens) public returns(bool success)  {
        require(balances[msg.sender] >= tokens);

        balances[to] += tokens;
        balances[msg.sender] -= tokens;

        emit Transfer(msg.sender, to, tokens);

        return true;
    }

    function transferFrom(address from, address to, uint256 tokens) public returns (bool success) {
        require(allowed[from][msg.sender] >= tokens);
        require(balances[from] >= tokens);
        balances[from] -= tokens;
        allowed[from][msg.sender] -= tokens;
        balances[to] += tokens;

        emit Transfer(from, to, tokens);
        return true;
    }

    function allowance(address tokenOwner, address spender) public view returns(uint256 remaining) {
        return allowed[tokenOwner][spender];
    }

    function approve(address spender, uint256 tokens) public returns (bool success) {
        require(balances[msg.sender] >= tokens);
        require(tokens > 0);

        allowed[msg.sender][spender] = tokens;
        
        emit Approval(msg.sender, spender, tokens);

        return true;
    }

    function mint(uint256 value) public returns(bool) {
        require(msg.sender == founder);
        totalSupply += value;
        balances[founder] += value;
        return true;
    }

    function burn(uint256 value) public returns(bool) {
        require(msg.sender == founder);
        totalSupply -= value;
        balances[founder] -= value;
        return true;
    }

}