"use client";

import { motion } from "framer-motion";
import { Lock, XIcon } from "lucide-react";
import { Dispatch, SetStateAction, useMemo, useState } from "react";
import { useVaultProgram, useVaultProgramAccount } from "./vault-data-access";

interface VaultCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string, description: string) => void;
}

export default function VaultCreateModal({
  isOpen,
  onClose,
  onSubmit,
}: VaultCreateModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (name.length > 32) {
      setError("Name must be at most 32 characters.");
      return;
    }
    if (description.length > 128) {
      setError("Description must be at most 128 characters.");
      return;
    }
    onSubmit(name, description);
    setName("");
    setDescription("");
    setError("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-background bg-opacity-50 z-40 flex items-center justify-center">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white dark:bg-zinc-900 rounded-lg p-6 w-full max-w-md shadow-lg relative"
      >
        <button className="absolute top-3 right-3 text-zinc-500 hover:text-foreground" onClick={onClose}>
          <XIcon className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-semibold mb-4">Create New Vault</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Vault Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mt-1 px-3 py-2 rounded-md bg-zinc-100 dark:bg-zinc-800 text-foreground"
              maxLength={32}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full mt-1 px-3 py-2 rounded-md bg-zinc-100 dark:bg-zinc-800 text-foreground"
              rows={3}
              maxLength={128}
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>

        <button
          onClick={handleSubmit}
          className="mt-6 w-full bg-foreground text-primary-foreground px-4 py-2 rounded-lg font-medium transition hover:opacity-90"
        >
          Initialize Vault
        </button>
      </motion.div>
    </div>
  );
}

export function Vaults({ setPanelOpen }: { setPanelOpen: Dispatch<SetStateAction<boolean>> }) {
  const { totalVaults } = useVaultProgram()
  const { lockVault, unlockVault } = useVaultProgramAccount()
  const userVaults = useMemo(() => totalVaults.data, [totalVaults.data]);

  return userVaults && userVaults.length > 0 ? (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {userVaults.map((vault) => (
        <div
          key={vault.publicKey.toBase58()}
          className="rounded-2xl bg-card shadow-sm p-6 border border-border flex flex-col gap-4 transition hover:shadow-md"
        >
          <div>
            <h2 className="text-xl font-semibold text-foreground flex items-center gap-3">
              {vault.account.name}
              {vault.account.isLocked && (
                <Lock className="w-3.5 h-3.5 text-muted-foreground" />
              )}
            </h2>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {vault.account.description || 'No description provided.'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-auto">
            <button
              onClick={() => setPanelOpen(true)}
              className="rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 text-white px-3 py-2 text-sm font-medium hover:brightness-105 transition"
            >
              Deposit
            </button>
            <button className="rounded-lg bg-gradient-to-br from-green-500 to-emerald-400 text-white px-3 py-2 text-sm font-medium hover:brightness-105 transition">
              Withdraw
            </button>
            <button
              onClick={() => lockVault.mutateAsync({ account: vault.publicKey })}
              className="rounded-lg bg-gradient-to-br from-yellow-400 to-amber-400 text-white px-3 py-2 text-sm font-medium hover:brightness-105 transition"
            >
              Lock
            </button>
            <button
              onClick={() => unlockVault.mutateAsync({ account: vault.publicKey })}
              className="rounded-lg bg-gradient-to-br from-orange-400 to-red-400 text-white px-3 py-2 text-sm font-medium hover:brightness-105 transition"
            >
              Unlock
            </button>
            <button className="col-span-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 text-white px-3 py-2 text-sm font-medium hover:brightness-105 transition">
              Transfer Ownership
            </button>
            <button className="col-span-2 rounded-lg bg-gradient-to-br from-rose-500 to-red-600 text-white px-3 py-2 text-sm font-medium hover:brightness-105 transition">
              Close Vault
            </button>
          </div>
        </div>
      ))}
    </div>
  ) : (
    <div className="text-muted-foreground text-center text-sm">No Vaults</div>
  )
}
