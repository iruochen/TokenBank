import { getDefaultConfig } from "@rainbow-me/rainbowkit"
import { mainnet, sepolia, localhost } from "wagmi/chains"
import { cookieStorage, createStorage } from "wagmi"

console.log("project id: ", process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID)

export const config = getDefaultConfig({
	appName: "TokenBank DApp",
	projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || "",
	chains: [mainnet, sepolia, localhost],
	ssr: true,
	storage: createStorage({
		storage: cookieStorage,
	}),
})

if (!process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID) {
	// 在本地开发时提醒设置 WalletConnect 项目ID，避免出现“source 未授权”错误
	// 请在 .env.local 中添加 NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=你的ID
	console.warn(
		"[wagmi] Missing NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID. WalletConnect may fail with 'source not authorized'.",
	)
}
