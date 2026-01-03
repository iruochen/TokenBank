// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/RCH.sol";
import "../src/TokenBankV2.sol";

contract RCHTest is Test {
    RCH public rch;
    TokenBankV2 public bank;

    address public owner = address(0x1);
    address public user1 = address(0x2);
    address public user2 = address(0x3);

    uint256 constant INITIAL_SUPPLY = 1_000_000_000 * 10 ** 18;

    function setUp() public {
        vm.startPrank(owner);
        rch = new RCH(owner);
        bank = new TokenBankV2();
        bank.addSupportedToken(address(rch));
        vm.stopPrank();

        // 给 user1 转一些 RCH
        vm.prank(owner);
        rch.transfer(user1, 1000 ether);
    }

    function testMetadata() public {
        assertEq(rch.name(), "Ruochen");
        assertEq(rch.symbol(), "RCH");
        assertEq(rch.totalSupply(), INITIAL_SUPPLY);
        assertEq(rch.balanceOf(owner), INITIAL_SUPPLY - 1000 ether);
    }

    function testStandardTransfer() public {
        vm.prank(user1);
        rch.transfer(user2, 100 ether);

        assertEq(rch.balanceOf(user1), 900 ether);
        assertEq(rch.balanceOf(user2), 100 ether);
    }

    function testTransferWithCallbackSuccess() public {
        vm.prank(user1);
        bool success = rch.transferWithCallback(address(bank), 200 ether, "");

        assertTrue(success);
        assertEq(rch.balanceOf(user1), 800 ether);
        assertEq(rch.balanceOf(address(bank)), 200 ether);
        assertEq(bank.balanceOf(user1, address(rch)), 200 ether);
    }

    function testTransferWithCallbackToNonContract() public {
        vm.prank(user1);
        bool success = rch.transferWithCallback(user2, 50 ether, "");

        assertTrue(success);
        assertEq(rch.balanceOf(user2), 50 ether);
        // 非合约不触发回调，没问题
    }

    function testTransferWithCallbackInvalidSelector() public {
        // 部署一个假的 receiver，返回错误的 selector
        BadReceiver bad = new BadReceiver();

        vm.prank(user1);
        vm.expectRevert("Invalid callback selector");
        rch.transferWithCallback(address(bad), 10 ether, "");
    }

    function testTransferWithCallbackRevertInHook() public {
        RevertingReceiver rev = new RevertingReceiver();

        vm.prank(user1);
        vm.expectRevert(
            "Safe receive failed: callback reverted or invalid selector"
        );
        rch.transferWithCallback(address(rev), 10 ether, "");
    }
}

// 辅助合约：返回错误 selector
contract BadReceiver is ITokenReceiver {
    function tokenReceived(
        address,
        uint256,
        bytes calldata
    ) external override returns (bytes4) {
        return bytes4(0xdeadbeef); // 错误
    }
}

// 辅助合约：直接 revert
contract RevertingReceiver is ITokenReceiver {
    function tokenReceived(
        address,
        uint256,
        bytes calldata
    ) external override returns (bytes4) {
        revert("I don't want your tokens");
    }
}
