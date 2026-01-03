// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {SafeERC20, IERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract TokenBank is ReentrancyGuard {
    using SafeERC20 for IERC20;

    // 存储用户在不同代币下的余额
    mapping(address => mapping(address => uint256)) public userTokens;

    event Deposit(address indexed user, address indexed token, uint256 amount);
    event Withdraw(address indexed user, address indexed token, uint256 amount);

    error ZeroAmount();
    error InsufficientBalance();

    /**
     * @dev 存款函数，用户将指定数量的代币存入合约
     * @param tokenAddr 代币合约地址
     * @param amount 存入的代币数量
     */
    function deposit(
        address tokenAddr,
        uint256 amount
    ) external virtual nonReentrant {
        if (amount == 0) {
            revert ZeroAmount();
        }
        IERC20 token = IERC20(tokenAddr);
        require(
            token.transferFrom(msg.sender, address(this), amount),
            "Transfer failed"
        );
        userTokens[msg.sender][tokenAddr] += amount;
        emit Deposit(msg.sender, tokenAddr, amount);
    }

    /**
     * @dev 提款函数，用户从合约中提取指定数量的代币
     * @param tokenAddr 代币合约地址
     * @param amount 提取的代币数量
     */
    function withdraw(address tokenAddr, uint256 amount) external nonReentrant {
        if (amount == 0) {
            revert ZeroAmount();
        }
        if (userTokens[msg.sender][tokenAddr] < amount) {
            revert InsufficientBalance();
        }

        userTokens[msg.sender][tokenAddr] -= amount;

        IERC20 token = IERC20(tokenAddr);
        require(token.transfer(msg.sender, amount), "Transfer failed");
        emit Withdraw(msg.sender, tokenAddr, amount);
    }

    /**
     * @dev 查询用户在指定代币下的余额
     * @param user 用户地址
     * @param tokenAddr 代币合约地址
     * @return 返回用户在该代币下的余额
     */
    function balanceOf(
        address user,
        address tokenAddr
    ) external view returns (uint256) {
        return userTokens[user][tokenAddr];
    }
}
