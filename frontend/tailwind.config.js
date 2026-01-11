import defaultTheme from "tailwindcss/defaultTheme"

/** @type {import('tailwindcss').Config} */
export default {
	darkMode: false, // 关闭暗色模式
	content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
	theme: {
		extend: {
			colors: {
				primary: {
					DEFAULT: "#2563eb", // 明亮蓝色
					light: "#60a5fa",
					dark: "#1e40af",
				},
				secondary: {
					DEFAULT: "#fbbf24", // 明亮黄色
					light: "#fef08a",
					dark: "#b45309",
				},
				background: {
					DEFAULT: "#f8fafc", // 明亮背景
					light: "#ffffff",
					dark: "#e5e7eb",
				},
				foreground: {
					DEFAULT: "#1e293b", // 深色文字
					light: "#334155",
					dark: "#0f172a",
				},
			},
			fontFamily: {
				sans: ["var(--font-geist-sans)", ...defaultTheme.fontFamily.sans],
				mono: ["var(--font-geist-mono)", ...defaultTheme.fontFamily.mono],
			},
		},
	},
	plugins: [],
}
