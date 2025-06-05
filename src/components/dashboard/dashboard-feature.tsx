"use client";

import { bricolage } from "@/fonts/bricolage";
import { motion } from "framer-motion";
import { WalletButton } from "../solana/solana-provider";
import BackgroundHalo from "../ui/background";

export function DashboardFeature() {
  function handleConnect() {
    const button = document.querySelector('.wallet-adapter-button') as HTMLElement
    if (button) {
      button.click()
    }
  }

  return (
    <div>
      <BackgroundHalo />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="absolute top-16 inset-x-0 flex flex-col items-center justify-center h-[calc(100vh-4rem)] px-4 text-center space-y-6"
      >
        <motion.h1
          className={`text-4xl sm:text-6xl font-bold leading-tight text-foreground ${bricolage.className}`}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          kosha
        </motion.h1>

        <motion.p
          className="text-base sm:text-lg text-muted-foreground max-w-md"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          A secure Solana vault dApp to deposit, lock, and manage your assets confidently.
        </motion.p>

        <button
          onClick={handleConnect}
          className="relative inline-flex h-11 sm:h-12 w-full sm:w-auto overflow-hidden rounded-full p-[1px] transition-all"
        >
          <span className="absolute inset-[-150%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)] dark:bg-[conic-gradient(from_90deg_at_50%_50%,#393BB2_0%,#E2CBFF_50%,#393BB2_100%)]" />
          <span className="relative z-10 inline-flex h-full w-full items-center justify-center rounded-full bg-background px-5 py-2 text-sm font-medium backdrop-blur-md hover:opacity-90 transition">
            Connect Wallet
          </span>
        </button>

        <div className="hidden">
          <WalletButton />
        </div>
      </motion.div>
    </div>
  )
}
