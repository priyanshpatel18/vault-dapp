import { Metadata } from 'next'

const { title, description, ogImage, baseURL } = {
  title: 'Kosha – Secure Vault for Solana',
  description: 'Kosha is a secure and decentralized vault dApp built on Solana, enabling fast and trustless storage of digital assets.',
  baseURL: 'https://kosha.priyanshpatel.com',
  ogImage: `https://kosha.priyanshpatel.com/open-graph.png`,
}

export const siteConfig: Metadata = {
  title,
  description,
  metadataBase: new URL(baseURL),
  openGraph: {
    title,
    description,
    images: [ogImage],
    url: baseURL,
    siteName: 'Kosha – Solana Vault dApp',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ogImage,
    creator: '@priyansh_ptl18',
    site: '@priyansh_ptl18',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  applicationName: 'Kosha – Solana Vault dApp',
  alternates: {
    canonical: baseURL,
  },
  keywords: [
    'Solana',
    'Vault',
    'Kosha',
    'DeFi',
    'dApp',
    'Web3',
    'crypto vault',
    'Solana dApp',
    'secure storage',
    'Priyansh Patel',
  ],
  authors: [
    {
      name: 'Priyansh Patel',
      url: 'https://priyanshpatel.com',
    },
  ],
  creator: 'Priyansh Patel',
  publisher: 'Priyansh Patel',
}