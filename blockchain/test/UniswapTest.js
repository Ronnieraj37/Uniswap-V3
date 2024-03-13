const { expect } = require("chai");
const { ethers } = require('hardhat');
describe("UniswapTest", function () {

  describe("Deployment", function () {
    let uniswapContract;
    let accounts;
    let tokenA;
    let tokenB;
    let tokenContractA;
    let tokenContractB;

    before(async () => {
      accounts = await ethers.getSigners();
      const UniswapV3 = await ethers.getContractFactory('UniSwapV3');
      uniswapContract = await UniswapV3.deploy("0xE592427A0AEce92De3Edee1F18E0157C05861564");
      await uniswapContract.deployed();
      tokenA = await uniswapContract.tokenA();
      tokenB = await uniswapContract.tokenB();
      tokenContractA = await ethers.getContractAt('UERC20', tokenA);
      tokenContractB = await ethers.getContractAt('UERC20', tokenB);
    })

    it("Checking All the Values", async function () {
      expect(tokenA).not.equal(tokenB);
    });

    it("Checking the balance of Contract for Token A", async function () {
      const balance = await tokenContractA.balanceOf(uniswapContract.address);
      expect(balance.toNumber()).to.equal(10e12);
    });

    it("Checking the balance of Contract for Token B", async function () {
      const balance = await tokenContractB.balanceOf(uniswapContract.address);
      expect(balance.toNumber()).to.equal(10e12);
    });
  });

  // describe("Withdrawals", function () {
  //   describe("Validations", function () {
  //     it("Should revert with the right error if called too soon", async function () {
  //       const { lock } = await loadFixture(deployOneYearLockFixture);

  //       await expect(lock.withdraw()).to.be.revertedWith(
  //         "You can't withdraw yet"
  //       );
  //     });

  //     it("Should revert with the right error if called from another account", async function () {
  //       const { lock, unlockTime, otherAccount } = await loadFixture(
  //         deployOneYearLockFixture
  //       );

  //       // We can increase the time in Hardhat Network
  //       await time.increaseTo(unlockTime);

  //       // We use lock.connect() to send a transaction from another account
  //       await expect(lock.connect(otherAccount).withdraw()).to.be.revertedWith(
  //         "You aren't the owner"
  //       );
  //     });

  //     it("Shouldn't fail if the unlockTime has arrived and the owner calls it", async function () {
  //       const { lock, unlockTime } = await loadFixture(
  //         deployOneYearLockFixture
  //       );

  //       // Transactions are sent using the first signer by default
  //       await time.increaseTo(unlockTime);

  //       await expect(lock.withdraw()).not.to.be.reverted;
  //     });
  //   });

  //   describe("Events", function () {
  //     it("Should emit an event on withdrawals", async function () {
  //       const { lock, unlockTime, lockedAmount } = await loadFixture(
  //         deployOneYearLockFixture
  //       );

  //       await time.increaseTo(unlockTime);

  //       await expect(lock.withdraw())
  //         .to.emit(lock, "Withdrawal")
  //         .withArgs(lockedAmount, anyValue); // We accept any value as `when` arg
  //     });
  //   });

  //   describe("Transfers", function () {
  //     it("Should transfer the funds to the owner", async function () {
  //       const { lock, unlockTime, lockedAmount, owner } = await loadFixture(
  //         deployOneYearLockFixture
  //       );

  //       await time.increaseTo(unlockTime);

  //       await expect(lock.withdraw()).to.changeEtherBalances(
  //         [owner, lock],
  //         [lockedAmount, -lockedAmount]
  //       );
  //     });
  //   });
  // });
});
