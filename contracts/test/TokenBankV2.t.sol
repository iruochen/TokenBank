// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/RCH.sol";
import "../src/TokenBankV2.sol";

error ZeroAmount();

contract TokenBankV2Test is Test {
    RCH public rch;
    TokenBankV2 public bank;

    address public owner = address(0x1);
    address public user1 = address(0x2);
    address public user2 = address(0x3);

    function setUp() public {
        vm.startPrank(owner);
        rch = new RCH(owner);
        bank = new TokenBankV2();
        bank.addSupportedToken(address(rch));

        // 给 user1 和 user2 一些 RCH
        rch.transfer(user1, 1000 ether);
        rch.transfer(user2, 500 ether);
        vm.stopPrank();
    }

    function testOrdinaryDepositAndWithdraw() public {
        uint256 amount = 300 ether;

        vm.startPrank(user1);
        rch.approve(address(bank), amount);
        bank.deposit(address(rch), amount);

        assertEq(bank.balanceOf(user1, address(rch)), amount);
        assertEq(rch.balanceOf(address(bank)), amount);

        bank.withdraw(address(rch), amount / 2);
        assertEq(bank.balanceOf(user1, address(rch)), amount / 2);
        assertEq(rch.balanceOf(user1), 1000 ether - amount + amount / 2);
        vm.stopPrank();
    }

    function testCallbackDepositViaTransferWithCallback() public {
        uint256 amount = 400 ether;

        vm.prank(user1);
        rch.transferWithCallback(address(bank), amount, "");

        assertEq(bank.balanceOf(user1, address(rch)), amount);
        assertEq(rch.balanceOf(address(bank)), amount);
        assertEq(rch.balanceOf(user1), 1000 ether - amount);
    }

    function testUnsupportedTokenCannotCallback() public {
        // 部署另一个代币（普通 ERC20）
        RCH mockToken = new RCH(owner);
        vm.prank(owner);
        mockToken.transfer(user1, 100 ether);

        // 故意不 addSupportedToken

        vm.prank(user1);
        vm.expectRevert("Unsupported token");
        // 模拟直接调用 tokenReceived（实际场景由代币触发）
        bank.tokenReceived(user1, 50 ether, "");
    }

    function testZeroAmountRevert() public {
        vm.startPrank(user1);
        rch.approve(address(bank), 100 ether);

        vm.expectRevert(ZeroAmount.selector);
        bank.deposit(address(rch), 0);
        vm.stopPrank();

        vm.expectRevert(ZeroAmount.selector);
        vm.prank(address(rch));
        bank.tokenReceived(user1, 0, "");
    }

    function testInsufficientBalanceWithdraw() public {
        vm.startPrank(user1);
        rch.approve(address(bank), 100 ether);
        bank.deposit(address(rch), 100 ether);

        vm.expectRevert(); // InsufficientBalance
        bank.withdraw(address(rch), 200 ether);
        vm.stopPrank();
    }
}
