"use client"

import Link from "next/link"
import { ConnectWallet } from "./ConnectWallet"

export function Navbar() {
	return (
		<nav className="sticky top-0 z-20 bg-white/70 backdrop-blur border-b border-gray-200">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between h-16">
					<div className="shrink-0">
						<span className="text-xl font-bold bg-clip-text text-transparent bg-linear-to-r from-blue-500 via-yellow-400 to-green-400">
							TokenBank
						</span>
					</div>
					<div className="hidden md:flex items-center space-x-8">
						<Link
							href="/"
							className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
						>
							Bank
						</Link>
						<Link
							href="/history"
							className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
						>
							History
						</Link>
					</div>
					<div className="flex items-center gap-3">
						<ConnectWallet />
					</div>
				</div>
			</div>
		</nav>
	)
}
