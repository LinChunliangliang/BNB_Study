import { task, types } from "hardhat/config";
import { readAddressList } from "../scripts/helper";
import { Bank__factory } from "../typechain-types";

// 常量
task("getVersion")
.setAction(async (taskArgs, hre) => {

    const {network} = hre;
    const [dev,secound,three] = await hre.ethers.getSigners();
    const addressList = readAddressList();
     const bank = new Bank__factory(dev).attach(
         addressList[network.name].Bank
    );
    const version  = await bank.VERSION();
    const owner = await bank.owner();

    console.log("Bank Version Is: ",version.toString());

    console.log("Owner Is: ",owner.toString());
})

// 存款
task('desposit')
.addParam('addressindex','', 0, types.int)
.addParam('depositamount','', undefined, types.string)
.setAction(async (taskArgs, hre) => {

    const {addressindex,depositamount} = taskArgs;

    const {network} = hre;
    const addressArr = await hre.ethers.getSigners();

    console.log(addressArr[addressindex].address)

    const addressList = readAddressList();

    const myContract = new Bank__factory(addressArr[addressindex]).attach(
        addressList[network.name].Bank
    );

    const depositTx = await myContract.deposit({ value: depositamount, from: addressArr[addressindex].address });

    // 打印交易哈希值
    console.log(`Deposit transaction hash: ${depositTx.hash}`);
});

// 银行获取用户余额(传入第几号地址)
task('getUserBalance')
.addParam('addressindex','', 0, types.int)
.setAction(async (taskArgs, hre) => {
    const {addressindex} = taskArgs;
    const {network} = hre;
    const addressArr = await hre.ethers.getSigners();

    // 如果合约拥有者变了，这里需要修改
    const ower = addressArr[1];

    const addressList = readAddressList();

    const myContract = new Bank__factory(ower).attach(
        addressList[network.name].Bank
    );
    
    // 需要查询余额的地址
    const address = addressArr[addressindex].address;

    const balance = await myContract.getUserBalance(address);

    console.log(`Address: ${address} Balance is: ${balance}`);
});

// 用户查询余额
task('balance')
.addParam('addressindex','', 0, types.int)
.setAction(async (taskArgs, hre) => {
    const {addressindex} = taskArgs;
    const {network} = hre;
    // const [dev,secound] = await hre.ethers.getSigners();
    const addressArr = await hre.ethers.getSigners();

    const addressList = readAddressList();

    const myContract = new Bank__factory(addressArr[addressindex]).attach(
        addressList[network.name].Bank
    );

    const balance = await myContract.balance();

    console.log(`Address: ${addressArr[addressindex].address} Balance is: ${balance}`);
});


// version 2 task
task('withdraw')
.addParam('addressindex','', 0, types.int)
.addParam('withdrawamount','', undefined, types.int)
.setAction(async (taskArgs, hre) => {
    const {addressindex,withdrawamount} = taskArgs;
    
    const {network} = hre;
   // const [dev,secound] = await hre.ethers.getSigners();
    const addressArr = await hre.ethers.getSigners();


    const addressList = readAddressList();

    const myContract = new Bank__factory(addressArr[addressindex]).attach(
        addressList[network.name].Bank
    );

    const withdrawTx = await myContract.withdraw(withdrawamount);

    // 打印交易哈希值
    console.log(`withdraw transaction hash: ${withdrawTx.hash}`);
});

task('transfer')
.addParam('addressindex','', 0, types.int)
.addParam('transferamount','', undefined, types.string)
.addParam('recipientindex','', 0, types.int)
.setAction(async (taskArgs, hre) => {

    const {addressindex, transferamount, recipientindex} = taskArgs;

    const addressArr = await hre.ethers.getSigners();

    const {network} = hre;

    const addressList = readAddressList();

    const myContract = new Bank__factory(addressArr[addressindex]).attach(
        addressList[network.name].Bank
    );

    const recipientAddress = addressArr[recipientindex].address;

    const balanceBeforeFrom = await myContract.balance();

    const transferTx = await myContract.transfer(recipientAddress,transferamount);

    const balanceAfterFrom = await myContract.balance();

    // 打印交易哈希值
    console.log(`transfer transaction hash: ${transferTx.hash}`);

    console.log(`${addressArr[addressindex].address} balance before: ${balanceBeforeFrom.toString()}`);
    console.log(`${addressArr[addressindex].address} balance after: ${balanceAfterFrom.toString()}`);

});

task('getDepositReceipts')
.addParam('addressindex','', 0, types.int)
.setAction(async (taskArgs, hre)=>{
    const {addressindex} = taskArgs;

    const {network} = hre;
    const addressArr = await hre.ethers.getSigners();

    const addressList = readAddressList();

    const myContract = new Bank__factory(addressArr[addressindex]).attach(
        addressList[network.name].Bank
    );

    const address = addressArr[addressindex].address;

    const depositReceipts = await myContract.getDepositReceipts(address);

    console.log(`Address: ${address} depositReceipts is: ${depositReceipts}`);
});

task('transferOwnership')
.addParam('owenindex','', 0, types.int)
.addParam('addressindex','', 0, types.int)
.setAction(async (taskArgs, hre)=>{
    const {owenindex,addressindex} = taskArgs;

    const {network} = hre;
    const addressArr = await hre.ethers.getSigners();

    const addressList = readAddressList();

    const myContract = new Bank__factory(addressArr[owenindex]).attach(
        addressList[network.name].Bank
    );

    const owner = await myContract.owner();
    console.log("Owner Is: ",owner.toString());

    const address = addressArr[addressindex].address;

    await myContract.transferOwnership(address);

    const newOwner = await myContract.owner();
    console.log("newOwner Is: ",newOwner.toString());
});


task("Eth-balance")
  .setAction(async (_, hre) => {
    const {network} = hre;
    const [dev] = await hre.ethers.getSigners();
    const balance = await hre.ethers.provider.getBalance(dev.address);

    console.log(hre.ethers.utils.formatEther(balance), "ETH");
  });

