require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  paths: {
    artifacts: "../client/src/artifacts"
  },
  networks: {
    hardhat: {
      forking: {
        // url: "https://eth-mainnet.g.alchemy.com/v2/qkq_OWrPbWd3F-tgQWcERygouzqOP-Fn",
        url: "https://eth-sepolia.g.alchemy.com/v2/TEHTMtORR5fyS4pBP9S9Go2eoR_hc-XH"
      }
    },
    sepolia: {
      url: process.env.RPC_URL,
      accounts: [process.env.PRIVATE_KEY],
    }
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_KEY
  }
};
