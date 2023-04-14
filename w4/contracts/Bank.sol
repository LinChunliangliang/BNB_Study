// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;


contract Bank {

    // 版本控制
    //Storage version 1
    //uint256 public constant VERSION = 1;
    uint256 public constant VERSION = 2;

    // 银行拥有者，只有银行拥有者可以查询所有用户的余额 
    address public owner; // 合约的拥有者

    // 初始化函数控制执行一次
    bool public initialized;

    
    // 用于记录每个地址转账金额
    mapping (address => uint256) public balances;

    //Storage version 2
    // 用户凭证
    struct DepositReceipt {
        uint256 amount;
        uint256 timestamp;
    }

    bool locked;

    mapping(address => DepositReceipt[]) private depositReceipts;


    event Deposit(address indexed account, uint amount);
    event Withdrawal(address indexed account, uint amount);
    event Transfer(address indexed from, address indexed to, uint256 amount);


    modifier initializer() {
        require(!initialized,"Only init once");
        _;
        initialized = true;
    }
    
    // Logic version 1
    // 初始化函数
    function initialize() public initializer {
        owner = msg.sender;
    }

    // 存款
    function deposit() public payable {
        require(msg.value > 0, "Deposit money must be greater than zero");
        balances[msg.sender] += msg.value;
        depositReceipts[msg.sender].push(DepositReceipt(msg.value, block.timestamp));
        emit Deposit(msg.sender, msg.value);
    }

    // 仅限合约拥有者访问函数修饰符
    modifier onlyOwner {
        require(msg.sender == owner, "Only owner can perform this operation");
        _;
    }

    // 只有银行可以查询用户余额
    function getUserBalance(address _address) public onlyOwner view returns (uint256){
        return balances[_address];
    }

    // 用户查询余额函数
    function balance() public view returns (uint256) {
        return balances[msg.sender];
    }

    // Logic version 2
     // 避免重入
    modifier noReentrancy() {
       require(!locked, "No reentrancy");
        locked = true;
        _;
        locked = false;
    }


    // 取款
    function withdraw(uint amount) public noReentrancy {
        require(amount <= balances[msg.sender], "Insufficient balance");
        balances[msg.sender] -= amount;
        payable(msg.sender).transfer(amount);
        emit Withdrawal(msg.sender, amount);
    }

    // 转账 
    function transfer(address recipient, uint amount) public {
        require(recipient != address(0), "Invalid recipient address.");
        require(amount <= balances[msg.sender], "Insufficient balance");
        balances[msg.sender] -= amount;
        balances[recipient] += amount;

        // 转账接收者也有存款凭证
        depositReceipts[recipient].push(DepositReceipt(amount, block.timestamp));

        emit Transfer(msg.sender, recipient, amount);
    }


    // 查询凭证
    function getDepositReceipts(address account) external view returns (DepositReceipt[] memory) {
        return depositReceipts[account];
    }

    // 银行所有者转让
    function transferOwnership(address payable newOwner) public {
        require(newOwner != address(0), "Invalid new owner address.");
        require(msg.sender == owner, "Only the contract owner can transfer ownership.");
        owner = newOwner;
    }

}
