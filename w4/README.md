##合约要求
**使用Hardhat在BNB Testnet部署一套可升级的代理合约，至少包含常量，状态变量和读写状态变量的函数**

- 合约在浏览器完成验证（可以调用到逻辑合约函数）
- 合约进行初始化设置
- 合约完成一次升级（升级常量值和函数逻辑）并正常运行
- 使用脚本或任务完成和合约常见的交互

##合约设计
**实现一个银行的智能合约**

- Version 1.0
    - 银行角度：
        1. 实现存款
        2. 可以查看所有用户的余额
    - 用户角度
        1. 可以实现存款功能
        2. 可以查看自身的余额
- Version 2.0  （同时取款加入重入控制）
     - 银行角度：
        1. 可以实现转让银行所有权
        2. 用户存款产生凭证
    - 用户角度
        1. 可实现用户取款
        2. 可以实现转账到其他账户
        3. 查看自己的存款凭证信息

**执行命令**
***部署代理合约***
`npx hardhat deploy --network bnbtest --tags ProxyAdmin`
***部署银行合约***
(需要升级Bank合约只需在原有的合约里进行代码修改，修改完后再吃部署就可实现升级)
`npx hardhat deploy --network bnbtest --tags Bank`

**task相关命令**
***获取版本号***
`npx hardhat getVersion --network bnbtest`
***存款***
- 参数
    - network：网络
    - addressindex：存款地址下标
    - depositamount：存款数量
`npx hardhat desposit --network bnbtest --addressindex 0 --depositamount 1500 `
***银行查询用户余额***
- 参数
    - network：网络
    - addressindex：查询余额地址下标
`npx hardhat getUserBalance --network bnbtest --addressindex 0`
***用户查询自身余额***
- 参数
    - network：网络
    - addressindex：查询余额地址下标
`npx hardhat balance --network bnbtest --addressindex 0`
***用户取款***
- 参数
    - network：网络
    - addressindex：取款地址下标
    - withdrawamount：取款金额
`npx hardhat withdraw --network bnbtest --addressindex 0 --withdrawamount 100`
***用户转账***
- 参数
    - network：网络
    - addressindex：转账地址下标
    - transferamount：转账金额
    - recipientindex：接收地址下标
`npx hardhat transfer --network bnbtest --addressindex 0 --transferamount 100 --recipientindex 1`
***查询存款凭证***
- 参数
    - network：网络
    - addressindex：查询地址下标
`npx hardhat getDepositReceipts --network bnbtest --addressindex 0`
***银行所有权转让***
- 参数
    - owenindex：所有者地址下标
    - addressindex：转让接受者下标
`npx hardhat transferOwnership --network bnbtest --owenindex 1 --addressindex 0`




