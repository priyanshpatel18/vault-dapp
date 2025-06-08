/* eslint-disable */

import * as anchor from '@coral-xyz/anchor'
import { Program } from '@coral-xyz/anchor'
import { SystemProgram } from '@solana/web3.js'
import { BN } from 'bn.js'
import { VaultDapp } from '../target/types/vault_dapp'
import { createUserAndAirdrop, getUserStatePda, getVaultStatePda } from './test-utils'

describe('initialize', () => {
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)

  const program = anchor.workspace.vault_dapp as Program<VaultDapp>

  let user: anchor.web3.Keypair

  beforeAll(async () => {
    user = await createUserAndAirdrop()
  })

  const valid_name = 'Good Vault'
  const valid_desc = 'This is the best vault ever'

  const invalid_name = 'Bad Vault because the name is too long than 32 characters'

  it('Initialize Vault', async () => {
    const [userStatePda] = await getUserStatePda(user.publicKey)

    let userState
    try {
      userState = await program.account.userState.fetch(userStatePda)
    } catch (_) {
      userState = { vaultCount: new BN(0) }
    }

    const vaultCount = userState.vaultCount.toNumber()

    const [vaultStatePda] = await getVaultStatePda(user.publicKey, vaultCount + 1)
    await program.methods
      .initialize(valid_name, valid_desc)
      .accounts({
        signer: user.publicKey,
        vault: vaultStatePda,
        userState: userStatePda,
        systemProgram: SystemProgram.programId,
      })
      .signers([user])
      .rpc()

    const userStateAfter = await program.account.userState.fetch(userStatePda)
    expect(userStateAfter.vaultCount.toNumber()).toBe(vaultCount + 1)
  })

  it('Initialize Another Vault', async () => {
    const [userStatePda] = await getUserStatePda(user.publicKey)

    const userState = await program.account.userState.fetch(userStatePda)

    const vaultCount = userState.vaultCount.toNumber()

    const [vaultStatePda] = await getVaultStatePda(user.publicKey, vaultCount + 1)
    await program.methods
      .initialize(valid_name, valid_desc)
      .accounts({
        signer: user.publicKey,
        vault: vaultStatePda,
        userState: userStatePda,
        systemProgram: SystemProgram.programId,
      })
      .signers([user])
      .rpc()

    const userStateAfter = await program.account.userState.fetch(userStatePda)
    expect(userStateAfter.vaultCount.toNumber()).toBe(vaultCount + 1)
  })

  it('Fails Vault Initialization', async () => {
    const [userStatePda] = await getUserStatePda(user.publicKey)

    const userState = await program.account.userState.fetch(userStatePda)

    const vaultCount = userState.vaultCount.toNumber()

    const [vaultStatePda] = await getVaultStatePda(user.publicKey, vaultCount + 1)
    try {
      await program.methods
        .initialize(invalid_name, valid_desc)
        .accounts({
          signer: user.publicKey,
          vault: vaultStatePda,
          userState: userStatePda,
          systemProgram: SystemProgram.programId,
        })
        .signers([user])
        .rpc()
    } catch (error) {
      if (error instanceof Error) {
        expect(error.message).toContain('Name should be less than 32 characters.')
      }
    }
  })
})
