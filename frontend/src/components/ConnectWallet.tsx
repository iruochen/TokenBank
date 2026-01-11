"use client"
import { ConnectButton } from "@rainbow-me/rainbowkit"

export const ConnectWallet = () => {
	return (
		<div className="min-w-45 flex justify-end">
			<ConnectButton
				accountStatus="address"
				chainStatus="icon"
				showBalance={false}
			/>
		</div>
	)
}
