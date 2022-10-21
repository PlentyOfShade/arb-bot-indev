const path = require("path");
const fs = require("fs-extra");
const solc = require("solc-js");

const arbitragePath = path.resolve(__dirname, "contracts", "Arbitrage.sol");
const source = fs.readFileSync(arbitragePath, "utf8");

let input = {
  language: "Solidity",
  sources: {
    [arbitragePath]: {
      content: source,
    },
  },

  settings: {
    outputSelection: {
      "*": {
        "*": ["*"],
      },
    },
  },
};

var output = JSON.parse(solc.compile(JSON.stringify(input)));

module.exports = {
  abi: output.contracts[[arbitragePath]]["Arbitrage"].abi,
  bytecode: output.contracts[[arbitragePath]]["Arbitrage"].evm.bytecode.object,
};
