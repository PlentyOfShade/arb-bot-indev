require("@nomicfoundation/hardhat-chai-matchers");
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-web3");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  solidity: "0.8.10",

  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      forking: {
        url: process.env.ALCHEMY_MAINNET_RPC_URL,
        accounts: {
          mnemonic:
            "test test test test test test test test test test test junk",
          //path: "m/44'/60'/0'/0",
          //initialIndex: 0,
          //count: 20,
          //passphrase: "",
        },
      },
    },
  },
};
