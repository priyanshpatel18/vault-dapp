import type { MetadataRoute } from 'next'

const { appName, description } = {
  appName: 'Kosha – Secure Vault for Solana',
  description:
    "Kosha is a secure and decentralized vault dApp built on Solana, enabling fast and trustless storage of digital assets.",
}

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: appName,
    short_name: appName,
    description: description,
    start_url: '/',
    display: 'standalone',
    background_color: '#fff',
    theme_color: '#fff',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  }
}