import { Metadata, Nft, SplToken } from '@/types'
import { fetchAllDigitalAssetWithTokenByOwner } from '@metaplex-foundation/mpl-token-metadata'
import { publicKey as createPublicKey } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { PublicKey } from '@solana/web3.js'
import { NextResponse } from 'next/server'

const HELIUS_API_KEY = process.env.HELIUS_API_KEY

export async function GET(request: Request) {
  try {
    const publicKeyParam = request.url.split('=')[1]
    const publicKey = new PublicKey(publicKeyParam)

    if (!publicKey) {
      return NextResponse.json({ error: 'Invalid public key' }, { status: 400 })
    }

    const umi = createUmi(`https://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`)
    const metaplexAssetsMetadata = await fetchAllDigitalAssetWithTokenByOwner(umi, createPublicKey(publicKey))

    // Build metadata map
    const metadataMap = new Map<string, Metadata>()
    for (const asset of metaplexAssetsMetadata) {
      const metadata = await fetch(asset.metadata.uri)
      const metadataJson = await metadata.json()

      if (!metadataJson) continue
      if (asset.token) metadataMap.set(asset.token.mint.toString(), metadataJson)
      metadataMap.set(asset.mint.toString(), metadataJson)
    }

    const tokens = await getTokensByOwner(publicKey.toString(), metadataMap)
    const nfts = await getNFTsByOwner(publicKey.toString(), metadataMap)

    return NextResponse.json({
      publicKey: publicKey.toString(),
      tokens,
      nfts,
    })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

const getTokensByOwner = async (ownerAddress: string, metadataMap: Map<string, Metadata>): Promise<SplToken[]> => {
  const response = await fetch(`https://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: '1',
      method: 'getTokenAccountsByOwner',
      params: [ownerAddress, { programId: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA' }, { encoding: 'jsonParsed' }],
    }),
  })

  const data = await response.json()

  return (
    data.result.value
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((token: any) => {
        const info = token.account.data.parsed.info
        const metadata = metadataMap.get(info.mint)
        if (!metadata || !metadata.name) return null

        if (!info.tokenAmount.decimals) return null

        return {
          mint: info.mint,
          amount: info.tokenAmount.amount,
          uiAmount: info.tokenAmount.uiAmount,
          decimals: info.tokenAmount.decimals,
          metadata,
        } as SplToken
      })
      .filter(Boolean)
  )
}

const getNFTsByOwner = async (ownerAddress: string, metadataMap: Map<string, Metadata>): Promise<Nft[]> => {
  const response = await fetch(`https://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: '1',
      method: 'getAssetsByOwner',
      params: {
        ownerAddress,
        page: 1,
        limit: 100,
      },
    }),
  })

  const data = await response.json()

  return (
    data.result.items
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((nft: any) => {
        const metadata = metadataMap.get(nft.id)
        if (!metadata || !metadata.name) return null

        return {
          mint: nft.id,
          metadata,
        } as Nft
      })
      .filter(Boolean)
  )
}
