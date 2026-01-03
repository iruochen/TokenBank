# RCH Token & TokenBankV2

一个基于 Solidity 的自定义 ERC20 代币（RCH） + 通用代币银行（TokenBankV2）项目，支持两种存款方式：

- 传统拉取式存款（`deposit` + `approve` + `transferFrom`）
- 推送式回调存款（`transferWithCallback` → 自动触发 `tokenReceived` 钩子）

项目在 Sepolia 测试网已成功部署并实测通过。

## 项目结构

```shell
TokenBank/
├── contracts/
│ ├── src/
│ │ ├── RCH.sol # 带回调转账的 ERC20 代币
│ │ ├── TokenBank.sol # 基础银行合约（支持普通存取）
│ │ └── TokenBankV2.sol # 升级版银行，支持回调存款 + 白名单
│ ├── script/
│ │ └── DeployAll.s.sol # 一键部署脚本
│ ├── test/
│ │ ├── RCH.t.sol
│ │ └── TokenBankV2.t.sol
│ └── foundry.toml
├── frontend/ # （可选）前端目录，可自行扩展
├── .gitignore
└── README.md
```

## 核心特性

### RCH 代币

- 总供应量：1,000,000,000 RCH（18 位小数）
- 支持标准 `transfer` / `transferFrom`
- 新增 `transferWithCallback(address to, uint256 amount, bytes data)`：
  - 转账后自动检测接收方是否为合约
  - 如果是合约，则调用其 `tokenReceived` 钩子（类似 ERC777）
  - 支持 data 为空（填 `0x` 即可）

### TokenBankV2

- 继承自 TokenBank，支持普通存取
- 实现 `ITokenReceiver` 接口
- 支持回调存款：用户直接向银行地址转 RCH（使用 `transferWithCallback`），自动记录余额
- 白名单机制（`addSupportedToken`），防止恶意合约调用
- 重入防护（ReentrancyGuard）
- 统一使用 custom error `ZeroAmount()`

## Sepolia 测试网部署地址（2026-01-04 部署）

- **RCH**: [0xb42c5a0B067e0622fBfE606B63F0181776025817](https://sepolia.etherscan.io/token/0xb42c5a0B067e0622fBfE606B63F0181776025817)
- **TokenBankV2**: [0xb3D3473c636b7B5E2f0E64353276e17721c0Bc0E](https://sepolia.etherscan.io/address/0xb3d3473c636b7b5e2f0e64353276e17721c0bc0e)

> 已验证合约，已实测回调存款成功。

## 开发 & 测试

### 安装依赖

```shell
forge install
```

### 编译

```shell
forge build
```

### 运行测试（已全通过）

```shell
forge test -vvv
```

### 部署到 Sepolia（需配置 .env）

```shell
forge script script/DeployAll.s.sol:DeployAll \
 --rpc-url sepolia \
 --broadcast \
 --verify \
 --private-key $DEPLOYER_PRIVATE_KEY
```

## 使用示例（MetaMask / Etherscan）

1. 添加 RCH 到 MetaMask

   - 合约地址：0xb42c5a0B067e0622fBfE606B63F0181776025817
   - 符号：RCH
   - 小数位：18

2. 回调存款（推送式）

   - 发送 RCH 到 TokenBankV2 地址：0xb3D3473c636b7B5E2f0E64353276e17721c0Bc0E
   - 使用 `transferWithCallback` 函数（Etherscan Write Contract）
   - data 填 `0x`（空）

3. 查询银行余额
   - TokenBankV2 → Read Contract → `balanceOf(your_address, RCH_address)`

## 后续计划
- [ ] 前端存款/提款界面

## License

MIT
