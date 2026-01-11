# TokenBank DApp

<div align="center">
  <img src="src/app/icon.svg" width="100" />
</div>

<div align="center">

[![Vercel Deployment](https://img.shields.io/badge/Vercel-Deployed-black?logo=vercel)](https://bank.ruochen.app)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![Wagmi](https://img.shields.io/badge/Wagmi-v2-blue)](https://wagmi.sh/)
[![RainbowKit](https://img.shields.io/badge/RainbowKit-v2-blue)](https://www.rainbowkit.com/)

[English](#english) | [中文](#chinese)

</div>

---

<a name="english"></a>

## 🇬🇧 English

### Introduction

TokenBank is a decentralized application (DApp) that allows users to deposit and withdraw ERC-20 tokens securely. It demonstrates a full-stack Web3 integration using modern frontend technologies and smart contract interactions.

**Live Demo:** [https://bank.ruochen.app](https://bank.ruochen.app)

### ✨ Features

- **Wallet Connection**: Seamless integration with RainbowKit supports various wallets (MetaMask, WalletConnect, etc.).
- **V2 Direct Deposit**: Supports `transferWithCallback` for one-step deposits (No separate approve transaction needed).
- **Standard Deposit**: Classic `Approve` + `Deposit` flow for compatibility.
- **Withdrawal**: Securely withdraw funds from the Bank contract.
- **Real-time Balance**: Auto-refreshing balances for Wallet and Bank deposits.
- **Responsive UI**: Modern, light-themed interface optimized for all devices.

### 🛠 Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Web3 Hooks**: [Wagmi v2](https://wagmi.sh/) & [Viem](https://viem.sh/)
- **Wallet UI**: [RainbowKit](https://www.rainbowkit.com/)

### 🚀 Getting Started

1.  **Clone the repository**

    ```bash
    git clone https://github.com/iruochen/TokenBank.git
    cd TokenBank/frontend
    ```

2.  **Install dependencies**

    ```bash
    pnpm install
    # or yarn install / npm install
    ```

3.  **Configure Environment Variables**
    Create a `.env.local` file in the root directory:

    ```bash
    NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_reown_project_id
    ```

4.  **Run Development Server**
    ```bash
    pnpm dev
    ```
    Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

---

<a name="chinese"></a>

## 🇨🇳 中文

### 项目介绍

TokenBank 是一个去中心化应用 (DApp)，允许用户安全地存取 ERC-20 代币。本项目展示了使用现代前端技术栈进行全栈 Web3 集成的最佳实践。

**在线演示:** [https://bank.ruochen.app](https://bank.ruochen.app)

### ✨ 功能特性

- **钱包连接**: 集成 RainbowKit，支持多种钱包 (MetaMask, WalletConnect 等)。
- **V2 直接存款**: 支持 `transferWithCallback`，实现一步存款 (无需单独授权交易)。
- **标准存款**: 经典的 `Approve` (授权) + `Deposit` (存款) 流程，保证兼容性。
- **提现功能**: 从银行合约安全提取资金。
- **实时余额**: 自动刷新钱包余额和银行存款余额。
- **响应式 UI**: 现代化的亮色主题界面，适配各种设备。

### 🛠 技术栈

- **框架**: [Next.js 16](https://nextjs.org/) (App Router)
- **语言**: TypeScript
- **样式**: [Tailwind CSS](https://tailwindcss.com/)
- **Web3 交互**: [Wagmi v2](https://wagmi.sh/) & [Viem](https://viem.sh/)
- **钱包 UI**: [RainbowKit](https://www.rainbowkit.com/)

### 🚀 快速开始

1.  **克隆仓库**

    ```bash
    git clone https://github.com/iruochen/TokenBank.git
    cd TokenBank/frontend
    ```

2.  **安装依赖**

    ```bash
    pnpm install
    # 或 yarn install / npm install
    ```

3.  **配置环境变量**
    在根目录下创建 `.env.local` 文件：

    ```bash
    NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=你的_reown_project_id
    ```

4.  **运行开发服务器**
    ```bash
    pnpm dev
    ```
    打开 [http://localhost:3000](http://localhost:3000) 即可在浏览器中查看。

---

### 📄 License

This project is licensed under the MIT License.
