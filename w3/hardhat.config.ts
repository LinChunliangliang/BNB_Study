import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

import * as dotenv from "dotenv";
dotenv.config({ path: '.env' });

// require('dotenv').config({path:'.env'})
const config: HardhatUserConfig = {
  // solidity编译器设置
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      },
    },
  },
  // 路径设置
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  // 默认网络
  defaultNetwork: 'hardhat',
  // 网络配置
  networks: {
    hardhat: {},
    localhost: {
      url: "http://localhost:8545"
    },
    bnbtest: {
      url: process.env.BNBTest_URL,
      accounts: {
        mnemonic: process.env.BNBTest_MNEMONIC,
        count: 10
      },
    }
  },
  mocha: {
    timeout: 2000,
  },
  gasReporter: {
    enabled: true,
    currency: "USD",
    // coinmarketcap: ''
  },
  etherscan: {
    apiKey: process.env.BSCSCAN_API_KEY
  }

};

export default config;
