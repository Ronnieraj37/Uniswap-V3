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
      tokenExchangeContract = await ethers.getContractAt('UniSwapV3', "0x05c1Db5c0a0598F8c51e8A683D9635B47693e1C5");
      UniswapTokenContract = await ethers.getContractAt('IERC20', Uniswap);
      WETH9Contract = await ethers.getContractAt('IWETH', WETH9);
      console.log(await tokenExchangeContract.totalTokens());
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
      await expect(tokenExchangeContract.swapTokenInputSingle(10000, 4, 1)).to.be.revertedWithCustomError(tokenExchangeContract, "OutOfBounds");
    })

    // it("Check for adding exisitng token", async function () {
    //   await expect(tokenExchangeContract.addToken("0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14")).to.be.revertedWithCustomError(tokenExchangeContract, "TokenAlreadyExists");
    // })

    it("Checking for Swap in WETH/uniswap", async function () {

      const amount = 10n ** 18n;
      await WETH9Contract.deposit({ value: amount });
      await WETH9Contract.approve(tokenExchangeContract.address, amount);
      await tokenExchangeContract.swapTokenInputSingle(amount, 0, 3);
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
