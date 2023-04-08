import { ethers } from "hardhat";
import { expect } from "chai";

import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

describe("MyToken Test", function () {
    const INITIAL_SUPPLY = 100;
    const MINT_AMOUNT = 10;

    async function deployMyTokenFixture() {
        const [dev, alice] = await ethers.getSigners();

        const MyToken = await ethers.getContractFactory("MyToken");

        const myToken = await MyToken.deploy();

        return {dev, alice, myToken};
    }

    async function mintAliceFixture() {
        const {dev, alice, myToken} = await loadFixture(deployMyTokenFixture);
        await myToken.connect(alice).mint();

        return {dev, alice, myToken};
    }

    describe("Deployment",function(){
        it("名字和标识是否一致",async function(){
            const {myToken} = await loadFixture(deployMyTokenFixture);
            expect(await myToken.name()).to.equal("XMMToken");
            expect(await myToken.symbol()).to.equal("XMM");
        });

        it("合约所属者是否是部署合约", async function () {
            const { myToken, dev } = await loadFixture(deployMyTokenFixture);
      
            expect(await myToken.owner()).to.equal(dev.address);
          });
      
          it("部署地址的代币总数是否等于总提供", async function () {
            const { myToken, dev } = await loadFixture(deployMyTokenFixture);
      
            expect(await myToken.balanceOf(dev.address)).to.equal(INITIAL_SUPPLY);
          });
    });

    describe("Mint & Burn", function(){
        it("should be able to mint a token",async function() {
            const {dev, alice, myToken} = await loadFixture(deployMyTokenFixture);
            await expect(myToken.connect(alice).mint())
            .to.emit(myToken,"Mint")
            .withArgs(alice.address,MINT_AMOUNT)
            .to.emit(myToken,'Transfer')
            .withArgs(ethers.constants.AddressZero,alice.address,MINT_AMOUNT);

            expect(await myToken.alreadyMinted(alice.address)).to.equal(true);
            expect(await myToken.balanceOf(alice.address)).to.equal(MINT_AMOUNT);
            expect(await myToken.totalSupply()).to.equal(INITIAL_SUPPLY+MINT_AMOUNT)
        });

        it("should not be able to mint a token twice",async function () {
            const {dev, alice, myToken} = await loadFixture(deployMyTokenFixture);
            await myToken.connect(alice).mint();
            await expect(myToken.connect(alice).mint()).to.be.rejectedWith("Already minted");
        });

        it("should be able to burn a token buy the owner", async function () {
            const {dev, alice, myToken} = await loadFixture(deployMyTokenFixture);
            await myToken.connect(alice).mint();

            await expect(myToken.burn(alice.address)).to.emit(myToken,'Burn').withArgs(alice.address,10);

            expect(await myToken.balanceOf(alice.address)).to.equal(0);
            expect(await myToken.alreadyMinted(alice.address)).to.equal(false);
        });

        it("should not be able to burn a token by a non-owner", async function () {
            const { myToken, alice } = await loadFixture(deployMyTokenFixture);
      
            await myToken.connect(alice).mint();
            await expect(
              myToken.connect(alice).burn(alice.address)
            ).to.be.revertedWith("Only owner");
          });


    });

    describe("Transfer", function () {
        it("should not be able to transfer", async function () {
          const { myToken, dev, alice } = await loadFixture(mintAliceFixture);
    
          await expect(
            myToken.connect(alice).transfer(dev.address, 10)
          ).to.be.revertedWith("Transfer not allowed");
        });
      });

})