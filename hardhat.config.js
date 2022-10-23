require("@nomicfoundation/hardhat-chai-matchers");
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-web3");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      // forking: {
      //   url: process.env.ALCHEMY_MAINNET_RPC_URL,
      //   // accounts: {
      //   //   mnemonic:
      //   //     "test test test test test test test test test test test junk",
      //   //   path: "m/44'/60'/0'/0",
      //   //   initialIndex: 0,
      //   //   count: 20,
      //   //   passphrase: "",
      //   // },
      // },
    },
  },
  solidity: {
    version: "0.8.17",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  solidity: {
    version: "0.8.10",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  // mocha: {
  //   timeout: 40000
  // }
};
