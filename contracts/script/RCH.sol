// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {console} from "forge-std/console.sol";
import {BaseScript} from "./BaseScript.s.sol";
import {RCH} from "../src/RCH.sol";

contract RCHScript is BaseScript {
    RCH public rch;

    function run() external broadcaster {
        rch = new RCH(deployerAddr);
        console.log("RCH deployed at:", address(rch));
        saveContract("RCH", address(rch));
    }
}
