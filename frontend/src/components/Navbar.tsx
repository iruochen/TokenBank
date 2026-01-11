"use client"

import { ConnectWallet } from "./ConnectWallet"

export function Navbar() {
	return (
		<nav className="sticky top-0 z-20 bg-black/30 backdrop-blur border-b border-white/10">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between h-16">
					<div className="shrink-0">
						<span className="text-xl font-bold bg-clip-text text-transparent bg-linear-to-r from-indigo-400 via-fuchsia-400 to-cyan-400">
							TokenBank
						</span>
					</div>
					<div className="flex items-center gap-3">
						<ConnectWallet />
					</div>
				</div>
			</div>
		</nav>
	)
}
