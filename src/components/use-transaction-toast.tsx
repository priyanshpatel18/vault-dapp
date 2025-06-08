import { SquareArrowOutUpRightIcon } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export function TransactionToast(message?: string, cluster?: string) {
  // Determine explorer URL base
  const getExplorerUrl = (signature: string) => {
    const base = "https://explorer.solana.com/tx";

    switch (cluster) {
      case "mainnet":
        return `${base}/${signature}`;
      case "devnet":
        return `${base}/${signature}?cluster=devnet`;
      case "testnet":
        return `${base}/${signature}?cluster=testnet`;
      case "local":
        return `${base}/${signature}?cluster=custom&customUrl=${encodeURIComponent(
          "http://localhost:8899"
        )}`;
      default:
        return `${base}/${signature}?cluster=devnet`;
    }
  };

  return (signature: string) => {
    toast.success(
      <div className="flex items-center gap-1">
        <span>{message || "Transaction successful!"}</span>
        <Link
          target="_blank"
          rel="noopener noreferrer"
          href={getExplorerUrl(signature)}
          className="flex items-center gap-1 text-blue-500 underline"
        >
          View on Explorer
          <SquareArrowOutUpRightIcon className="w-3.5 h-3.5" />
        </Link>
      </div>
    );
  };
}
