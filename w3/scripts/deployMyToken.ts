import { ethers } from "hardhat";

async function main() {
    const MyToken = await ethers.getContractFactory('MyToken');
    const myToken = await MyToken.deploy();

    await myToken.deployed();

    console.log(
        `Deployed MyToken to ${myToken.address} with ${myToken.deployTransaction.hash}`
    );
}

main().catch((error) =>{
    console.error(error);
    process.exitCode = 1;
});