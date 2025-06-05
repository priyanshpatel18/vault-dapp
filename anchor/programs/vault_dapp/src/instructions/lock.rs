use anchor_lang::prelude::*;

use crate::{
    errors::VaultError,
    states::{UserState, VaultState},
};

#[derive(Accounts)]
#[instruction(vault_id: u64)]
pub struct Lock<'info> {
    pub owner: Signer<'info>,

    #[account(
      seeds = [b"user_state", owner.key().as_ref()],
      bump
    )]
    pub user_state: Account<'info, UserState>,

    #[account(
        mut,
        seeds= [b"vault_state", owner.key().as_ref(), &vault_id.to_le_bytes()],
        bump
    )]
    pub vault: Account<'info, VaultState>,
}

impl Lock<'_> {
    pub fn lock(&mut self, vault_id: u64) -> Result<()> {
        require!(
            self.user_state.vault_count >= vault_id,
            VaultError::InvalidVault
        );
        require!(!self.vault.is_locked, VaultError::VaultAlreadyLocked);

        self.vault.is_locked = true;

        msg!("Vault {} locked by {}", vault_id, self.owner.key());

        Ok(())
    }
}
