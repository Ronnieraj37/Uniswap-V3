const { expect } = require("chai");
const { ethers } = require('hardhat');
describe("UniswapTest", function () {

  describe("Deployment", function () {
    let uniswapContract;
    let accounts;

    let Uniswap = "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984";
    let WETH9 = "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14";

    let UniswapContract;
    let WETH9Contract;

    before(async () => {
      accounts = await ethers.getSigners();
      const UniswapV3 = await ethers.getContractFactory('UniSwapV3');
      uniswapContract = await UniswapV3.deploy();
      await uniswapContract.deployed();

      UniswapContract = await ethers.getContractAt('IERC20', Uniswap);
      WETH9Contract = await ethers.getContractAt('IWETH', WETH9);
    })

    it("Checking All the Values", async function () {
      expect(UniswapContract).not.equal(WETH9Contract);
    });

    it("Checking for Swap in WETH/DAI", async function () {

      const amount = 10n ** 18n;
      await WETH9Contract.deposit({ value: amount });
      await WETH9Contract.approve(uniswapContract.address, amount);
      await uniswapContract.swapTokenInputSingle(1000000, 0, 1);
    })

    it("Checking for Swap in WETH/DAI using fixed Output", async function () {

      const amountInMax = 10n ** 18n;
      const daiOut = 100n * 10n ** 18n;
      await WETH9Contract.deposit({ value: amountInMax });
      await WETH9Contract.approve(uniswapContract.address, amountInMax);
      await uniswapContract.swapTokenOutputSingle(0, 1, daiOut, amountInMax);

    })

    it("Checking for Swap in DAI/WETH", async function () {

      const amount = 100n * 10n ** 18n;
      await UniswapContract.mint(accounts[0].address, amount);
      await UniswapContract.approve(uniswapContract.address, amount);
      await uniswapContract.swapTokenInputSingle(100000, 1, 0);
    })

    it("Checking for Swap in DAI/WETH using fixed Output", async function () {

      const amountInMax = 100n * 10n ** 18n;
      const wethOut = 10n ** 18n;
      await UniswapContract.mint(accounts[0].address, amount);
      await UniswapContract.approve(uniswapContract.address, amountInMax);
      await uniswapContract.swapTokenOutputSingle(1, 0, wethOut, amountInMax);

    })

  });
});
