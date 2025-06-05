import { bricolage } from "@/fonts/bricolage";
import { useWallet } from "@solana/wallet-adapter-react";
import { ClusterUiSelect } from "./cluster/cluster-ui";
import { WalletButton } from "./solana/solana-provider";

export default function AppHeader() {
  const { connected } = useWallet()

  return (
    <header className="w-full px-4 py-3 flex items-center justify-between md:px-8 h-16">
      <div className={`flex-1 flex justify-${connected ? 'start' : 'center'}`}>
        <h1 className={`${bricolage.className} text-2xl font-semibold`}>kosha</h1>
      </div>

      <div className="flex items-center gap-3">
        {connected && (
          <>
            <ClusterUiSelect />
            <WalletButton />
          </>
        )}
      </div>
    </header>
  );
}
