import * as anchor from '@coral-xyz/anchor'
import { PublicKey } from '@solana/web3.js'
import { BN } from 'bn.js'

export const provider = anchor.AnchorProvider.env()
anchor.setProvider(provider)

export const program = anchor.workspace.vault_dapp as anchor.Program

export const createUserAndAirdrop = async () => {
  const user = anchor.web3.Keypair.generate()
  const airdropSig = await provider.connection.requestAirdrop(user.publicKey, 5 * anchor.web3.LAMPORTS_PER_SOL)
  await provider.connection.confirmTransaction(airdropSig)
  return user
}

export const getUserStatePda = async (userPubkey: PublicKey) => {
  return await PublicKey.findProgramAddress([Buffer.from('user_state'), userPubkey.toBuffer()], program.programId)
}

export const getVaultStatePda = async (userPubkey: PublicKey, vaultId: number) => {
  return await PublicKey.findProgramAddress(
    [Buffer.from('vault_state'), userPubkey.toBuffer(), Buffer.from(new BN(vaultId).toArray('le', 8))],
    program.programId,
  )
}
