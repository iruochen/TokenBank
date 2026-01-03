// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import {TokenBank} from "./TokenBank.sol";
import {ITokenReceiver} from "./RCH.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract TokenBankV2 is TokenBank, ITokenReceiver, Ownable {
    event DepositWithCallback(address indexed from, uint256 amount);

    mapping(address => bool) public supportedTokens;

    constructor() Ownable(msg.sender) {}

    /**
     * @dev 实现 ITokenReceiver 接口的 tokenReceived 回调函数
     * @param from 代币发送地址
     * @param amount 代币数量
     * @return 返回函数选择器以确认接收
     */
    function tokenReceived(
        address from,
        uint256 amount,
        bytes calldata
    ) external override returns (bytes4) {
        if (amount == 0) {
            revert ZeroAmount();
        }
        require(supportedTokens[msg.sender], "Unsupported token");

        userTokens[from][msg.sender] += amount;

        emit DepositWithCallback(from, amount);
        return ITokenReceiver.tokenReceived.selector;
    }

    function addSupportedToken(address tokenAddr) external onlyOwner {
        supportedTokens[tokenAddr] = true;
    }
}
