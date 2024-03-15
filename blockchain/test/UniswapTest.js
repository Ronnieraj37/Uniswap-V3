const { expect } = require("chai");
const { ethers } = require('hardhat');
describe("UniswapTest", function () {

  describe("Deployment", function () {
    let uniswapContract;
    let accounts;
    let DAI = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
    let WETH9 = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";

    let DAIContract;
    let WETH9Contract;

    before(async () => {
      accounts = await ethers.getSigners();
      const UniswapV3 = await ethers.getContractFactory('UniSwapV3');
      uniswapContract = await UniswapV3.deploy();
      await uniswapContract.deployed();

      DAIContract = await ethers.getContractAt('IERC20', DAI);
      WETH9Contract = await ethers.getContractAt('IWETH', WETH9);
    })

    it("Checking All the Values", async function () {
      expect(DAIContract).not.equal(WETH9Contract);
    });

    it("Checking for Swap in WETH/DAI", async function () {

      const amount = 10n ** 18n;
      await WETH9Contract.deposit({ value: amount });
      await WETH9Contract.approve(uniswapContract.address, amount);
      await uniswapContract.swapTokenInputSingle(1000000, 1, 0);
    })

    it("Checking for Swap in WETH/DAI using fixed Output", async function () {

      const amountInMax = 10n ** 18n;
      const daiOut = 100n * 10n ** 18n;
      await WETH9Contract.deposit({ value: amountInMax });
      await WETH9Contract.approve(uniswapContract.address, amountInMax);
      await uniswapContract.swapTokenOutputSingle(1, 0, daiOut, amountInMax);

    })

    it("Checking for Swap in DAI/WETH", async function () {

      const amount = 100n * 10n ** 18n;
      await DAIContract.deposit({ value: amount });
      await DAIContract.approve(uniswapContract.address, amount);
      await uniswapContract.swapTokenInputSingle(100000, 0, 1);
    })

    it("Checking for Swap in DAI/WETH using fixed Output", async function () {

      const amountInMax = 100n * 10n ** 18n;
      const wethOut = 10n ** 18n;
      await DAIContract.deposit({ value: amountInMax });
      await DAIContract.approve(uniswapContract.address, amountInMax);
      await uniswapContract.swapTokenOutputSingle(0, 1, wethOut, amountInMax);

    })

  });
});
