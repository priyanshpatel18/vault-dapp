use crate::states::{UserState, VaultState};
use crate::{
    constants::{MAX_DESC_LENGTH, MAX_NAME_LENGTH, MAX_VAULTS_PER_USER},
    errors::VaultError,
};
use anchor_lang::prelude::*;
use anchor_lang::system_program::System;

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(
        init_if_needed,
        payer = signer,
        space = 8 + UserState::INIT_SPACE,
        seeds = [b"user_state", signer.key().as_ref()],
        bump
    )]
    pub user_state: Account<'info, UserState>,

    #[account(
        init,
        payer = signer,
        space = 8 + VaultState::INIT_SPACE,
        seeds = [b"vault_state", signer.key().as_ref(), &(user_state.vault_count + 1).to_le_bytes()],
        bump
    )]
    pub vault: Account<'info, VaultState>,

    pub system_program: Program<'info, System>,
}

impl Initialize<'_> {
    pub fn initialize(&mut self, name: String, description: String) -> Result<()> {
        require!(name.len() < MAX_NAME_LENGTH, VaultError::InvalidVaultName);
        require!(
            description.len() < MAX_DESC_LENGTH,
            VaultError::InvalidVaultDescription
        );

        msg!("Initializing Vault");

        let current_vault_count = self.user_state.vault_count;
        self.user_state.vault_count = current_vault_count + 1;

        self.vault.owner = self.signer.key();
        self.vault.is_locked = false;
        self.vault.created_at = Clock::get()?.unix_timestamp;
        self.vault.name = name;
        self.vault.description = description;

        require!(
            self.user_state.vault_count < MAX_VAULTS_PER_USER,
            VaultError::VaultCountOverflow
        );
        msg!("Vault Initialized");

        Ok(())
    }
}
