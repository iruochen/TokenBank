// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {console} from "forge-std/console.sol";
import {BaseScript} from "./BaseScript.s.sol";
import {RCH} from "../src/RCH.sol";
import {TokenBankV2} from "../src/TokenBankV2.sol";

contract DeployAll is BaseScript {
    RCH public rch;
    TokenBankV2 public tokenBankV2;

    function run() external broadcaster {
        rch = new RCH(deployerAddr);
        console.log("RCH deployed at:", address(rch));
        saveContract("RCH", address(rch));

        tokenBankV2 = new TokenBankV2();
        console.log("TokenBankV2 deployed at:", address(tokenBankV2));
        saveContract("TokenBankV2", address(tokenBankV2));

        // 把 RCH 添加到支持的代币白名单
        tokenBankV2.addSupportedToken(address(rch));
        console.log("RCH added to supported tokens");

        console.log("=== Deployment Summary ===");
        console.log("Deployer:", deployerAddr);
        console.log("RCH:", address(rch));
        console.log("TokenBankV2:", address(tokenBankV2));
    }
}
