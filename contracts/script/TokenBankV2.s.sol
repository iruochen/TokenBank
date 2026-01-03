// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {console} from "forge-std/console.sol";
import {BaseScript} from "./BaseScript.s.sol";
import {TokenBank} from "../src/TokenBank.sol";

contract TokenBankScript is BaseScript {
    TokenBank public tokenBank;

    function run() external broadcaster {
        tokenBank = new TokenBank();
        console.log("TokenBank deployed at:", address(tokenBank));
        saveContract("TokenBank", address(tokenBank));
    }
}
