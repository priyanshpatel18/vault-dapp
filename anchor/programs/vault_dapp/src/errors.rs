use anchor_lang::prelude::*;

#[error_code]
pub enum VaultError {
    #[msg("Name should be less than 32 characters")]
    InvalidVaultName,
    #[msg("Invalid vault_id")]
    InvalidVault,
    #[msg("Description should be less than 128 characters")]
    InvalidVaultDescription,
    #[msg("Maximum number of vaults reached for this user")]
    VaultCountOverflow,
    #[msg("Vault count underflow")]
    VaultCountUnderflow,
    #[msg("Invalid Amount")]
    InvalidAmount,
    #[msg("Vault is Locked")]
    VaultLocked,
    #[msg("Vault is already unlocked")]
    VaultAlreadyUnlocked,
    #[msg("Vault is already locked")]
    VaultAlreadyLocked,
}
