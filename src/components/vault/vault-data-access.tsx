import { getVaultProgram, getVaultProgramId } from "@project/anchor";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Cluster, PublicKey } from "@solana/web3.js";
import { useMutation, useQuery } from "@tanstack/react-query";
import { BN } from "bn.js";
import { useMemo } from "react";
import { toast } from "sonner";
import { useCluster } from "../cluster/cluster-data-access";
import { useAnchorProvider } from "../solana/solana-provider";
import { TransactionToast } from "../use-transaction-toast";

export function useVaultProgram() {
  const { connection } = useConnection();
  const { cluster } = useCluster()

  // Anchor Config
  const provider = useAnchorProvider();
  const programId = useMemo(() => getVaultProgramId(cluster.network as Cluster), [cluster]);
  const program = useMemo(() => getVaultProgram(provider, programId), [provider, programId]);
  const wallet = useWallet()

  const accounts = useQuery({
    queryKey: ['vault-accounts', { endpoint: connection.rpcEndpoint }],
    queryFn: () => program.provider.connection.getProgramAccounts(programId),
    retry: 1,
  })

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  })

  const initializeVault = useMutation({
    mutationKey: ['initialize-vault', { cluster }],
    mutationFn: async ({ name, description }: { name: string; description: string }) => {
      if (!program) throw new Error('Program not initialized')

      if (!wallet?.publicKey) throw new Error("Wallet not connected")

      const [userStatePda] = await getUserStatePda(wallet.publicKey, programId);

      let userState
      try {
        userState = await program.account.userState.fetch(userStatePda)
      } catch {
        userState = { vaultCount: new BN(0) }
      }

      const vaultCount = userState ? userState.vaultCount.toNumber() + 1 : 1;
      const [vaultStatePda] = await getVaultStatePda(wallet.publicKey, vaultCount, programId);

      const vault = await program.methods
        .initialize(name, description)
        .accounts({
          signer: wallet.publicKey,
          vault: vaultStatePda,
        })
        .rpc()

      return vault
    },
    onSuccess: (signature: string) => {
      totalVaults.refetch()

      const showToast = TransactionToast("Transaction successful!", cluster.name);
      showToast(signature);
    },
    onError: (error) => {
      if (error instanceof Error) {
        toast.error(error.message);
      }
      console.error(error);
    },
  })

  const totalVaults = useQuery({
    queryKey: ['get-all-vaults', { cluster }],
    queryFn: async () => {
      const vaults = await program.account.vaultState.all()

      return vaults.filter((vault) => vault.account.owner.toBase58() !== wallet?.publicKey?.toBase58())
    },
  })

  return {
    program,
    accounts,
    getProgramAccount,
    initializeVault,
    totalVaults
  }
}

// -----HELPERS -----
export const getUserStatePda = async (userPubkey: PublicKey, programId: PublicKey) => {
  return await PublicKey.findProgramAddress([Buffer.from('user_state'), userPubkey.toBuffer()], programId)
}

export const getVaultStatePda = async (userPubkey: PublicKey, vaultId: number, programId: PublicKey) => {
  return await PublicKey.findProgramAddress(
    [Buffer.from('vault_state'), userPubkey.toBuffer(), Buffer.from(new BN(vaultId).toArray('le', 8))],
    programId,
  )
}
