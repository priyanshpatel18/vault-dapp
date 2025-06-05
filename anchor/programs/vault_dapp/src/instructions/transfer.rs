use anchor_lang::prelude::*;

use crate::{
    errors::VaultError,
    states::{UserState, VaultState},
};

#[derive(Accounts)]
#[instruction(vault_id: u64)]
pub struct Transfer<'info> {
    #[account(mut)]
    pub old_owner: Signer<'info>,

    #[account(
        seeds = [b"user_state", old_owner.key().as_ref()],
        bump
    )]
    pub old_user_state: Account<'info, UserState>,

    #[account(
        mut,
        seeds = [b"vault_state", old_owner.key().as_ref(), &vault_id.to_le_bytes()],
        bump,
        close = old_owner
    )]
    pub old_vault: Account<'info, VaultState>,

    /// CHECK: We only store the pubkey.
    pub new_owner: UncheckedAccount<'info>,

    #[account(
        init_if_needed,
        payer = old_owner,
        space = 8 + UserState::INIT_SPACE,
        seeds = [b"user_state", new_owner.key().as_ref()],
        bump,
    )]
    pub new_user_state: Account<'info, UserState>,

    #[account(
        init,
        payer = old_owner,
        seeds = [b"vault_state", new_owner.key().as_ref(), &(new_user_state.vault_count + 1).to_le_bytes()],
        bump,
        space = 8 + VaultState::INIT_SPACE,
    )]
    pub new_vault: Account<'info, VaultState>,

    pub system_program: Program<'info, System>,
}

impl Transfer<'_> {
    pub fn transfer(&mut self, vault_id: u64) -> Result<()> {
        require!(
            self.old_user_state.vault_count >= vault_id,
            VaultError::InvalidVault
        );
        require!(!self.old_vault.is_locked, VaultError::VaultLocked);

        let old_vault = &self.old_vault;
        let new_vault = &mut self.new_vault;

        new_vault.owner = *self.new_owner.key;
        new_vault.is_locked = old_vault.is_locked;
        new_vault.created_at = old_vault.created_at;
        new_vault.name = old_vault.name.clone();
        new_vault.description = old_vault.description.clone();

        self.old_user_state.vault_count = self
            .old_user_state
            .vault_count
            .checked_sub(1)
            .ok_or(VaultError::VaultCountUnderflow)?;
        self.new_user_state.vault_count = self
            .new_user_state
            .vault_count
            .checked_add(1)
            .ok_or(VaultError::VaultCountOverflow)?;

        msg!(
            "Transferred vault {} ownership from {} to {}",
            vault_id,
            self.old_owner.key(),
            self.new_owner.key()
        );

        Ok(())
    }
}
