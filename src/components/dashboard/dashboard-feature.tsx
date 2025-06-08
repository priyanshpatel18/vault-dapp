'use client'

import { bricolage } from '@/fonts/bricolage'
import { Nft, SplToken } from '@/types'
import { useWallet } from '@solana/wallet-adapter-react'
import { motion } from 'framer-motion'
import { PlusIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { WalletButton } from '../solana/solana-provider'
import BackgroundHalo from '../ui/background'
import VaultSidePanel from '../vault-side-panel'
import { useVaultProgram } from '../vault/vault-data-access'
import VaultCreateModal, { Vaults } from '../vault/vault-ui'

export function DashboardFeature() {
  const { publicKey } = useWallet()
  const [isConnected, setConnected] = useState(false)
  const [assets, setAssets] = useState<{ nfts: Nft[]; tokens: SplToken[] } | null>(null)
  const [panelOpen, setPanelOpen] = useState(false)
  const { initializeVault } = useVaultProgram();
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (publicKey) {
      setConnected(true)
    } else {
      setConnected(false)
    }
  }, [publicKey])

  useEffect(() => {
    async function fetchAssets() {
      if (!publicKey) return
      const response = await fetch(`/api/get-user-assets?address=${publicKey.toBase58()}`)
      const data = await response.json()

      setAssets({
        nfts: data.nfts,
        tokens: data.tokens,
      })
    }
    fetchAssets()
  }, [publicKey])

  function handleCreateVault() {
    setModalOpen(true);
  }

  async function handleVaultSubmit(name: string, description: string) {
    try {
      initializeVault.mutateAsync({ name, description });
      setModalOpen(false);
    } catch (err) {
      console.error("Failed to initialize vault:", err);
    }
  }


  function handleConnect() {
    const button = document.querySelector('.wallet-adapter-button') as HTMLElement
    if (button) {
      button.click()
    }
  }

  return (
    <div className="flex flex-col py-8 mx-auto max-w-7xl">
      <BackgroundHalo />

      {isConnected ? (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col gap-6"
        >
          <motion.div
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <h1 className={`text-3xl font-bold text-foreground ${bricolage.className}`}>Welcome to kosha!</h1>

            <motion.button
              whileTap={{ scale: 0.98 }}
              className="bg-foreground text-primary-foreground px-4 py-2 rounded-lg font-semibold flex items-center gap-2 shadow-lg transition cursor-pointer"
              onClick={handleCreateVault}
            >
              <PlusIcon className="w-5 h-5" />
              Create a Vault
            </motion.button>
          </motion.div>

          <Vaults setPanelOpen={setPanelOpen} />

          <VaultCreateModal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            onSubmit={handleVaultSubmit}
          />

          {assets && (
            <VaultSidePanel
              isOpen={panelOpen}
              onClose={() => setPanelOpen(false)}
              tokens={assets.tokens}
              nfts={assets.nfts}
              onDeposit={(selectedAssets) => {
                console.log('Deposit to vault:', selectedAssets)
              }}
            />
          )}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
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
      )}
    </div>
  )
}
