const { expect } = require("chai");
const { ethers } = require('hardhat');
describe("UniswapTest", function () {

  describe("Deployment", function () {
    let uniswapContract;
    let accounts;

    let Uniswap = "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984";
    let WETH9 = "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14";

    let UniswapTokenContract;
    let WETH9Contract;
    let tokenPrivate;
    let tokenPrivateAddress;
    before(async () => {
      accounts = await ethers.getSigners();
      const UniswapV3 = await ethers.getContractFactory('UniSwapV3');
      uniswapContract = await UniswapV3.deploy();
      await uniswapContract.deployed();
      tokenPrivateAddress = await uniswapContract.gettokenPrivate();
      tokenPrivate = await ethers.getContractAt('MyToken', tokenPrivateAddress);
      UniswapTokenContract = await ethers.getContractAt('IERC20', Uniswap);
      WETH9Contract = await ethers.getContractAt('IWETH', WETH9);
    })

    it("Checking All the Values", async function () {
      expect(UniswapTokenContract).not.equal(WETH9Contract);
    });

    it("Checking for Swap in WETH/uniswap", async function () {

      const amount = 10n ** 18n;
      await WETH9Contract.deposit({ value: amount });
      await WETH9Contract.approve(uniswapContract.address, amount);
      await uniswapContract.swapTokenInputSingle(1000000, 0, 1);
    })

    it("Adding Liquidity for uniswap/WETH", async = async () => {

      const amount = 10n ** 18n;
      const MintParams = {
        token0: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
        token1: '0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14',
        fee: 3000,
        tickLower: -1000,
        tickUpper: 1000,
        amount0Desired: amount,
        amount1Desired: amount,
        amount0Min: 10,
        amount1Min: 10,
        recipient: accounts[0],
        deadline: 1785767499,
      }

      await WETH9Contract.approve(uniswapContract.address, amount);
      await UniswapTokenContract.approve(uniswapContract.address, amount);
      const res = await uniswapContract.increaseLiquidity(MintParams);
      // console.log("Swap",res);
      // await tokenPrivate.mint(accounts[0].address, amount);
    })

    // it("Checking for Swap in WETH/uniswap using fixed Output", async function () {

    //   const amountInMax = 10n ** 18n;
    //   const uniswapOut = 100n * 10n ** 18n;
    //   await WETH9Contract.deposit({ value: amountInMax });
    //   await WETH9Contract.approve(uniswapContract.address, amountInMax);
    //   await uniswapContract.swapTokenOutputSingle(0, 1, uniswapOut, amountInMax);

    // })

    // it("Checking for Swap in uniswap/WETH using fixed Output", async function () {

    //   const amountInMax = 100n * 10n ** 18n;
    //   const wethOut = 10n ** 18n;
    //   await UniswapContract.mint(accounts[0].address, amount);
    //   await UniswapContract.approve(uniswapContract.address, amountInMax);
    //   await uniswapContract.swapTokenOutputSingle(1, 0, wethOut, amountInMax);

    // })

  });
});
