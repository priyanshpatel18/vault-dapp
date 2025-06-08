export interface SplToken {
  mint: string
  amount: string
  uiAmount: number
  decimals: number
  metadata: Metadata
}

export interface Nft {
  mint: string
  metadata: Metadata
}

export interface Metadata {
  name: string
  symbol: string
  image: string
  description: string
}
