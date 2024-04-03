const { expect } = require("chai");
const { ethers } = require('hardhat');
describe("UniswapTest", function () {

  describe("Deployment", function () {

    const Uniswap = "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984";
    const WETH9 = "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14";

    let tokenExchangeContract;
    let accounts;
    let UniswapTokenContract;
    let WETH9Contract;

    before(async () => {
      accounts = await ethers.getSigners();
      const UniswapV3 = await ethers.getContractFactory('UniSwapV3');
      tokenExchangeContract = await UniswapV3.deploy();
      await tokenExchangeContract.deployed();
      UniswapTokenContract = await ethers.getContractAt('IERC20', Uniswap);
      WETH9Contract = await ethers.getContractAt('IWETH', WETH9);
    })

    it("Checking All the Values", async function () {
      expect(UniswapTokenContract).not.equal(WETH9Contract);
    });

    it("Check Error for NoAmountGiven", async function () {
      await expect(tokenExchangeContract.swapTokenInputSingle(0, 0, 1)).to.be.revertedWithCustomError(tokenExchangeContract, "No_Amount_Given");
    })

    it("Check Error for InputOutputSame", async function () {
      await expect(tokenExchangeContract.swapTokenInputSingle(10000, 0, 0)).to.be.revertedWithCustomError(tokenExchangeContract, "InputOutputSame");
    })

    it("Check Error for OutOfBounds", async function () {
      await expect(tokenExchangeContract.swapTokenInputSingle(10000, 2, 1)).to.be.revertedWithCustomError(tokenExchangeContract, "OutOfBounds");
    })

    it("Check for adding exisitng token", async function () {
      await expect(tokenExchangeContract.addToken("0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14")).to.be.revertedWithCustomError(tokenExchangeContract, "TokenAlreadyExists");
    })

    it("Checking for Swap in WETH/uniswap", async function () {

      const amount = 10n ** 18n;
      await WETH9Contract.deposit({ value: amount });
      await WETH9Contract.approve(tokenExchangeContract.address, amount);
      await tokenExchangeContract.swapTokenInputSingle(amount, 0, 1);
    })

    // it("Checking for Swap in WETH/uniswap using fixed Output", async function () {
    //   const amountInMax = 10n ** 18n;
    //   const uniswapOut = 100n * 10n ** 18n;
    //   await WETH9Contract.deposit({ value: amountInMax });
    //   await WETH9Contract.approve(tokenExchangeContract.address, amountInMax);
    //   await tokenExchangeContract.swapTokenOutputSingle(0, 1, uniswapOut, amountInMax);
    // })

  });
});
