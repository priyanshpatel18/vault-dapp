/* eslint-disable */

import * as anchor from '@coral-xyz/anchor'
import { Program } from '@coral-xyz/anchor'
import { Account, createMint, getOrCreateAssociatedTokenAccount, mintTo } from '@solana/spl-token'
import { SystemProgram } from '@solana/web3.js'
import { BN } from 'bn.js'
import { VaultDapp } from '../target/types/vault_dapp'
import { createUserAndAirdrop, getUserStatePda, getVaultStatePda } from './test-utils'

describe("action", () => {
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider);

  const program = anchor.workspace.vault_dapp as Program<VaultDapp>;

  let userTokenAccount: Account;
  let vaultTokenAccount: Account;
  let mint: anchor.web3.PublicKey;
  let vaultPda: anchor.web3.PublicKey;
  let bump: number;
  let userStatePda: anchor.web3.PublicKey;

  beforeAll(async () => {
    user = await createUserAndAirdrop();

    [userStatePda] = await getUserStatePda(user.publicKey);
    [vaultPda, bump] = await getVaultStatePda(user.publicKey, 1);

    await program.methods
      .initialize("Good Vault", "This is the best vault ever")
      .accounts({
        signer: user.publicKey,
        vault: vaultPda,
        userState: userStatePda,
        systemProgram: SystemProgram.programId,
      })
      .signers([user])
      .rpc();

    // Create mint
    mint = await createMint(
      provider.connection,
      user,
      user.publicKey,
      null,
      6
    );

    // Create user's ATA
    userTokenAccount = await getOrCreateAssociatedTokenAccount(
      provider.connection,
      user,
      mint,
      user.publicKey,
      true
    );

    vaultTokenAccount = await getOrCreateAssociatedTokenAccount(
      provider.connection,
      user,
      mint,
      vaultPda,
      true
    )

    // Mint tokens to user's ATA
    await mintTo(
      provider.connection,
      user,
      mint,
      userTokenAccount.address,
      user.publicKey,
      1_000_000
    );
  })

  let user: anchor.web3.Keypair;

  it("should deposit tokens to vault", async () => {
    await program.methods
      .deposit(new BN(1), new BN(1000000))
      .accounts({
        owner: user.publicKey,
        userTokenAccount: userTokenAccount.address,
        vaultTokenAccount: vaultTokenAccount.address,
        vault: vaultPda,
        userState: userStatePda,
        assetMint: mint,
      })
      .signers([user])
      .rpc();

    let vaultTokenAccountBalance = await provider.connection.getTokenAccountBalance(vaultTokenAccount.address);
    expect(vaultTokenAccountBalance.value.uiAmount).toBe(1);
  })

  it("should withdraw tokens from vault", async () => {
    await program.methods
      .withdraw(new BN(1), new BN(500000), bump)
      .accounts({
        owner: user.publicKey,
        userTokenAccount: userTokenAccount.address,
        vaultTokenAccount: vaultTokenAccount.address,
        vault: vaultPda,
        userState: userStatePda,
        assetMint: mint,
      })
      .signers([user])
      .rpc();

    let vaultTokenAccountBalance = await provider.connection.getTokenAccountBalance(userTokenAccount.address);
    expect(vaultTokenAccountBalance.value.uiAmount).toBe(0.5);
  })

  it("lock the vault", async () => {
    await program.methods
      .lock(new BN(1))
      .accounts({
        owner: user.publicKey,
        vault: vaultPda,
        userState: userStatePda
      })
      .signers([user])
      .rpc();

    const vaultState = await program.account.vaultState.fetch(vaultPda);
    expect(vaultState.isLocked).toBe(true);
  })

  it("unlock the vault", async () => {
    await program.methods
      .unlock(new BN(1))
      .accounts({
        owner: user.publicKey,
        vault: vaultPda,
        userState: userStatePda
      })
      .signers([user])
      .rpc();

    const vaultState = await program.account.vaultState.fetch(vaultPda);
    expect(vaultState.isLocked).toBe(false);
  })

  it("transfer ownership", async () => {
    const newOwner = anchor.web3.Keypair.generate();

    const [newUserStatePda] = await getUserStatePda(newOwner.publicKey);

    let userState;
    try {
      userState = await program.account.userState.fetch(newOwner.publicKey);
    } catch (_) {
      userState = { vaultCount: new BN(0) };
    }
    
    const vaultCount = userState.vaultCount.toNumber();

    const [vaultStatePda] = await getVaultStatePda(newOwner.publicKey, vaultCount + 1);

    await program.methods
      .transfer(new BN(1))
      .accounts({
        oldOwner: user.publicKey,
        oldVault: vaultPda,
        oldUserState: userStatePda,
        newOwner: newOwner.publicKey,
        newUserState: newUserStatePda,
        newVault: vaultStatePda
      })
      .signers([user])
      .rpc();

    const vaultState = await program.account.vaultState.fetch(vaultStatePda);
    expect(vaultState.owner.toBase58()).toBe(newOwner.publicKey.toBase58());
  })
})