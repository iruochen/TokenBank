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
import { ConnectWallet } from "../components"
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
			<div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8 py-20">
				<div className="max-w-2xl px-4">
					<h1 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-linear-to-r from-blue-600 via-indigo-600 to-violet-600 mb-6 tracking-tight">
						Welcome to TokenBank
					</h1>
					<p className="text-slate-600 text-xl leading-relaxed">
						Your secure decentralized vault for token management.
						<br className="hidden md:block" />
						Deposit, withdraw, and track your assets with ease.
					</p>
				</div>

				<div className="p-8 bg-white rounded-2xl shadow-xl shadow-indigo-100 border border-slate-100 transform hover:scale-105 transition-all duration-300">
					<div className="flex flex-col items-center space-y-4">
						<div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mb-2">
							<svg
								className="w-8 h-8 text-indigo-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
								></path>
							</svg>
						</div>
						<p className="text-slate-500 font-medium mb-4">
							Connect wallet to get started
						</p>
						<div className="[&>div]:justify-center!">
							<ConnectWallet />
						</div>
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left max-w-4xl mx-auto px-4 mt-12">
					<div className="p-4 bg-white/50 rounded-lg border border-slate-100">
						<h3 className="font-semibold text-slate-900 mb-1">
							Secure Storage
						</h3>
						<p className="text-slate-500 text-sm">
							Assets are stored in a smart contract bank.
						</p>
					</div>
					<div className="p-4 bg-white/50 rounded-lg border border-slate-100">
						<h3 className="font-semibold text-slate-900 mb-1">
							Easy Transfers
						</h3>
						<p className="text-slate-500 text-sm">
							Deposit and withdraw tokens instantly.
						</p>
					</div>
					<div className="p-4 bg-white/50 rounded-lg border border-slate-100">
						<h3 className="font-semibold text-slate-900 mb-1">Decentralized</h3>
						<p className="text-slate-500 text-sm">
							Full control over your funds, always.
						</p>
					</div>
				</div>
			</div>
		)
	}

	return (
		<div className="space-y-8 max-w-5xl mx-auto">
			<div className="text-center py-8">
				<h1 className="text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-linear-to-r from-indigo-600 via-purple-600 to-cyan-600 tracking-tight">
					TokenBank Dashboard
				</h1>
				<p className="text-slate-500 text-lg">
					Manage your RCH tokens with advanced V2 features
				</p>
			</div>

			{/* Balances */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<div className="p-8 rounded-2xl bg-white border border-slate-100 shadow-lg shadow-slate-100/50 hover:shadow-xl transition-shadow duration-300">
					<h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">
						Wallet Balance
					</h3>
					<div className="flex items-baseline gap-2">
						<span className="text-4xl font-bold text-slate-800">
							{tokenBalance ? formatEther(tokenBalance as bigint) : "0"}
						</span>
						<span className="text-indigo-600 font-bold bg-indigo-50 px-2 py-1 rounded-md text-sm">
							{tokenSymbol || "RCH"}
						</span>
					</div>
				</div>
				<div className="p-8 rounded-2xl bg-white border border-slate-100 shadow-lg shadow-slate-100/50 hover:shadow-xl transition-shadow duration-300">
					<h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">
						Bank Deposit
					</h3>
					<div className="flex items-baseline gap-2">
						<span className="text-4xl font-bold text-slate-800">
							{bankBalance ? formatEther(bankBalance as bigint) : "0"}
						</span>
						<span className="text-indigo-600 font-bold bg-indigo-50 px-2 py-1 rounded-md text-sm">
							{tokenSymbol || "RCH"}
						</span>
					</div>
				</div>
			</div>

			{/* Transaction Status */}
			{(approveHash || depositHash || directDepositHash || withdrawHash) && (
				<div className="p-4 rounded-xl border border-blue-200 bg-blue-50 shadow-sm">
					<h3 className="text-sm font-semibold text-blue-700 mb-2 flex items-center gap-2">
						<span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
						Recent Activity
					</h3>
					<div className="space-y-2 pl-4">
						{approveHash && (
							<div className="flex items-center justify-between text-sm">
								<span className="text-slate-600">
									Approve:{" "}
									<span className="font-medium text-slate-900">
										{isApproveConfirming
											? "Confirming..."
											: isApproveSuccess
												? "Success"
												: "Pending"}
									</span>
								</span>
								<a
									href={`${EXPLORER_URL}${approveHash}`}
									target="_blank"
									rel="noopener noreferrer"
									className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
								>
									View on Etherscan
								</a>
							</div>
						)}
						{depositHash && (
							<div className="flex items-center justify-between text-sm">
								<span className="text-slate-600">
									Deposit:{" "}
									<span className="font-medium text-slate-900">
										{isDepositConfirming
											? "Confirming..."
											: isDepositSuccess
												? "Success"
												: "Pending"}
									</span>
								</span>
								<a
									href={`${EXPLORER_URL}${depositHash}`}
									target="_blank"
									rel="noopener noreferrer"
									className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
								>
									View on Etherscan
								</a>
							</div>
						)}
						{directDepositHash && (
							<div className="flex items-center justify-between text-sm">
								<span className="text-slate-600">
									Direct Deposit:{" "}
									<span className="font-medium text-slate-900">
										{isDirectDepositConfirming
											? "Confirming..."
											: isDirectDepositSuccess
												? "Success"
												: "Pending"}
									</span>
								</span>
								<a
									href={`${EXPLORER_URL}${directDepositHash}`}
									target="_blank"
									rel="noopener noreferrer"
									className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
								>
									View on Etherscan
								</a>
							</div>
						)}
						{withdrawHash && (
							<div className="flex items-center justify-between text-sm">
								<span className="text-slate-600">
									Withdraw:{" "}
									<span className="font-medium text-slate-900">
										{isWithdrawConfirming
											? "Confirming..."
											: isWithdrawSuccess
												? "Success"
												: "Pending"}
									</span>
								</span>
								<a
									href={`${EXPLORER_URL}${withdrawHash}`}
									target="_blank"
									rel="noopener noreferrer"
									className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
								>
									View on Etherscan
								</a>
							</div>
						)}
					</div>
				</div>
			)}

			{/* Direct Deposit Section (New Feature in V2) */}
			<div className="p-8 rounded-2xl border border-violet-100 bg-white shadow-xl shadow-violet-100/50 relative overflow-hidden group">
				<div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
					<svg
						className="w-32 h-32 text-violet-500"
						fill="currentColor"
						viewBox="0 0 24 24"
					>
						<path d="M13 10V3L4 14h7v7l9-11h-7z" />
					</svg>
				</div>
				<div className="flex items-start justify-between mb-8 relative z-10">
					<div>
						<h2 className="text-2xl font-bold text-slate-800">
							Direct Deposit
						</h2>
						<p className="text-slate-500 mt-1">
							One-step deposit using{" "}
							<code className="bg-violet-50 text-violet-700 px-1 py-0.5 rounded text-xs font-mono">
								transferWithCallback
							</code>
						</p>
					</div>
					<span className="px-3 py-1 bg-violet-100 text-violet-700 text-xs font-bold rounded-full border border-violet-200">
						RECOMMENDED
					</span>
				</div>
				<div className="space-y-6 relative z-10">
					<div>
						<label className="block text-sm font-medium text-slate-700 mb-2">
							Deposit Amount
						</label>
						<div className="relative">
							<input
								type="number"
								value={directDepositAmount}
								onChange={(e) => setDirectDepositAmount(e.target.value)}
								placeholder="0.0"
								className="w-full pl-4 pr-20 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 text-slate-900 placeholder:text-slate-400 transition-all font-mono text-lg"
							/>
							<div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-sm">
								{tokenSymbol || "RCH"}
							</div>
						</div>
					</div>
					<button
						onClick={handleDirectDeposit}
						disabled={
							isDirectDepositing ||
							isDirectDepositConfirming ||
							!directDepositAmount
						}
						className="w-full py-3.5 rounded-xl transition-all font-bold text-white bg-linear-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.99]"
					>
						{isDirectDepositing || isDirectDepositConfirming
							? "Processing Transaction..."
							: "Instant Deposit"}
					</button>
					<div className="flex items-start gap-3 text-sm text-slate-500 bg-violet-50/50 p-4 rounded-xl border border-violet-100">
						<svg
							className="w-5 h-5 text-violet-500 shrink-0 mt-0.5"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
							></path>
						</svg>
						<span>
							<strong>Smart Feature:</strong> Automatically handles token
							transfer and deposit logic in a single transaction. No prior
							approval required.
						</span>
					</div>
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				{/* Traditional Deposit Section */}
				<div className="p-8 rounded-2xl border border-slate-100 bg-white shadow-lg shadow-slate-100/50">
					<div className="flex items-start justify-between mb-6">
						<h2 className="text-xl font-bold text-slate-800">
							Standard Deposit
						</h2>
						<span className="px-2 py-1 bg-slate-100 text-slate-500 text-xs font-semibold rounded-md border border-slate-200">
							Legacy V1
						</span>
					</div>
					<div className="space-y-6">
						<div>
							<label className="block text-sm font-medium text-slate-700 mb-2">
								Amount
							</label>
							<div className="relative">
								<input
									type="number"
									value={depositAmount}
									onChange={(e) => setDepositAmount(e.target.value)}
									placeholder="0.0"
									className="w-full pl-4 pr-16 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 placeholder:text-slate-400 transition-all"
								/>
							</div>
						</div>
						<div className="text-xs font-medium text-slate-500 flex justify-between bg-slate-50 p-2 rounded-lg">
							<span>Current Allowance:</span>
							<span className="font-mono text-slate-700">
								{allowance ? formatEther(allowance as bigint) : "0"}{" "}
								{tokenSymbol || "RCH"}
							</span>
						</div>
						<div className="grid grid-cols-2 gap-3">
							<button
								onClick={handleApprove}
								disabled={isApproving || isApproveConfirming || !depositAmount}
								className="px-4 py-2.5 rounded-xl font-semibold text-white bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
							>
								{isApproving || isApproveConfirming
									? "Approving..."
									: "1. Approve"}
							</button>
							<button
								onClick={handleDeposit}
								disabled={isDepositing || isDepositConfirming || !depositAmount}
								className="px-4 py-2.5 rounded-xl font-semibold text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
							>
								{isDepositing || isDepositConfirming
									? "Depositing..."
									: "2. Deposit"}
							</button>
						</div>
					</div>
				</div>

				{/* Withdraw Section */}
				<div className="p-8 rounded-2xl border border-slate-100 bg-white shadow-lg shadow-slate-100/50">
					<h2 className="text-xl font-bold mb-6 text-slate-800">Withdraw</h2>
					<div className="space-y-6">
						<div>
							<label className="block text-sm font-medium text-slate-700 mb-2">
								Amount
							</label>
							<div className="relative">
								<input
									type="number"
									value={withdrawAmount}
									onChange={(e) => setWithdrawAmount(e.target.value)}
									placeholder="0.0"
									className="w-full pl-4 pr-16 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900 placeholder:text-slate-400 transition-all"
								/>
							</div>
						</div>
						<div className="h-8.5 hidden md:block"></div>{" "}
						{/* Spacer to align slightly with the left card allowance box if needed, or just let it flow */}
						<button
							onClick={handleWithdraw}
							disabled={
								isWithdrawing || isWithdrawConfirming || !withdrawAmount
							}
							className="w-full py-3 rounded-xl font-semibold text-white bg-teal-600 hover:bg-teal-500 disabled:opacity-60 disabled:cursor-not-allowed transition-colors shadow-sm hover:shadow-md mt-auto"
						>
							{isWithdrawing || isWithdrawConfirming
								? "Withdrawing..."
								: "Withdraw Funds"}
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}
