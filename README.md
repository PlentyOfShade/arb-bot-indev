To-Do:

- Make and connect my own node instead of using Alchemy node provider
- Connect to DEX, Chains, Tokens of my choice
- Test in a hardhat fork
- Connect to a, hopefully free, cloud hosting provider for bot and possibly node
- Maybe try to make instances of an HDwallet using hardhat instead of @truffle/hdwallet-provider

## Technology Stack & Tools

- Solidity (Writing Smart Contract)
- Javascript (React & Testing)
- [Web3](https://web3js.readthedocs.io/en/v1.5.2/) (Blockchain Interaction)
- hardhat
- [Alchemy](https://www.alchemy.com/) (For forking the Ethereum mainnet)

## Requirements For Initial Setup

- Install [NodeJS](https://nodejs.org/en/), I recommend using node version 16.14.2 to avoid any potential dependency issues
- Install hardhat

## Setting Up

### 1. Clone/Download the Repository

- git clone https://github.com/PlentyOfShade/arb-bot-indev

### 2. Install Dependencies:

`$ npm install`

### 3. Create and Setup .env

Before running any scripts, you'll want to create a .env file with the following values:

- **ALCHEMY_MAINNET_RPC_URL=""**
- **ALCHEMY_API_KEY=""**
- **ARB_FOR="0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"** (By default we are using WETH)
- **ARB_AGAINST="0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE"** (By default we are using SHIB)
- **PRIVATE_KEY=""** (Private key of the account to recieve profit/execute arbitrage contract)
- **PRICE_DIFFERENCE=0.50** (Difference in price between Uniswap & Sushiswap, default is 0.50%)
- **UNITS=0** (Only used for price reporting)
- **GAS_LIMIT=600000** (Currently a hardcoded value, may need to adjust during testing)
- **GAS_PRICE=0.0093** (Currently a hardcoded value, may need to adjust during testing)

### 4. Compile with hardhat

npx hardhat compile

### 5. Migrate Smart Contracts

In a seperate terminal run:

- What is the hardhat command for this?

### 6. Start the Bot

`$ node ./bot.js`

### 7. Manipulate Price

In another terminal run:
`$ node ./scripts/manipulatePrice.js`

## About config.json

Inside the _config.json_ file, under the PROJECT_SETTINGS object, there are 2 keys that hold a boolean value:

- isLocal
- isDeployed

Both options depend on how you wish to test the bot. By default both values are set to true. If you set isLocal to false, and then run the bot this
will allow the bot to monitor swap events on the actual mainnet, instead of locally.

isDeployed's value can be set on whether you wish for the abritrage contract to be called if a potential trade is found. By default isDeployed is
set to true for local testing. Ideally this is helpful if you want to monitor swaps on mainnet and you don't have a contract deployed.
This will allow you to still experiment with finding potential abitrage opportunites.

## Testing Bot on Mainnet

For monitoring prices and detecting potential arbitrage opportunities, you do not need to deploy the contract.

### 1. Edit config.json

Inside the _config.json_ file, set **isDeployed** to **false**.

### 2. Create and Setup .env

See step #4 in **Setting Up**

### 3. Run the bot

`$ node ./bot.js`

Keep in mind you'll need to wait for an actual swap event to be triggered before it checks the price.

## Anatomy of bot.js

The bot is essentially composed of 5 functions.

- _main()_
- _checkPrice()_
- _determineDirection()_
- _determineProfitability()_
- _executeTrade()_

The _main()_ function monitors swap events from both Uniswap & Sushiswap.

When a swap event occurs, it calls _checkPrice()_, this function will log the current price of the assets on both Uniswap & Sushiswap, and return the **priceDifference**

Then _determineDirection()_ is called, this will determine where we would need to buy first, then sell. This function will return an array called **routerPath** in _main()_. The array contains Uniswap & Sushiswap's router contracts. If no array is returned, this means the **priceDifference** returned earlier is not higher than **difference**

If **routerPath** is not null, then we move into _determineProfitability()_. This is where we set our conditions on whether there is a potential arbitrage or not. This function returns either true or false.

If true is returned from _determineProfitability()_, then we call _executeTrade()_ where we make our call to our arbitrage contract to perform the trade. Afterwards a report is logged, and the bot resumes to monitoring for swap events.

### Modifying & Testing the Scripts

Both the _manipulatePrice.js_ and _bot.js_ has been setup to easily make some modifications easy. Before the main() function in _manipulatePrice.js_, there will be a comment: **// -- CONFIGURE VALUES HERE -- //**. Below that will be some constants you'll be able to modify such as the unlocked account, and the amount of tokens you'll want that account to spent in order to manipulate price (You'll need to adjust this if you are looking to test different pairs).

For _bot.js_, you'd want to take a look at the function near line 132 called _determineProfitability()_. Inside this function we can set our conditions and do our calculations to determine whether we may have a potential profitable trade on our hands. This function is to return **true** if a profitable trade is possible, and **false** if not.

Note if you are doing an arbitrage for a different ERC20 token than the one in the provided example (WETH), then you may also need to adjust profitability reporting in the _executeTrade()_ function.

Keep in mind, after running the scripts, specifically _manipulatePrice.js_, you may need to restart your ganache cli, and re-migrate contracts to properly retest.

### Additional Information

The _bot.js_ script uses helper functions for fetching token pair addresses, calculating price of assets, and calculating estimated returns. These functions can be found in the _helper.js_ file inside of the helper folder.

The helper folder also has _server.js_ which is responsible for spinning up our local server, and _initialization.js_ which is responsible for setting up our web3 connection, configuring Uniswap/Sushiswap contracts, etc.

As you customize parts of the script it's best to refer to [Uniswap documentation](https://docs.uniswap.org/protocol/V2/introduction) for a more detail rundown on the protocol and interacting with the V2 exchange.

### Strategy Overview and Potential Errors

The current strategy implemented is only shown as an example alongside with the _manipulatePrice.js_ script. Essentially, after we manipulate price on Uniswap, we look at the reserves on Sushiswap and determine how much SHIB we need to buy on Uniswap to 'clear' out reserves on Sushiswap. Therefore the arbitrage direction is Uniswap -> Sushiswap.

This works because Sushiswap has lower reserves than Uniswap. However, if the arbitrage direction was swapped: Sushiswap -> Uniswap, this will sometimes error out if monitoring swaps on mainnet.

This error occurs in the _determineProfitability()_ function inside of _bot.js_. Currently a try/catch is implemented, so if it errors out, the bot will just resume monitoring price. Other solutions to this may be to implement a different strategy, use different ERC20 tokens, or reversing the order.

## Using other EVM chains

If you are looking to test on an EVM compatible chain, you can follow these steps:

### 1. Update .env

- **ARB_FOR=""**
- **ARB_AGAINST=""**

Token addresses will be different on different chains, you'll want to reference blockchain explorers such as [Polyscan](https://polygonscan.com/) for Polygon for token addresses you want to test.

### 2. Update config.json

- **V2_ROUTER_02_ADDRESS=""**
- **FACTORY_ADDRESS=""**

You'll want to update the router and factory addresses inside of the _config.json_ file with the V2 exchanges you want to use. Based on the exchange you want to use, refer to the documentation for it's address.

### 3. Change RPC URL

Inside of _initialization.js_ and _helpers.js_, you'll want to update the Web3 provider RPC URL. Example of Polygon:

```
web3 = new Web3(`wss://polygon-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`)
```

### 4. Changing Arbitrage.sol

You may also need to change the flashloan provider used in the contract to one that is available on your chain of choice.

### Additional Notes

- When starting ganache CLI, you'll want to fork using your chain's RPC URL and perhaps update the address of the account you want to unlock.
- If testing out the _manipulatePrice.js_ script, you'll also want to update the **UNLOCKED_ACCOUNT** variable and adjust **AMOUNT** as needed.

Warnings:

- I get this after compiling:Warning:
  SPDX license identifier not provided in source file. Before publishing, consider adding a comment containing "SPDX-License-Identifier: <SPDX-License>" to each source file. Use "SPDX-License-Identifier: UNLICENSED" for non-open-source code. Please see https://spdx.org for more information.
  --> @uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router01.sol

Warning: SPDX license identifier not provided in source file. Before publishing, consider adding a comment containing "SPDX-License-Identifier: <SPDX-License>" to each source file. Use "SPDX-License-Identifier: UNLICENSED" for non-open-source code. Please see https://spdx.org for more information.
--> @uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol

Errors:
