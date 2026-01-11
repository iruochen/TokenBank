"use client"
import {
	useAccount,
	useContractWrite,
	useReadContract,
	useWaitForTransactionReceipt,
} from "wagmi"
import {
	TOKEN_ABI,
	TOKEN_BANK_ABI,
	CONTRACTS,
	EXPLORER_URL,
} from "../constants"
import { formatEther, parseEther } from "viem"
import { useEffect, useState } from "react"

type AddressType = `0x${string}`

export default function TokenBank() {
	const { address, isConnected } = useAccount()
	const [depositAmount, setDepositAmount] = useState("")
	const [directDepositAmount, setDirectDepositAmount] = useState("")
	const [withdrawAmount, setWithdrawAmount] = useState("")

	// read token balance
	const { data: tokenBalance, refetch: refetchTokenBalance } = useReadContract({
		address: CONTRACTS.MyToken as AddressType,
		abi: TOKEN_ABI,
		functionName: "balanceOf",
		args: [address as `0x${string}`],
	})

	// read token symbol
	const { data: tokenSymbol } = useReadContract({
		address: CONTRACTS.MyToken as AddressType,
		abi: TOKEN_ABI,
		functionName: "symbol",
		args: [],
	})

	// read bank balance
	const { data: bankBalance, refetch: refetchBankBalance } = useReadContract({
		address: CONTRACTS.TokenBank as AddressType,
		abi: TOKEN_BANK_ABI,
		functionName: "balanceOf",
		args: [address as `0x${string}`, CONTRACTS.MyToken as AddressType],
	})

	// read allowance
	const { data: allowance, refetch: refetchAllowance } = useReadContract({
		address: CONTRACTS.MyToken as AddressType,
		abi: TOKEN_ABI,
		functionName: "allowance",
		args: [address as `0x${string}`, CONTRACTS.TokenBank as AddressType],
	})

	// approval transaction
	const {
		writeContract: approve,
		data: approveHash,
		isPending: isApproving,
	} = useContractWrite()
	const { isLoading: isApproveConfirming, isSuccess: isApproveSuccess } =
		useWaitForTransactionReceipt({ hash: approveHash })

	// deposit transaction
	const {
		writeContract: deposit,
		data: depositHash,
		isPending: isDepositing,
	} = useContractWrite()
	const { isLoading: isDepositConfirming, isSuccess: isDepositSuccess } =
		useWaitForTransactionReceipt({ hash: depositHash })

	// direct deposit transaction
	const {
		writeContract: directDeposit,
		data: directDepositHash,
		isPending: isDirectDepositing,
	} = useContractWrite()
	const {
		isLoading: isDirectDepositConfirming,
		isSuccess: isDirectDepositSuccess,
	} = useWaitForTransactionReceipt({ hash: directDepositHash })

	// withdraw transaction
	const {
		writeContract: withdraw,
		data: withdrawHash,
		isPending: isWithdrawing,
	} = useContractWrite()
	const { isLoading: isWithdrawConfirming, isSuccess: isWithdrawSuccess } =
		useWaitForTransactionReceipt({ hash: withdrawHash })

	// refetch balances after approve transactions
	useEffect(() => {
		if (isApproveSuccess) {
			refetchAllowance()
		}
	}, [isApproveSuccess, refetchAllowance])

	useEffect(() => {
		if (isDepositSuccess || isDirectDepositSuccess) {
			refetchTokenBalance()
			refetchBankBalance()
			refetchAllowance()
			setDepositAmount("")
			setDirectDepositAmount("")
		}
	}, [
		isDepositSuccess,
		isDirectDepositSuccess,
		refetchTokenBalance,
		refetchBankBalance,
		refetchAllowance,
	])

	useEffect(() => {
		if (isWithdrawSuccess) {
			refetchTokenBalance()
			refetchBankBalance()
			setWithdrawAmount("")
		}
	}, [isWithdrawSuccess, refetchTokenBalance, refetchBankBalance])

	const handleApprove = () => {
		if (!depositAmount) return
		approve({
			address: CONTRACTS.MyToken as AddressType,
			abi: TOKEN_ABI,
			functionName: "approve",
			args: [CONTRACTS.TokenBank as AddressType, parseEther(depositAmount)],
		})
	}

	const handleDeposit = () => {
		if (!depositAmount) return
		deposit({
			address: CONTRACTS.TokenBank as AddressType,
			abi: TOKEN_BANK_ABI,
			functionName: "deposit",
			args: [CONTRACTS.MyToken as AddressType, parseEther(depositAmount)],
		})
	}

	const handleDirectDeposit = () => {
		if (!directDepositAmount) return
		directDeposit({
			address: CONTRACTS.MyToken as AddressType,
			abi: TOKEN_ABI,
			functionName: "transferWithCallback",
			args: [
				CONTRACTS.TokenBank as AddressType,
				parseEther(directDepositAmount),
				"0x",
			],
		})
	}

	const handleWithdraw = () => {
		if (!withdrawAmount) return
		withdraw({
			address: CONTRACTS.TokenBank as AddressType,
			abi: TOKEN_BANK_ABI,
			functionName: "withdraw",
			args: [CONTRACTS.MyToken as AddressType, parseEther(withdrawAmount)],
		})
	}

	if (!isConnected) {
		return (
			<div className="text-center py-12">
				<h1 className="text-3xl font-bold mb-4 text-white">TokenBank</h1>
				<p className="text-gray-300">Please connect your wallet to continue.</p>
			</div>
		)
	}

	return (
		<div className="space-y-8">
			<div className="text-center">
				<h1 className="text-4xl font-bold mb-3 bg-clip-text text-transparent bg-linear-to-r from-indigo-400 via-fuchsia-400 to-cyan-400">
					TokenBank V2
				</h1>
				<p className="text-gray-300">
					Enhanced version with transferWithCallback hook support
				</p>
			</div>

			{/* Balances */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div className="p-6 rounded-xl border border-white/10 bg-white/5 backdrop-blur-md shadow-sm hover:shadow-lg transition">
					<h3 className="text-sm text-gray-300 mb-1">Wallet Token Balance</h3>
					<p className="text-3xl font-semibold text-white">
						{tokenBalance ? formatEther(tokenBalance as bigint) : "0"}{" "}
						{tokenSymbol || "RCH"}
					</p>
				</div>
				<div className="p-6 rounded-xl border border-white/10 bg-white/5 backdrop-blur-md shadow-sm hover:shadow-lg transition">
					<h3 className="text-sm text-gray-300 mb-1">Bank Deposit Balance</h3>
					<p className="text-3xl font-semibold text-white">
						{bankBalance ? formatEther(bankBalance as bigint) : "0"}{" "}
						{tokenSymbol || "RCH"}
					</p>
				</div>
			</div>

			{/* Transaction Status */}
			{(approveHash || depositHash || directDepositHash || withdrawHash) && (
				<div className="p-4 rounded-xl border border-blue-500/20 bg-blue-500/10 backdrop-blur-md">
					<h3 className="text-sm font-semibold text-blue-300 mb-2">
						Recent Transactions
					</h3>
					<div className="space-y-2">
						{approveHash && (
							<div className="flex items-center justify-between text-sm">
								<span className="text-gray-300">
									Approve:{" "}
									{isApproveConfirming
										? "Confirming..."
										: isApproveSuccess
											? "Success"
											: "Pending"}
								</span>
								<a
									href={`${EXPLORER_URL}${approveHash}`}
									target="_blank"
									rel="noopener noreferrer"
									className="text-blue-300 hover:text-blue-200 underline"
								>
									View on Etherscan
								</a>
							</div>
						)}
						{depositHash && (
							<div className="flex items-center justify-between text-sm">
								<span className="text-gray-300">
									Deposit:{" "}
									{isDepositConfirming
										? "Confirming..."
										: isDepositSuccess
											? "Success"
											: "Pending"}
								</span>
								<a
									href={`${EXPLORER_URL}${depositHash}`}
									target="_blank"
									rel="noopener noreferrer"
									className="text-blue-300 hover:text-blue-200 underline"
								>
									View on Etherscan
								</a>
							</div>
						)}
						{directDepositHash && (
							<div className="flex items-center justify-between text-sm">
								<span className="text-gray-300">
									Direct Deposit:{" "}
									{isDirectDepositConfirming
										? "Confirming..."
										: isDirectDepositSuccess
											? "Success"
											: "Pending"}
								</span>
								<a
									href={`${EXPLORER_URL}${directDepositHash}`}
									target="_blank"
									rel="noopener noreferrer"
									className="text-blue-300 hover:text-blue-200 underline"
								>
									View on Etherscan
								</a>
							</div>
						)}
						{withdrawHash && (
							<div className="flex items-center justify-between text-sm">
								<span className="text-gray-300">
									Withdraw:{" "}
									{isWithdrawConfirming
										? "Confirming..."
										: isWithdrawSuccess
											? "Success"
											: "Pending"}
								</span>
								<a
									href={`${EXPLORER_URL}${withdrawHash}`}
									target="_blank"
									rel="noopener noreferrer"
									className="text-blue-300 hover:text-blue-200 underline"
								>
									View on Etherscan
								</a>
							</div>
						)}
					</div>
				</div>
			)}

			{/* Direct Deposit Section (New Feature in V2) */}
			<div className="p-6 rounded-xl border-2 border-violet-500/30 bg-linear-to-r from-violet-500/10 to-cyan-500/10 backdrop-blur-md shadow-lg">
				<div className="flex items-start justify-between mb-4">
					<div>
						<h2 className="text-xl font-semibold text-white">
							Direct Deposit (One-Step)
						</h2>
						<p className="text-sm text-gray-300 mt-1">
							Use transferWithCallback - No approve needed!
						</p>
					</div>
					<span className="px-3 py-1 bg-linear-to-r from-violet-600 to-cyan-400 text-white text-xs font-semibold rounded-full shadow-sm">
						V2 Feature
					</span>
				</div>
				<div className="space-y-4">
					<div>
						<label className="block text-sm text-gray-300 mb-1">Amount</label>
						<input
							type="number"
							value={directDepositAmount}
							onChange={(e) => setDirectDepositAmount(e.target.value)}
							placeholder="Enter amount for direct deposit"
							className="w-full px-4 py-2 bg-white/5 border border-violet-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500/50 text-white placeholder:text-violet-200/40"
						/>
					</div>
					<button
						onClick={handleDirectDeposit}
						disabled={
							isDirectDepositing ||
							isDirectDepositConfirming ||
							!directDepositAmount
						}
						className="w-full px-4 py-2 rounded-lg transition-colors font-medium bg-linear-to-r from-violet-600 to-cyan-400 hover:from-violet-500 hover:to-cyan-300 text-white disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{isDirectDepositing || isDirectDepositConfirming
							? "Processing..."
							: "Direct Deposit (transferWithCallback)"}
					</button>
					<div className="text-xs text-gray-300 bg-white/5 p-3 rounded border border-violet-400/20">
						<strong>How it works:</strong> This uses transferWithCallback which
						automatically calls the TokenBank tokensReceived function,
						completing the deposit in a single transaction without needing
						separate approve!
					</div>
				</div>
			</div>

			{/* Traditional Deposit Section */}
			<div className="p-6 rounded-xl border border-white/10 bg-white/5 backdrop-blur-md shadow-sm">
				<div className="flex items-start justify-between mb-4">
					<h2 className="text-xl font-semibold text-white">
						Traditional Deposit (Two-Step)
					</h2>
					<span className="px-3 py-1 bg-linear-to-r from-gray-500 to-slate-400 text-white text-xs font-semibold rounded-full">
						V1 Compatible
					</span>
				</div>
				<div className="space-y-4">
					<div>
						<label className="block text-sm text-gray-300 mb-1">Amount</label>
						<input
							type="number"
							value={depositAmount}
							onChange={(e) => setDepositAmount(e.target.value)}
							placeholder="Enter amount to deposit"
							className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-white placeholder:text-gray-300/50"
						/>
					</div>
					<div className="text-sm text-gray-300">
						Current Allowance:{" "}
						{allowance ? formatEther(allowance as bigint) : "0"}{" "}
						{tokenSymbol || "RCH"}
					</div>
					<div className="flex gap-4">
						<button
							onClick={handleApprove}
							disabled={isApproving || isApproveConfirming || !depositAmount}
							className="flex-1 px-4 py-2 rounded-lg transition-colors font-medium bg-linear-to-r from-amber-500 to-orange-400 hover:from-amber-400 hover:to-orange-300 text-white disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{isApproving || isApproveConfirming ? "Approving..." : "Approve"}
						</button>
						<button
							onClick={handleDeposit}
							disabled={isDepositing || isDepositConfirming || !depositAmount}
							className="flex-1 px-4 py-2 rounded-lg transition-colors font-medium bg-linear-to-r from-indigo-600 to-blue-500 hover:from-indigo-500 hover:to-blue-400 text-white disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{isDepositing || isDepositConfirming
								? "Depositing..."
								: "Deposit"}
						</button>
					</div>
				</div>
			</div>

			{/* Withdraw Section */}
			<div className="p-6 rounded-xl border border-white/10 bg-white/5 backdrop-blur-md shadow-sm">
				<h2 className="text-xl font-semibold mb-4 text-white">
					Withdraw Tokens
				</h2>
				<div className="space-y-4">
					<div>
						<label className="block text-sm text-gray-200 mb-1">Amount</label>
						<input
							type="number"
							value={withdrawAmount}
							onChange={(e) => setWithdrawAmount(e.target.value)}
							placeholder="Enter amount to withdraw"
							className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-white placeholder:text-gray-400/50"
						/>
					</div>
					<button
						onClick={handleWithdraw}
						disabled={isWithdrawing || isWithdrawConfirming || !withdrawAmount}
						className="w-full px-4 py-2 rounded-lg transition-colors font-medium bg-linear-to-r from-emerald-600 to-lime-500 hover:from-emerald-500 hover:to-lime-400 text-white disabled:opacity-60 disabled:cursor-not-allowed"
					>
						{isWithdrawing || isWithdrawConfirming
							? "Withdrawing..."
							: "Withdraw"}
					</button>
				</div>
			</div>
		</div>
	)
}
