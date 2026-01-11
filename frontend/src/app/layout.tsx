import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { Navbar, Web3Provider } from "../components"

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
})

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
})

export const metadata: Metadata = {
	title: "Token Bank",
	description: "A simple token bank DApp",
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground min-h-screen`}
			>
				<Web3Provider>
					<Navbar />
					<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
						{children}
					</main>
				</Web3Provider>
			</body>
		</html>
	)
}
