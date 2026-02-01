"use client"

import { useAccount } from "wagmi"
import { useEffect, useState } from "react"
import { formatEther } from "viem"
import { ConnectWallet } from "../../components"

type Transfer = {
	tx_hash: string
	log_index: number
	from_address: string
	to_address: string
	amount: string
	block_number: number
	block_timestamp: string
	created_at: string
}

type ApiResponse = {
	data: Transfer[]
	pagination: {
		page: number
		limit: number
		totalItems: number
		totalPages: number
	}
}

const API_BASE_URL =
	process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"

export default function HistoryPage() {
	const { address, isConnected, isConnecting, isReconnecting } = useAccount()
	const [transfers, setTransfers] = useState<Transfer[]>([])
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [page, setPage] = useState(1)
	const [totalPages, setTotalPages] = useState(1)
	const [isMounted, setIsMounted] = useState(false)

	useEffect(() => {
		setIsMounted(true)
	}, [])

	useEffect(() => {
		if (isConnected && address) {
			fetchHistory(address, page)
		}
	}, [isConnected, address, page])

	const fetchHistory = async (addr: string, pageNum: number) => {
		setLoading(true)
		setError(null)
		try {
			const res = await fetch(
				`${API_BASE_URL}/transfers/${addr}?page=${pageNum}&limit=10`,
			)
			if (!res.ok) {
				throw new Error("Failed to fetch history")
			}
			const json: ApiResponse = await res.json()
			setTransfers(json.data)
			setTotalPages(json.pagination.totalPages)
		} catch (err) {
			console.error(err)
			setError("Failed to load transaction history. Please try again later.")
		} finally {
			setLoading(false)
		}
	}

	const formatDate = (timestamp: string) => {
		return new Date(Number(timestamp) * 1000).toLocaleString()
	}

	const shortenAddress = (addr: string) => {
		return `${addr.slice(0, 6)}...${addr.slice(-4)}`
	}

	if (!isMounted) return null

	if (isConnecting || isReconnecting) {
		return (
			<div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
				<div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
				<p className="text-gray-600">Connecting wallet...</p>
			</div>
		)
	}

	if (!isConnected) {
		return (
			<div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
				<h2 className="text-2xl font-bold text-gray-800">
					Wallet Not Connected
				</h2>
				<p className="text-gray-600">
					Please connect your wallet to view your transaction history.
				</p>
				<div className="mt-4">
					<ConnectWallet />
				</div>
			</div>
		)
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="text-3xl font-bold text-gray-900">
					Transaction History
				</h1>
				<button
					onClick={() => address && fetchHistory(address, page)}
					className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
				>
					Refresh
				</button>
			</div>

			{error && (
				<div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
					{error}
				</div>
			)}

			<div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
				<div className="overflow-x-auto">
					<table className="min-w-full divide-y divide-gray-200">
						<thead className="bg-gray-50">
							<tr>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Type
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Amount (RCH)
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									From
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									To
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Date
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Hash
								</th>
							</tr>
						</thead>
						<tbody className="bg-white divide-y divide-gray-200">
							{loading ? (
								<tr>
									<td colSpan={6} className="px-6 py-12 text-center">
										<div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
									</td>
								</tr>
							) : transfers.length === 0 ? (
								<tr>
									<td
										colSpan={6}
										className="px-6 py-12 text-center text-gray-500"
									>
										No transactions found
									</td>
								</tr>
							) : (
								transfers.map((tx) => {
									const isIncoming =
										tx.to_address.toLowerCase() === address?.toLowerCase()
									return (
										<tr
											key={`${tx.tx_hash}-${tx.log_index}`}
											className="hover:bg-gray-50 transition-colors"
										>
											<td className="px-6 py-4 whitespace-nowrap">
												<span
													className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
														isIncoming
															? "bg-green-100 text-green-800"
															: "bg-amber-100 text-amber-800"
													}`}
												>
													{isIncoming ? "Receive" : "Send"}
												</span>
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
												{isIncoming ? "+" : "-"}
												{formatEther(BigInt(tx.amount))}
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
												{tx.from_address.toLowerCase() ===
												address?.toLowerCase() ? (
													<span className="text-gray-900 font-medium">Me</span>
												) : (
													shortenAddress(tx.from_address)
												)}
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
												{tx.to_address.toLowerCase() ===
												address?.toLowerCase() ? (
													<span className="text-gray-900 font-medium">Me</span>
												) : (
													shortenAddress(tx.to_address)
												)}
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
												{formatDate(tx.block_timestamp)}
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 hover:text-blue-800">
												<a
													href={`https://sepolia.etherscan.io/tx/${tx.tx_hash}`}
													target="_blank"
													rel="noopener noreferrer"
													title={tx.tx_hash}
												>
													View
												</a>
											</td>
										</tr>
									)
								})
							)}
						</tbody>
					</table>
				</div>

				{/* Pagination */}
				{totalPages > 1 && (
					<div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
						<div className="flex-1 flex justify-between sm:hidden">
							<button
								onClick={() => setPage((p) => Math.max(1, p - 1))}
								disabled={page === 1}
								className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
							>
								Previous
							</button>
							<button
								onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
								disabled={page === totalPages}
								className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
							>
								Next
							</button>
						</div>
						<div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
							<div>
								<p className="text-sm text-gray-700">
									Showing page <span className="font-medium">{page}</span> of{" "}
									<span className="font-medium">{totalPages}</span>
								</p>
							</div>
							<div>
								<nav
									className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
									aria-label="Pagination"
								>
									<button
										onClick={() => setPage((p) => Math.max(1, p - 1))}
										disabled={page === 1}
										className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
									>
										<span className="sr-only">Previous</span>
										&larr;
									</button>
									<button
										onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
										disabled={page === totalPages}
										className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
									>
										<span className="sr-only">Next</span>
										&rarr;
									</button>
								</nav>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	)
}
