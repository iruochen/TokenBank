"use client"

import dynamic from "next/dynamic"
import React from "react"

// Dynamically import the core provider with SSR disabled
// This prevents the 'indexedDB is not defined' error during build
// because WalletConnect/Wagmi config (which uses window/indexedDB) is never evaluated on the server.
const Web3ProviderCore = dynamic(() => import("./Web3ProviderCore"), {
	ssr: false,
})

export function Web3Provider({ children }: { children: React.ReactNode }) {
	return <Web3ProviderCore>{children}</Web3ProviderCore>
}
