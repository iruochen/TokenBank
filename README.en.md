# RCH Token & TokenBankV2

An ERC20 token (RCH) with callback functionality and a universal token bank (TokenBankV2) implemented in Solidity. Supports two deposit methods:

- Traditional pull-based deposit (`approve` + `deposit` + `transferFrom`)
- Push-based deposit with callback (`transferWithCallback` → automatically triggers `tokenReceived` hook)

The project has been successfully deployed and fully tested on the Sepolia testnet.

## Project Structure

```
TokenBank/
├── contracts/
│   ├── src/
│   │   ├── RCH.sol              # ERC20 token with callback transfer
│   │   ├── TokenBank.sol        # Base token bank supporting standard deposit/withdraw
│   │   └── TokenBankV2.sol      # Upgraded bank with callback deposit and whitelist
│   ├── script/
│   │   └── DeployAll.s.sol      # One-click deployment script
│   ├── test/
│   │   ├── RCH.t.sol
│   │   └── TokenBankV2.t.sol
│   └── foundry.toml
├── frontend/                        # (Optional) frontend directory for future extension
├── .gitignore
└── README.md
```

## Key Features

### RCH Token
- Total supply: 1,000,000,000 RCH (18 decimals)
- Supports standard `transfer` and `transferFrom`
- Additional `transferWithCallback(address to, uint256 amount, bytes data)`:
  - Automatically detects if recipient is a contract
  - Calls the recipient's `tokenReceived` hook if applicable (similar to ERC777)
  - Supports empty `data` (use `0x`)

### TokenBankV2
- Inherits from TokenBank (standard deposit/withdraw)
- Implements `ITokenReceiver` interface
- Supports callback deposits: users can send RCH directly to the bank using `transferWithCallback` for automatic balance recording
- Whitelist mechanism (`addSupportedToken`) to prevent malicious contract calls
- Reentrancy protection (ReentrancyGuard)
- Unified custom error `ZeroAmount()`

## Sepolia Testnet Deployment (Deployed on 2026-01-04)

- **RCH**: [0xb42c5a0B067e0622fBfE606B63F0181776025817](https://sepolia.etherscan.io/token/0xb42c5a0B067e0622fBfE606B63F0181776025817)
- **TokenBankV2**: [0xb3D3473c636b7B5E2f0E64353276e17721c0Bc0E](https://sepolia.etherscan.io/address/0xb3d3473c636b7b5e2f0e64353276e17721c0bc0e)

> Contracts are verified and callback deposit has been successfully tested.

## Development & Testing

### Install dependencies

```shell
forge install
```

### Compile

```shell
forge build
```

### Run tests (all passed)

```shell
forge test -vvv
```

### Deploy to Sepolia (requires .env configuration)

```shell
forge script script/DeployAll.s.sol:DeployAll \
    --rpc-url sepolia \
    --broadcast \
    --verify \
    --private-key $DEPLOYER_PRIVATE_KEY
```

## Usage Examples (MetaMask / Etherscan)

1. Add RCH to MetaMask
   - Contract address: 0xb42c5a0B067e0622fBfE606B63F0181776025817
   - Symbol: RCH
   - Decimals: 18

2. Push-based (callback) deposit
   - Send RCH to TokenBankV2 address: 0xb3D3473c636b7B5E2f0E64353276e17721c0Bc0E
   - Use the `transferWithCallback` function (Etherscan → Write Contract)
   - Fill `data` with `0x` (empty)

3. Check bank balance
   - TokenBankV2 → Read Contract → `balanceOf(your_address, RCH_address)`

## Future Plans
- [ ] Frontend deposit/withdrawal interface

## License

MIT
