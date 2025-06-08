'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { XIcon } from 'lucide-react'
import { useState } from 'react'
import { SplToken, Nft } from '@/types'

interface VaultSidePanelProps {
  isOpen: boolean
  onClose: () => void
  tokens: SplToken[]
  nfts: Nft[]
  onDeposit: (assets: { tokens: SplToken[]; nfts: Nft[] }) => void
}

export default function VaultSidePanel({ isOpen, onClose, tokens, nfts, onDeposit }: VaultSidePanelProps) {
  const [tab, setTab] = useState<'tokens' | 'nfts'>('tokens')
  const [selectedTokens, setSelectedTokens] = useState<Set<string>>(new Set())
  const [selectedNfts, setSelectedNfts] = useState<Set<string>>(new Set())

  const toggleToken = (mint: string) => {
    setSelectedTokens((prev) => {
      const next = new Set(prev)
      if (next.has(mint)) {
        next.delete(mint)
      } else {
        next.add(mint)
      }
      return next
    })
  }

  const toggleNft = (mint: string) => {
    setSelectedNfts((prev) => {
      const next = new Set(prev)
      if (next.has(mint)) {
        next.delete(mint)
      } else {
        next.add(mint)
      }
      return next
    })
  }

  const handleDeposit = () => {
    onDeposit({
      tokens: tokens.filter((t) => selectedTokens.has(t.mint)),
      nfts: nfts.filter((n) => selectedNfts.has(n.mint)),
    })
    onClose()
  }

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: isOpen ? 0 : '100%' }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white dark:bg-zinc-900 shadow-xl z-50 flex flex-col p-4"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">Select Assets</h2>
        <button onClick={onClose}>
          <XIcon className="w-5 h-5 text-zinc-500 hover:text-zinc-800 dark:hover:text-white" />
        </button>
      </div>

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setTab('tokens')}
          className={`px-3 py-1 rounded-md text-sm font-medium transition ${
            tab === 'tokens' ? 'bg-foreground text-primary-foreground' : 'bg-background text-primary'
          }`}
        >
          Tokens
        </button>
        <button
          onClick={() => setTab('nfts')}
          className={`px-3 py-1 rounded-md text-sm font-medium transition ${
            tab === 'nfts' ? 'bg-foreground text-primary-foreground' : 'bg-background text-primary'
          }`}
        >
          NFTs
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4">
        {tab === 'tokens' &&
          tokens.map((token) => (
            <div
              key={token.mint}
              className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer ${
                selectedTokens.has(token.mint) ? 'bg-zinc-300 dark:bg-zinc-700' : 'bg-zinc-100 dark:bg-zinc-800'
              }`}
              onClick={() => toggleToken(token.mint)}
            >
              <Image
                src={
                  token.metadata.image ||
                  'https://andreaslloyd.dk/wp-content/themes/koji/assets/images/default-fallback-image.png'
                }
                alt={token.metadata.name}
                width={48}
                height={48}
                className="rounded-md object-cover"
                unoptimized
              />
              <div className="flex flex-col">
                <span className="font-semibold text-foreground">{token.metadata.name}</span>
                <span className="text-sm text-muted-foreground">
                  {token.uiAmount} {token.metadata.symbol}
                </span>
              </div>
            </div>
          ))}

        {tab === 'nfts' &&
          nfts.map((nft) => (
            <div
              key={nft.mint}
              className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer ${
                selectedNfts.has(nft.mint) ? 'bg-zinc-300 dark:bg-zinc-700' : 'bg-zinc-100 dark:bg-zinc-800'
              }`}
              onClick={() => toggleNft(nft.mint)}
            >
              <Image
                src={
                  nft.metadata.image ||
                  'https://andreaslloyd.dk/wp-content/themes/koji/assets/images/default-fallback-image.png'
                }
                alt={nft.metadata.name}
                width={48}
                height={48}
                className="rounded-md object-cover"
                unoptimized
              />
              <div className="flex flex-col">
                <span className="font-semibold text-foreground">{nft.metadata.name}</span>
                <span className="text-sm text-muted-foreground line-clamp-1">{nft.metadata.description}</span>
              </div>
            </div>
          ))}
      </div>

      {/* Deposit Button */}
      <button
        onClick={handleDeposit}
        className="mt-4 w-full bg-foreground text-primary-foreground px-4 py-2 rounded-lg font-medium transition hover:opacity-90"
      >
        Deposit to Vault
      </button>
    </motion.div>
  )
}
