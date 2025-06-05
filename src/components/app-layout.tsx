'use client'

import { AccountChecker } from '@/components/account/account-ui'
import AppHeader from '@/components/app-header'
import { ClusterChecker } from '@/components/cluster/cluster-ui'
import React from 'react'
import { ThemeProvider } from './theme-provider'
import { Toaster } from './ui/sonner'

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <div className="flex flex-col">
        <AppHeader />
        <main className="flex-grow container mx-auto p-4">
          <ClusterChecker>
            <AccountChecker />
          </ClusterChecker>
          {children}
        </main>
      </div>
      <Toaster />
    </ThemeProvider>
  )
}
