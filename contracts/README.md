# TokenBank Smart Contracts

<div align="center">

[![Foundry](https://img.shields.io/badge/Foundry-v0.2.0-orange)](https://getfoundry.sh/)
[![Solidity](https://img.shields.io/badge/Solidity-%5E0.8.20-black)](https://soliditylang.org/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

[English](#english) | [中文](#chinese)

</div>

---

<a name="english"></a>

## 🇬🇧 English

### Introduction

This directory contains the Solidity smart contracts for the TokenBank project. It utilizes **Foundry** as the development framework for compilation, testing, and deployment.

The core logic revolves around two main components:

1.  **RCH Token**: A custom ERC-20 token that implements a `transferWithCallback` function, allowing it to notify the recipient contract upon transfer.
2.  **TokenBankV2**: An upgraded banking contract that maintains user balances and supports ERC-1363 style hooks (`tokenReceived`) for single-transaction deposits.

### 📄 Contracts Overview

| Contract          | Description                                                                                                                                        |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `RCH.sol`         | Custom ERC-20 token "RCH". Implements `transferWithCallback` to trigger logic on the receiver end.                                                 |
| `TokenBank.sol`   | Base banking contract handling standard deposits (via `transferFrom`) and withdrawals.                                                             |
| `TokenBankV2.sol` | Extends `TokenBank` and implements `ITokenReceiver`. Handles incoming token callbacks for smoother UX and manages a whitelist of supported tokens. |

### 🛠 Development

#### Prerequisites

Ensure you have [Foundry](https://book.getfoundry.sh/getting-started/installation) installed.

#### Build

```bash
forge install
forge build
```

#### Test

Run the comprehensive test suite (including unit tests for transfers, deposits, and withdrawals).

```bash
forge test
```

#### Deploy

Use the provided script to deploy contracts to a local or test network (e.g., Sepolia).

```bash
# Load environment variables first
source .env

# Deploy to Sepolia
forge script script/DeployAll.s.sol --rpc-url $RPC_URL --private-key $PRIVATE_KEY --broadcast
```

### 📡 Deployment Addresses

_(You can update this section after deployment)_

- **RCH Token**: `0x...`
- **TokenBankV2**: `0x...`

---

<a name="chinese"></a>

## 🇨🇳 中文

### 简介

本目录包含 TokenBank 项目的 Solidity 智能合约代码。项目使用 **Foundry** 作为开发框架，用于合约的编译、测试和部署。

核心逻辑包含两个主要组件：

1.  **RCH Token**: 一个自定义的 ERC-20 代币，实现了 `transferWithCallback` 函数，允许在转账时通知接收方合约。
2.  **TokenBankV2**: 升级版的银行合约，维护用户余额，并支持类似 ERC-1363 的钩子函数 (`tokenReceived`)，实现单笔交易完成存款。

### 📄 合约概览

| 合约              | 描述                                                                                                                |
| ----------------- | ------------------------------------------------------------------------------------------------------------------- |
| `RCH.sol`         | 自定义 ERC-20 代币 "RCH"。实现了 `transferWithCallback` 以触发接收方的逻辑。                                        |
| `TokenBank.sol`   | 基础银行合约，处理标准存款（通过 `transferFrom`）和取款逻辑。                                                       |
| `TokenBankV2.sol` | 继承自 `TokenBank` 并实现了 `ITokenReceiver` 接口。处理传入的代币回调以提供更好的用户体验，并管理支持的代币白名单。 |

### 🛠 开发指南

#### 前置条件

确保您已安装 [Foundry](https://book.getfoundry.sh/getting-started/installation)。

#### 编译

```bash
forge install
forge build
```

#### 测试

运行完整的测试套件（包含转账、存款和取款的单元测试）。

```bash
forge test
```

#### 部署

使用提供的脚本将合约部署到本地或测试网络（如 Sepolia）。

```bash
# 首先加载环境变量
source .env

# 部署到 Sepolia
forge script script/DeployAll.s.sol --rpc-url $RPC_URL --private-key $PRIVATE_KEY --broadcast
```

### 📡 部署地址

- **RCH Token**: `0xb42c5a0B067e0622fBfE606B63F0181776025817`
- **TokenBankV2**: `0xb3D3473c636b7B5E2f0E64353276e17721c0Bc0E`
