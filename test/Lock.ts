import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";
import { assert } from "chai";
const { ethers } = require("hardhat")

describe("MyToken", function () {
  let myToken;
  let acc0;
  let acc1;
  let acc2;
  let acc3;
  let acc4;

  before(async function () {
      [acc0, acc1, acc2, acc3, acc4] = await ethers.getSigners();

      const MyToken = await ethers.getContractFactory("MyToken");
      myToken = await MyToken.deploy(acc0.address);
      await myToken.waitForDeployment();
  });

  it("should set initial token balance", async function () {
      const balance = await myToken.balanceOf(acc0.address);
      assert.equal(balance, 100000000000000000000, "Token balance should be set initially");
  });

  it("should mint tokens", async function () {
      const initialBalance = await myToken.balanceOf(acc0.address);
      const amountToMint = ethers.parseEther("0.0001");

      await myToken.connect(acc0).mint(acc0.address, amountToMint);

      const finalBalance = await myToken.balanceOf(acc0.address);

      assert.equal(finalBalance, ethers.parseEther("100.0001"), "Token balance did not match");
  });

  it("sending tokens", async function () {
    const initialBalance = await myToken.balanceOf(acc0.address);
    const amountToSend = ethers.parseEther("0.0001");

    await myToken.connect(acc0).transfer(acc1.address, amountToSend);
    await myToken.connect(acc0).transfer(acc2.address, amountToSend);

    const finalBalance = await myToken.balanceOf(acc1.address);
    const finalBalance2 = await myToken.balanceOf(acc2.address);
    const endlBalance = await myToken.balanceOf(acc0.address);

    assert.equal(finalBalance, amountToSend, "error per sending");
    assert.equal(finalBalance2, amountToSend, "error per sending");
    assert.equal(endlBalance, initialBalance - amountToSend - amountToSend, "error per sending");
  });

});